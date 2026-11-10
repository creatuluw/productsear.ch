import { listPublished } from '$lib/server/feed/queries';
import type { RequestHandler } from './$types';

// The Drum as RSS 2.0 — announced site-wide via <link rel="alternate">
// (app.html) and the HTTP Link header (hooks.server.ts). Feed hygiene per
// spec.website: atom:link rel="self" for self-identification, stable guids,
// and a Syndication-module update cadence.

const ORIGIN = 'https://productsear.ch';
const CHANNEL_DESC =
	'One draw every 48h — a feed of item types, each showing how a listing can change or enrich a life and its ambitions. The corpus drafts, the drum keeps time.';

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function rfc822(iso: string | null): string {
	const t = iso ? Date.parse(iso) : NaN;
	return Number.isNaN(t) ? new Date().toUTCString() : new Date(t).toUTCString();
}

export const GET: RequestHandler = async () => {
	const items = await listPublished(50);

	const entries = items
		.map((i) => {
			const link = i.body.listing
				? `${ORIGIN}/listings/${i.body.listing.id}`
				: `${ORIGIN}/feed`;
			const desc = i.body.standfirst ?? i.body.paragraphs?.[0] ?? '';
			return `\t<item>
\t\t<title>${esc(i.body.headline)}</title>
\t\t<link>${esc(link)}</link>
\t\t<guid isPermaLink="false">${esc(i.id)}</guid>
\t\t<pubDate>${rfc822(i.publishedAt ?? i.createdAt)}</pubDate>
\t\t<description>${esc(desc)}</description>
\t</item>`;
		})
		.join('\n');

	const lastBuild = items[0] ? rfc822(items[0].publishedAt ?? items[0].createdAt) : rfc822(null);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
\t<channel>
\t\t<title>The Drum — productsear.ch</title>
\t\t<link>${ORIGIN}/feed</link>
\t\t<description>${esc(CHANNEL_DESC)}</description>
\t\t<language>en</language>
\t\t<lastBuildDate>${lastBuild}</lastBuildDate>
\t\t<atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
\t\t<sy:updatePeriod>hourly</sy:updatePeriod>
\t\t<sy:updateFrequency>1</sy:updateFrequency>
${entries}
\t</channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=1800'
		}
	});
};
