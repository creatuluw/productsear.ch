import { json, error } from '@sveltejs/kit';
import { hybridSearch } from '$lib/server/search';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')?.trim();
	if (!q) return json({ query: '', results: [], total: 0, page: 1, pageSize: 20, poolLimited: false });
	if (q.length > 500) error(400, 'Query too long');

	const page = Math.max(1, Math.min(Number(url.searchParams.get('page') ?? 1) || 1, 50));
	const pageSize = 20;
	const started = performance.now();
	const res = await hybridSearch(q, page, pageSize);
	const tookMs = Math.round(performance.now() - started);

	return json({ query: q, tookMs, count: res.results.length, ...res });
};
