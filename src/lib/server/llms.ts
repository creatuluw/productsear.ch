// Content negotiation for ?view=llm surfaces.
// Browser (Accept: text/html) → page renders styled markdown.
// Any other client (curl, LLM fetchers) → raw text/markdown via hooks.server.ts.
import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ARCHETYPES, ARCHETYPE_BY_SLUG } from '$lib/archetypes';
import { hybridSearch } from '$lib/server/search';
import {
	archiveLlmView,
	compendiumGroupLlmView,
	compendiumIndexLlmView,
	llmPreamble,
	searchLlmView
} from '$lib/server/llmview';

const PAGE_SIZE = 20;

function mdResponse(md: string): Response {
	return new Response(md, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'no-store'
		}
	});
}

export function wantsRawMarkdown(url: URL, request: Request): boolean {
	if (url.searchParams.get('view') !== 'llm') return false;
	if (url.searchParams.get('raw') === '1') return true;
	return !request.headers.get('accept')?.includes('text/html');
}

/** Overview markdown for `/` with no query — shared by hooks + page load. */
export async function corpusOverviewMd(): Promise<string> {
	const c = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`);
	const groups = await db.execute<{ archetype: string; n: number }>(sql`
		SELECT t.archetype, count(*)::int AS n
		FROM te9_dev.bookmark_archetypes x, jsonb_array_elements_text(x.archetypes) AS t(archetype)
		GROUP BY t.archetype ORDER BY n DESC`);
	const parts = [
		llmPreamble('/'),
		'',
		'# productsear.ch — search the corpus',
		'',
		`${c[0].n.toLocaleString()} entries, each with purpose/how/when metadata.`,
		'',
		'## Next steps',
		'',
		'- Search: `GET /api/search?q=<problem-shape>&page=N` — short noun phrases, 2–4 words',
		'- This page with a query: append `&q=<query>` to get rendered results',
		'- Browse by archetype: ' +
			groups
				.slice(0, 10)
				.map((g) => `/compendium/${g.archetype} (${g.n})`)
				.join(', '),
		'- Every entry links out — verify it is alive/maintained before adopting'
	];
	return parts.join('\n');
}

/** Build the raw markdown for an llm surface. Returns null for unknown routes. */
export async function llmMarkdown(url: URL): Promise<Response | null> {
	const { pathname } = url;

	if (pathname === '/') {
		const q = url.searchParams.get('q')?.trim() ?? '';
		if (q) {
			const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
			const res = await hybridSearch(q, page, PAGE_SIZE);
			return mdResponse(searchLlmView(q, res, 0));
		}
		return mdResponse(await corpusOverviewMd());
	}

	if (pathname === '/archive') {
		const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
		const totalRows = await db.execute<{ n: number }>(
			sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`
		);
		const total = totalRows[0].n;
		const rows = (await db.execute<{
			title: string;
			url: string;
			category: string | null;
			archetypes: unknown;
			created: string | null;
		}>(sql`
			SELECT b.title, b.url, a.category, COALESCE(x.archetypes,'[]'::jsonb) AS archetypes,
			       b.raindrop_created_at::text AS created
			FROM te9_dev.bookmarks b
			LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
			LEFT JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id
			ORDER BY b.raindrop_created_at DESC NULLS LAST
			LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`)) as {
			title: string;
			url: string;
			category: string | null;
			archetypes: unknown;
			created: string | null;
		}[];
		const entries = rows.map((r) => ({ ...r, archetypes: (r.archetypes as string[]) ?? [] }));
		return mdResponse(archiveLlmView(entries, page, total, PAGE_SIZE));
	}

	if (pathname === '/compendium') {
		const groups = await db.execute<{ archetype: string; n: number }>(sql`
			SELECT t.archetype, count(*)::int AS n
			FROM te9_dev.bookmark_archetypes x, jsonb_array_elements_text(x.archetypes) AS t(archetype)
			GROUP BY t.archetype ORDER BY n DESC`);
		const counts = new Map(groups.map((g) => [g.archetype, g.n]));
		const list = ARCHETYPES.map((a) => ({ slug: a.slug, name: a.name, n: counts.get(a.slug) ?? 0 }))
			.filter((g) => g.n > 0)
			.sort((a, b) => b.n - a.n);
		return mdResponse(compendiumIndexLlmView(list));
	}

	const groupMatch = pathname.match(/^\/compendium\/([a-z0-9-]+)$/);
	if (groupMatch) {
		const archetype = ARCHETYPE_BY_SLUG.get(groupMatch[1]);
		if (!archetype)
			return new Response('unknown archetype\n', {
				status: 404,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			});
		const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1);
		const totalRows = await db.execute<{ n: number }>(sql`
			SELECT count(*)::int AS n FROM te9_dev.bookmark_archetypes x
			WHERE x.archetypes @> ${JSON.stringify([archetype.slug])}::jsonb`);
		const n = totalRows[0].n;
		const rows = (await db.execute<{
			title: string;
			url: string;
			purpose: string | null;
			how_to_use: string | null;
			when_to_use: string | null;
			category: string | null;
			created: string | null;
		}>(sql`
			SELECT b.title, b.url, a.purpose, a.how_to_use, a.when_to_use, a.category,
			       b.raindrop_created_at::text AS created
			FROM te9_dev.bookmark_archetypes x
			JOIN te9_dev.bookmarks b ON b.id = x.bookmark_id
			LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
			WHERE x.archetypes @> ${JSON.stringify([archetype.slug])}::jsonb
			ORDER BY b.raindrop_created_at DESC NULLS LAST
			LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`)) as {
			title: string;
			url: string;
			purpose: string | null;
			how_to_use: string | null;
			when_to_use: string | null;
			category: string | null;
			created: string | null;
		}[];
		const entries = rows.map((r) => ({
			...r,
			howToUse: r.how_to_use,
			whenToUse: r.when_to_use
		}));
		return mdResponse(
			compendiumGroupLlmView({ slug: archetype.slug, name: archetype.name, n }, entries)
		);
	}

	return null;
}
