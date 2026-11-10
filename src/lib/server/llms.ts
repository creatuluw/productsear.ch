// Content negotiation for ?view=llm surfaces.
// Browser (Accept: text/html) → page renders styled markdown.
// Any other client (curl, LLM fetchers) → raw text/markdown via hooks.server.ts.
import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { ARCHETYPES, ARCHETYPE_BY_SLUG } from '$lib/archetypes';
import { hybridSearch } from '$lib/server/search';
import {
	archiveLlmView,
	collectionsGroupLlmView,
	collectionsIndexLlmView,
	feedLlmView,
	listingStackLlmView,
	llmPreamble,
	methodologyLlmView,
	searchLlmView
} from '$lib/server/llmview';
import { listPublished } from '$lib/server/feed/queries';
import { nextDueInfo } from '$lib/server/feed/rotation';
import { getStack } from '$lib/server/feed/stack';

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
	if (isMarkdownUserAgent(request)) return true;
	return !request.headers.get('accept')?.includes('text/html');
}

// Clients that get raw markdown for ?view=llm INSTANTLY — even when they send
// Accept: text/html (many LLM fetchers mimic browsers): known LLM/agent user
// agents plus common non-browser HTTP clients (curl, scripts, SDKs). Real
// browser UAs never match, so the humans|llms tab switch stays untouched.
const MARKDOWN_USER_AGENTS: RegExp[] = [
	// AI assistants & their crawlers/fetchers
	/gpt|chatgpt|oai-|openai|claude|anthropic|perplexity|mistral|cohere-ai|youbot|deepseek|qwen|grok|xai/i,
	/meta-externalagent|bytespider|diffbot|google-extended|applebot-extended|imagesift|amazonbot/i,
	/\bllm\b|ai-?agent|ai-?crawler|ai-?search|webscraper|web-?fetcher/i,
	// CLI tools, scripts, SDKs, agent frameworks (anchored: UA starts with them)
	/^(curl|wget|httpie|python-requests|python-urllib|httpx|aiohttp|axios|node-fetch|undici|go-http-client|okhttp|java-|apache-httpclient|libwww|scrapy|postmanruntime|insomnia|powershell|dart|websocket)/i,
	/langchain|llama-?index|autogen|crewai|mcp-/i
];

function isMarkdownUserAgent(request: Request): boolean {
	const ua = request.headers.get('user-agent') ?? '';
	return ua.length > 0 && MARKDOWN_USER_AGENTS.some((re) => re.test(ua));
}

/** Overview markdown for `/` with no query — shared by hooks + page load. */
export async function corpusOverviewMd(): Promise<string> {
	const c = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`);
	const r = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks WHERE raindrop_created_at >= now() - interval '30 days'`);
	const groups = await db.execute<{ archetype: string; n: number }>(sql`
		SELECT t.archetype, count(*)::int AS n
		FROM te9_dev.bookmark_archetypes x, jsonb_array_elements_text(x.archetypes) AS t(archetype)
		GROUP BY t.archetype ORDER BY n DESC`);
	const parts = [
		llmPreamble('/'),
		'',
		'# productsear.ch — search the corpus',
		'',
		`${c[0].n.toLocaleString()} entries (${r[0].n.toLocaleString()} added in the last 30 days), each with purpose/how/when metadata.`,
		'',
		'## Next steps',
		'',
		'- Search: `GET https://productsear.ch/api/search?q=<problem-shape>&page=N` — JSON; add `&format=md` for markdown output',
		'- This page with a query: append `&q=<query>` to get rendered results',
		'- Full usage guide: https://productsear.ch/skill.md',
		'- Site map for agents: https://productsear.ch/llms.txt — RSS: https://productsear.ch/feed.xml',
		'- Browse by archetype: ' +
			groups
				.slice(0, 10)
				.map((g) => `/collections/${g.archetype} (${g.n})`)
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
		const last30 = url.searchParams.get('last') === '30';
		const dateFilter = last30
			? sql`WHERE b.raindrop_created_at >= now() - interval '30 days'`
			: sql``;
		const totalRows = await db.execute<{ n: number }>(
			sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks b ${dateFilter}`
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
			${dateFilter}
			ORDER BY b.raindrop_created_at DESC NULLS LAST
			LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`)) as {
			title: string;
			url: string;
			category: string | null;
			archetypes: unknown;
			created: string | null;
		}[];
		const entries = rows.map((r) => ({ ...r, archetypes: (r.archetypes as string[]) ?? [] }));
		return mdResponse(archiveLlmView(entries, page, total, PAGE_SIZE, last30));
	}

	if (pathname === '/collections') {
		const groups = await db.execute<{ archetype: string; n: number }>(sql`
			SELECT t.archetype, count(*)::int AS n
			FROM te9_dev.bookmark_archetypes x, jsonb_array_elements_text(x.archetypes) AS t(archetype)
			GROUP BY t.archetype ORDER BY n DESC`);
		const counts = new Map(groups.map((g) => [g.archetype, g.n]));
		const list = ARCHETYPES.map((a) => ({ slug: a.slug, name: a.name, n: counts.get(a.slug) ?? 0 }))
			.filter((g) => g.n > 0)
			.sort((a, b) => b.n - a.n);
		return mdResponse(collectionsIndexLlmView(list));
	}

	const groupMatch = pathname.match(/^\/collections\/([a-z0-9-]+)$/);
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
			collectionsGroupLlmView({ slug: archetype.slug, name: archetype.name, n }, entries)
		);
	}

	if (pathname === '/feed') {
		const items = await listPublished(50);
		const due = await nextDueInfo();
		return mdResponse(feedLlmView(items, due));
	}

	if (pathname === '/feed/methodology') {
		return mdResponse(methodologyLlmView());
	}

	const listingMatch = pathname.match(/^\/listings\/(\d+)$/);
	if (listingMatch) {
		const stack = await getStack(Number(listingMatch[1]));
		if (!stack)
			return new Response('listing not found\n', {
				status: 404,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			});
		return mdResponse(listingStackLlmView(stack));
	}

	return null;
}
