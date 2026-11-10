import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ARCHETYPES } from '$lib/archetypes';
import type { RequestHandler } from './$types';

// llms.txt — the curated index of this site for LLMs and AI agents
// (llmstxt.org convention; announced via <link rel="llms-txt"> and the HTTP
// Link header on every HTML response). Built with live corpus stats so the
// numbers agents see are real. Announced links use absolute URLs per the
// convention (agents fetch from arbitrary contexts).

const ORIGIN = 'https://productsear.ch';

export const GET: RequestHandler = async () => {
	const [c, r, s] = await Promise.all([
		db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`),
		db.execute<{ n: number }>(
			sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks WHERE raindrop_created_at >= now() - interval '30 days'`
		),
		db.execute<{ t: string | null }>(sql`SELECT max(synced_at)::date::text AS t FROM te9_dev.bookmarks`)
	]);

	const total = c[0]?.n ?? 0;
	const recent = r[0]?.n ?? 0;
	const synced = s[0]?.t ?? 'unknown';

	const collections = ARCHETYPES.map(
		(a) =>
			`- [${a.name}](${ORIGIN}/collections/${a.slug}): listings tagged "${a.name.toLowerCase()}"`
	).join('\n');

	const md = `# productsear.ch

> Semantic search over a curated corpus of ${total.toLocaleString('en-US')} developer tools, digital products and open-source projects. Every entry carries purpose / how / when metadata so you can judge fit without opening the link.

## Search (the primary use)

- [Agent usage guide](${ORIGIN}/skill.md): query shapes, workflow, limits — start here
- Search API: \`GET ${ORIGIN}/api/search?q={problem-shape}&page=N\` — JSON; add \`&format=md\` for markdown output
- Markdown twins: append \`?view=llm\` to ANY page URL — LLM clients get raw \`text/markdown\` via content negotiation automatically

## Surfaces

- [Home / search](${ORIGIN}/): natural-language search; results explain what each listing does, how to use it, and when it fits
- [Listings archive](${ORIGIN}/archive): every entry, newest first, paginated
- [Collections](${ORIGIN}/collections): the corpus rolled up into ${ARCHETYPES.length} archetypes
- [The Drum](${ORIGIN}/feed): one draw every 48h — editorial cards on how a listing can change or enrich a life and its ambitions
- [How the Drum works](${ORIGIN}/feed/methodology)
- [RSS feed](${ORIGIN}/feed.xml): The Drum as RSS 2.0
- [llms.txt](${ORIGIN}/llms.txt): this file
- [XML sitemap](${ORIGIN}/sitemap.xml): hub surfaces and the ${ARCHETYPES.length} collections (listing pages are crawled via the archive)

## Collections

${collections}

## Data notes

- ${recent.toLocaleString('en-US')} entries added in the last 30 days; corpus last synced ${synced}
- Listing pages live at \`${ORIGIN}/listings/{id}\` — same metadata, plus drum cards and embedding neighbors ("The Walk")
- Hybrid retrieval: pgvector cosine + PostgreSQL full-text, reciprocal-rank-fusion, cross-encoder reranked, relevance floor 0.45
- robots.txt: AI crawlers explicitly welcome
- Analytics are cookieless (Plausible); no tracking on API or markdown surfaces

`;

	return new Response(md, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
