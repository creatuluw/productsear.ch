import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

// What are people searching for? Raw append-only log (search_logs) plus
// quick aggregates. Read-only — no form actions.
export const load: PageServerLoad = async () => {
	const recent = await db.execute<{
		id: number;
		query: string;
		source: string;
		results: number;
		took_ms: number | null;
		created_at: string;
	}>(
		sql`SELECT id, query, source, results, took_ms, created_at::text AS created_at
			FROM te9_dev.search_logs
			ORDER BY created_at DESC
			LIMIT 50`
	);

	const stats = await db.execute<{
		today: number;
		last7d: number;
		zero7d: number;
	}>(sql`
		SELECT
			count(*) FILTER (WHERE created_at >= now() - interval '24 hours')::int AS today,
			count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS last7d,
			count(*) FILTER (WHERE created_at >= now() - interval '7 days' AND results = 0)::int AS zero7d
		FROM te9_dev.search_logs`);

	const top = await db.execute<{ query: string; n: number; sources: string }>(sql`
		SELECT query, count(*)::int AS n, string_agg(DISTINCT source, ',') AS sources
		FROM te9_dev.search_logs
		WHERE created_at >= now() - interval '7 days'
		GROUP BY query
		ORDER BY n DESC, max(created_at) DESC
		LIMIT 10`);

	const topMisses = await db.execute<{ query: string; n: number }>(sql`
		SELECT query, count(*)::int AS n
		FROM te9_dev.search_logs
		WHERE created_at >= now() - interval '7 days' AND results = 0
		GROUP BY query
		ORDER BY n DESC
		LIMIT 10`);

	return {
		recent,
		stats: stats[0] ?? { today: 0, last7d: 0, zero7d: 0 },
		top,
		topMisses
	};
};
