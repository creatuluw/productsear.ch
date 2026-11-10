import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { FEED_TYPE_BY_SLUG, type FeedType } from '$lib/server/feed/types';
import { listingCardSvg, ogResponse, renderOgPng } from '$lib/server/og';
import type { RequestHandler } from './$types';

// Receipt card: a 1200×630 PNG carrying the argument, not just the title —
// type tag + headline + standfirst + the listing it is anchored to. Design
// and fonts live in $lib/server/og (see docs/wiki decision for why resvg).

export const GET: RequestHandler = async ({ params }) => {
	const listingId = Number(params.id);
	if (!Number.isInteger(listingId) || listingId <= 0) {
		return new Response('bad listing id', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
	}

	const rows = await db.execute<{
		type: string;
		headline: string;
		standfirst: string | null;
		domain: string | null;
		listing_url: string;
	}>(sql`
		SELECT f.type, f.body->>'headline' AS headline, f.body->>'standfirst' AS standfirst,
		       b.domain, b.url AS listing_url
		FROM te9_dev.feed_items f
		JOIN te9_dev.bookmarks b ON b.id = f.listing_id
		WHERE f.listing_id = ${listingId} AND f.status = 'published'
		ORDER BY f.published_at DESC NULLS LAST, f.created_at DESC
		LIMIT 1`);

	if (!rows[0]) {
		return new Response('no published card for this listing', {
			status: 404,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		});
	}

	const svg = listingCardSvg({
		typeName: FEED_TYPE_BY_SLUG.get(rows[0].type as FeedType)?.name ?? rows[0].type,
		headline: rows[0].headline,
		standfirst: rows[0].standfirst,
		domain: rows[0].domain,
		listingUrl: rows[0].listing_url
	});

	return ogResponse(renderOgPng(svg));
};
