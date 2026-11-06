import { asc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { db, adminSettings } from '$lib/server/db';
import { requireAdmin } from '$lib/server/admin-guard';
import { clearSettingsCache } from '$lib/server/admin-settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(adminSettings).orderBy(asc(adminSettings.key));
	return { rows };
};

export const actions: Actions = {
	// add or update in one move (key is the primary key — resubmitting a key overwrites)
	upsert: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const key = String(fd.get('key') ?? '').trim();
		const value = String(fd.get('value') ?? '');
		const description = String(fd.get('description') ?? '').trim();
		if (!key || !value) return fail(400, { error: 'Key and value are required.' });
		await db
			.insert(adminSettings)
			.values({ key, value, description: description || null })
			.onConflictDoUpdate({
				target: adminSettings.key,
				set: { value, description: description || null, updatedAt: new Date() }
			});
		clearSettingsCache();
		return { ok: true };
	},

	// inline per-row value update
	update: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const key = String(fd.get('key') ?? '');
		const value = String(fd.get('value') ?? '');
		if (!key || !value) return fail(400, { error: 'Value is required.' });
		await db
			.update(adminSettings)
			.set({ value, updatedAt: new Date() })
			.where(eq(adminSettings.key, key));
		clearSettingsCache();
		return { ok: true };
	},

	delete: async ({ request }) => {
		await requireAdmin(request.headers);
		const key = String((await request.formData()).get('key') ?? '');
		await db.delete(adminSettings).where(eq(adminSettings.key, key));
		clearSettingsCache();
		return { ok: true };
	}
};
