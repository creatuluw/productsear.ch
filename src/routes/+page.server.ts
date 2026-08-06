import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

// Live corpus state for the homepage hero readout: corpus size + when the
// external Raindrop sync last touched the table. Cheap scalar queries.
export const load: PageServerLoad = async () => {
	const c = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM te9_dev.bookmarks`);
	const s = await db.execute<{ t: string | null }>(
		sql`SELECT max(synced_at)::text AS t FROM te9_dev.bookmarks`
	);
	return { bookmarkCount: c[0].n, lastSynced: s[0].t };
};
