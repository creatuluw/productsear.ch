import { asc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { db, adminFeatures } from '$lib/server/db';
import { requireAdmin } from '$lib/server/admin-guard';
import { clearSettingsCache } from '$lib/server/admin-settings';
import { slugify } from '$lib/server/admin-util';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(adminFeatures).orderBy(asc(adminFeatures.key));
	return { rows };
};

export const actions: Actions = {
	create: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const label = String(fd.get('label') ?? '').trim();
		const rawKey = String(fd.get('key') ?? '').trim();
		const description = String(fd.get('description') ?? '').trim();
		if (!label) return fail(400, { error: 'Label is required.' });
		const key = rawKey ? slugify(rawKey) : slugify(label);
		try {
			await db.insert(adminFeatures).values({ key, label, description: description || null });
		} catch {
			return fail(400, { error: `Could not create — flag "${key}" already exists.` });
		}
		return { ok: true };
	},

	toggle: async ({ request }) => {
		await requireAdmin(request.headers);
		const key = String((await request.formData()).get('key') ?? '');
		const [row] = await db
			.select({ enabled: adminFeatures.enabled })
			.from(adminFeatures)
			.where(eq(adminFeatures.key, key))
			.limit(1);
		if (!row) return fail(404, { error: 'Flag not found.' });
		await db
			.update(adminFeatures)
			.set({ enabled: !row.enabled, updatedAt: new Date() })
			.where(eq(adminFeatures.key, key));
		clearSettingsCache();
		return { ok: true };
	},

	delete: async ({ request }) => {
		await requireAdmin(request.headers);
		const key = String((await request.formData()).get('key') ?? '');
		await db.delete(adminFeatures).where(eq(adminFeatures.key, key));
		clearSettingsCache();
		return { ok: true };
	}
};
