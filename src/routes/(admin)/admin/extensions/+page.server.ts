import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { db, adminExtensions } from '$lib/server/db';
import { requireAdmin } from '$lib/server/admin-guard';
import { slugify } from '$lib/server/admin-util';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(adminExtensions).orderBy(desc(adminExtensions.createdAt));
	return { rows };
};

export const actions: Actions = {
	create: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const name = String(fd.get('name') ?? '').trim();
		const description = String(fd.get('description') ?? '').trim();
		if (!name) return fail(400, { error: 'Name is required.' });
		const slug = slugify(name);
		try {
			await db
				.insert(adminExtensions)
				.values({ name, slug, description: description || null });
		} catch {
			return fail(400, { error: `Could not create — slug "${slug}" already exists.` });
		}
		return { ok: true };
	},

	toggle: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		const [row] = await db
			.select({ enabled: adminExtensions.enabled })
			.from(adminExtensions)
			.where(eq(adminExtensions.id, id))
			.limit(1);
		if (!row) return fail(404, { error: 'Extension not found.' });
		await db
			.update(adminExtensions)
			.set({ enabled: !row.enabled, updatedAt: new Date() })
			.where(eq(adminExtensions.id, id));
		return { ok: true };
	},

	delete: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		await db.delete(adminExtensions).where(eq(adminExtensions.id, id));
		return { ok: true };
	}
};
