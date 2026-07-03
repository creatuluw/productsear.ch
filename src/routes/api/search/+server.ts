import { json, error } from '@sveltejs/kit';
import { hybridSearch } from '$lib/server/search';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q) return json({ results: [], query: '' });
	if (q.length > 500) error(400, 'Query too long');

	const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 50);
	const started = performance.now();
	const results = await hybridSearch(q, limit);
	const tookMs = Math.round(performance.now() - started);

	return json({ query: q, tookMs, count: results.length, results });
};
