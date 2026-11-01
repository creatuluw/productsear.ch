import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { archiveLlmView } from '$lib/server/llmview';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 20;

// Every entry, newest first by true creation date (raindrop_created_at —
// NOT synced_at, which the external sync rewrites on every pass).
export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);

	const totalRows = await db.execute<{ n: number }>(
		sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`
	);
	const total = totalRows[0].n;
	const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
	if (page > maxPage) error(404, 'page out of range');

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		category: string | null;
		archetypes: unknown;
		created: string | null;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain,
		       a.category,
		       COALESCE(x.archetypes, '[]'::jsonb) AS archetypes,
		       b.raindrop_created_at::text AS created
		FROM te9_dev.bookmarks b
		LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		LEFT JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id
		ORDER BY b.raindrop_created_at DESC NULLS LAST
		LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
	`);

	const entries = rows.map((r) => ({
		id: r.id,
		title: r.title,
		url: r.url,
		domain: r.domain,
		category: r.category,
		archetypes: (r.archetypes as string[]) ?? [],
		created: r.created
	}));

	if (url.searchParams.get('view') === 'llm') {
		return {
			entries,
			total,
			page,
			pageSize: PAGE_SIZE,
			llm: archiveLlmView(entries, page, total, PAGE_SIZE)
		};
	}
	return { entries, total, page, pageSize: PAGE_SIZE, llm: null };
};
