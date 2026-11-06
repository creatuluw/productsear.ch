import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { hybridSearch } from '$lib/server/search';
import { searchLlmView } from '$lib/server/llmview';
	import { corpusOverviewMd } from '$lib/server/llms';
import { getFeedSettings, listPublished } from '$lib/server/feed/queries';
import { FEED_TYPE_BY_SLUG, type FeedType } from '$lib/server/feed/types';
import type { PageServerLoad } from './$types';

// Live corpus state for the instrument readout + the ?view=llm twin.
// Optionally carries the latest drum cards (admin-flagged, spec slice E:
// center space, vanish the moment a search starts — the client shows them
// only in the idle no-query state).
export const load: PageServerLoad = async ({ url }) => {
	const c = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`);
	const s = await db.execute<{ t: string | null }>(
		sql`SELECT max(synced_at)::text AS t FROM te9_dev.bookmarks`
	);
	const a = await db.execute<{ n: number }>(
		sql`SELECT count(*)::int AS n FROM te9_dev.bookmark_analysis`
	);
	const r = await db.execute<{ n: number }>(
		sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks WHERE raindrop_created_at >= now() - interval '30 days'`
	);

	const data = {
		bookmarkCount: c[0].n,
		lastSynced: s[0].t,
		analyzedCount: a[0].n,
		recentCount: r[0].n
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

	const settings = await getFeedSettings();
	let drum: { items: Array<{ id: string; typeName: string; headline: string; standfirst: string | null; listingId: number | null }> } | null = null;
	if (settings.homepageCardsEnabled) {
		const latest = await listPublished(3);
		drum = {
			items: latest.map((i) => ({
				id: i.id,
				typeName: FEED_TYPE_BY_SLUG.get(i.type as FeedType)?.name ?? i.type,
				headline: i.body.headline,
				standfirst: i.body.standfirst ?? null,
				listingId: i.listingId
			}))
		};
	}
	return { ...data, drum };
};
