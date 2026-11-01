import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { hybridSearch } from '$lib/server/search';
import { searchLlmView } from '$lib/server/llmview';
	import { corpusOverviewMd } from '$lib/server/llms';
import type { PageServerLoad } from './$types';

// Live corpus state for the instrument readout + the ?view=llm twin.
export const load: PageServerLoad = async ({ url }) => {
	const c = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`);
	const s = await db.execute<{ t: string | null }>(
		sql`SELECT max(synced_at)::text AS t FROM te9_dev.bookmarks`
	);
	const a = await db.execute<{ n: number }>(
		sql`SELECT count(*)::int AS n FROM te9_dev.bookmark_analysis`
	);

	const data = {
		bookmarkCount: c[0].n,
		lastSynced: s[0].t,
		analyzedCount: a[0].n
	};

	if (url.searchParams.get('view') === 'llm') {
		const q = url.searchParams.get('q')?.trim() ?? '';
		const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
		if (q) {
			const res = await hybridSearch(q, page, 20);
			return { ...data, llm: searchLlmView(q, res, 0) };
		}
		return { ...data, llm: await corpusOverviewMd() };
	}
	return data;
};
