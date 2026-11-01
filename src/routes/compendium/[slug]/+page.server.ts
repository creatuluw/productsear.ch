import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ARCHETYPE_BY_SLUG } from '$lib/archetypes';
import { compendiumGroupLlmView } from '$lib/server/llmview';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 20;

function normalizeTags(raw: string | null): string | null {
	if (!raw) return null;
	const t = raw.trim();
	if (t.startsWith('[')) {
		try {
			const arr = JSON.parse(t) as unknown[];
			return arr.map(String).join(', ');
		} catch {
			return t;
		}
	}
	return t;
}

// One archetype group: every entry carrying this archetype, newest first,
// with the full who/what/how/when analysis block.
export const load: PageServerLoad = async ({ params, url }) => {
	const archetype = ARCHETYPE_BY_SLUG.get(params.slug);
	if (!archetype) error(404, 'unknown archetype');

	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);

	const totalRows = await db.execute<{ n: number }>(sql`
		SELECT count(*)::int AS n
		FROM te9_dev.bookmark_archetypes x
		WHERE x.archetypes @> ${JSON.stringify([archetype.slug])}::jsonb
	`);
	const n = totalRows[0].n;
	const maxPage = Math.max(1, Math.ceil(n / PAGE_SIZE));
	if (page > maxPage) error(404, 'page out of range');

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		purpose: string | null;
		how_to_use: string | null;
		when_to_use: string | null;
		category: string | null;
		tags: string | null;
		created: string | null;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain,
		       a.purpose, a.how_to_use, a.when_to_use, a.category, a.tags,
		       b.raindrop_created_at::text AS created
		FROM te9_dev.bookmark_archetypes x
		JOIN te9_dev.bookmarks b ON b.id = x.bookmark_id
		LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		WHERE x.archetypes @> ${JSON.stringify([archetype.slug])}::jsonb
		ORDER BY b.raindrop_created_at DESC NULLS LAST
		LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
	`);

	const entries = rows.map((r) => ({
		id: r.id,
		title: r.title,
		url: r.url,
		domain: r.domain,
		purpose: r.purpose,
		howToUse: r.how_to_use,
		whenToUse: r.when_to_use,
		category: r.category,
		// analysis tags are stored as a JSON array string — normalize for chip rendering
		tags: normalizeTags(r.tags),
		created: r.created
	}));

	if (url.searchParams.get('view') === 'llm') {
		return {
			group: { slug: archetype.slug, name: archetype.name, n },
			entries,
			page,
			pageSize: PAGE_SIZE,
			llm: compendiumGroupLlmView({ slug: archetype.slug, name: archetype.name, n }, entries)
		};
	}
	return { group: { slug: archetype.slug, name: archetype.name, n }, entries, page, pageSize: PAGE_SIZE, llm: null };
};
