import { json, error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { hybridSearch } from '$lib/server/search';
import { searchApiMd } from '$lib/server/llmview';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, request }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q) return json({ query: '', results: [], total: 0, page: 1, pageSize: 20, poolLimited: false });
	if (q.length > 500) error(400, 'Query too long');

	const page = Math.max(1, Math.min(Number(url.searchParams.get('page') ?? 1) || 1, 50));
	const pageSize = 20;
	const started = performance.now();
	const res = await hybridSearch(q, page, pageSize);
	const tookMs = Math.round(performance.now() - started);

	// The Floor's raw material: log zero-result searches (below the 0.45
	// relevance floor). Fire-and-forget — logging must never slow a search.
	// Only aggregated themes are ever published, never raw queries.
	if (res.total === 0) {
		db.execute(sql`INSERT INTO te9_dev.search_misses (query) VALUES (${q.slice(0, 300)})`).catch(() => {});
	}

	// Markdown output for LLM clients: ?format=md or Accept: text/markdown.
	// JSON remains the default for backward compatibility.
	const wantsMd =
		url.searchParams.get('format') === 'md' ||
		(request.headers.get('accept') ?? '').includes('text/markdown');
	if (wantsMd) {
		return new Response(searchApiMd(q, res, tookMs), {
			headers: {
				'Content-Type': 'text/markdown; charset=utf-8',
				'Cache-Control': 'no-store'
			}
		});
	}

	return json({ query: q, tookMs, count: res.results.length, ...res });
};
