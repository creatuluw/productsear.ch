import { ARCHETYPES } from '$lib/archetypes';
import type { RequestHandler } from './$types';

// XML sitemap — hub surfaces + collections only. Individual listing pages are
// intentionally excluded: they're all reachable from /archive and
// /collections (crawlable via internal links), and a 4.4k-URL sitemap of thin
// pages costs crawl budget without ranking upside. Announced via robots.txt
// and the HTTP Link header (hooks.server.ts).
const ORIGIN = 'https://productsear.ch';

function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async () => {
	const paths = ['/', '/archive', '/collections', '/feed', '/feed/methodology', '/skill.md'];
	const urls = paths.map((p) => `\t<url>\n\t\t<loc>${esc(ORIGIN + p)}</loc>\n\t</url>`);
	for (const a of ARCHETYPES) {
		urls.push(`\t<url>\n\t\t<loc>${esc(`${ORIGIN}/collections/${a.slug}`)}</loc>\n\t</url>`);
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
