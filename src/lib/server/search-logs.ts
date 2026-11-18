// Search logging — one append-only row per executed search, for the owner's
// "what are people searching for" view in the admin console. Fire-and-forget:
// logging must never slow down or fail a search (same contract as the
// search_misses insert in /api/search).

import { sql } from 'drizzle-orm';
import { db } from './db';

/** web = the site's own UI · api = external callers of GET /api/search · llm = the ?view=llm machine twin */
export type SearchSource = 'web' | 'api' | 'llm';

export function logSearch(query: string, source: SearchSource, results: number, tookMs: number): void {
	db.execute(
		sql`INSERT INTO te9_dev.search_logs (query, source, results, took_ms)
			VALUES (${query.slice(0, 300)}, ${source}, ${results}, ${Math.round(tookMs)})`
	).catch(() => {});
}
