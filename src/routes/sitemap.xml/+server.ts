import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ARCHETYPES } from '$lib/archetypes';
import type { RequestHandler } from './$types';

// XML sitemap — static surfaces + every collection + every listing page.
// Search engines discover it via robots.txt and the HTTP Link header
// (hooks.server.ts). Listings are the long tail: one URL per corpus entry.
const ORIGIN = 'https://productsear.ch';
const MAX_URLS = 50_000; // sitemap protocol cap

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function entry(loc: string, lastmod?: string | null): string {
	const lm = lastmod ? `\n\t\t<lastmod>${esc(lastmod.slice(0, 10))}</lastmod>` : '';
	return `\t<url>\n\t\t<loc>${esc(loc)}</loc>${lm}\n\t</url>`;
}

export const GET: RequestHandler = async () => {
	const staticPaths = ['/', '/archive', '/collections', '/feed', '/feed/methodology', '/skill.md'];
	const urls = staticPaths.map((p) => entry(ORIGIN + p));
	for (const a of ARCHETYPES) urls.push(entry(`${ORIGIN}/collections/${a.slug}`));

	try {
		const rows = await db.execute<{ id: number; d: string | null }>(
			sql`SELECT id, raindrop_created_at::date::text AS d
				FROM te9_dev.bookmarks
				ORDER BY id
				LIMIT ${MAX_URLS - urls.length}`
		);
		for (const r of rows) urls.push(entry(`${ORIGIN}/listings/${r.id}`, r.d));
	} catch {
		// sitemap without listing URLs is still valid — fail soft
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
