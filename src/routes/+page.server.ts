import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

// Live corpus size for the homepage hero. Cheap count(*) — the bookmarks table
// is the read-only Raindrop-synced mirror; this is what "search over N" means.
export const load: PageServerLoad = async () => {
	const rows = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`);
	return { bookmarkCount: rows[0].n };
};
