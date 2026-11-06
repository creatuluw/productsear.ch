import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { db, adminAgents } from '$lib/server/db';
import { requireAdmin } from '$lib/server/admin-guard';
import { slugify } from '$lib/server/admin-util';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db.select().from(adminAgents).orderBy(desc(adminAgents.createdAt));
	return { rows };
};

export const actions: Actions = {
	create: async ({ request }) => {
		await requireAdmin(request.headers);
		const fd = await request.formData();
		const name = String(fd.get('name') ?? '').trim();
		const model = String(fd.get('model') ?? '').trim();
		const description = String(fd.get('description') ?? '').trim();
		const systemPrompt = String(fd.get('system_prompt') ?? '').trim();
		if (!name) return fail(400, { error: 'Name is required.' });
		const slug = slugify(name);
		try {
			await db.insert(adminAgents).values({
				name,
				slug,
				model: model || null,
				description: description || null,
				systemPrompt
			});
		} catch {
			return fail(400, { error: `Could not create — slug "${slug}" already exists.` });
		}
		return { ok: true };
	},

	toggle: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		const [row] = await db
			.select({ enabled: adminAgents.enabled })
			.from(adminAgents)
			.where(eq(adminAgents.id, id))
			.limit(1);
		if (!row) return fail(404, { error: 'Agent not found.' });
		await db
			.update(adminAgents)
			.set({ enabled: !row.enabled, updatedAt: new Date() })
			.where(eq(adminAgents.id, id));
		return { ok: true };
	},

	delete: async ({ request }) => {
		await requireAdmin(request.headers);
		const id = String((await request.formData()).get('id') ?? '');
		await db.delete(adminAgents).where(eq(adminAgents.id, id));
		return { ok: true };
	}
};
