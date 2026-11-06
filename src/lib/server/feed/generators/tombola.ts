// The Tombola — the drum pulls from the last 10 saves and narrates the one
// most in tune with current corpus signals (spec Q9-B: corpus-derived scoring,
// same brain as The Pulse). Score = how much the candidate's archetypes are
// drifting upward in the last 30 days, plus a small recency nudge.

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import type { GeneratorResult } from '../types';

const DRIFT_POOL_SIZE = 10;

interface Candidate {
	id: number;
	title: string;
	url: string;
	domain: string | null;
	excerpt: string | null;
	purpose: string | null;
	created: string | null;
	archetypes: string[];
	score: number;
}

export async function generateTombola(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		excerpt: string | null;
		purpose: string | null;
		created: string | null;
		archetypes: unknown;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain, b.excerpt, a.purpose,
		       b.raindrop_created_at::text AS created,
		       COALESCE(x.archetypes, '[]'::jsonb) AS archetypes
		FROM te9_dev.bookmarks b
		LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		LEFT JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id
		ORDER BY b.raindrop_created_at DESC NULLS LAST
		LIMIT ${DRIFT_POOL_SIZE}`);

	if (rows.length === 0) return null;

	// corpus signal: how much each archetype appears in the last 30 days of saves
	const drift = await db.execute<{ archetype: string; n: number }>(sql`
		SELECT t.archetype, count(*)::int AS n
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id,
		     jsonb_array_elements_text(x.archetypes) AS t(archetype)
		WHERE b.raindrop_created_at >= now() - interval '30 days'
		GROUP BY t.archetype`);
	const driftMap = new Map(drift.map((d) => [d.archetype, d.n]));

	const candidates: Candidate[] = rows.map((r) => {
		const archetypes = (r.archetypes as string[]) ?? [];
		const driftScore = archetypes.reduce((sum, a) => sum + (driftMap.get(a) ?? 0), 0);
		const recency = r.created ? Math.max(0, 10 - (Date.now() - new Date(r.created).getTime()) / 86_400_000) : 0;
		return { ...r, archetypes, score: driftScore + recency / 10 };
	});

	const unused = candidates.filter((c) => !used.has(c.id));
	const pick = (unused.length > 0 ? unused : candidates).sort((a, b) => b.score - a.score)[0];
	const hotArchetypes = pick.archetypes.filter((a) => (driftMap.get(a) ?? 0) > 0);
	const reason = hotArchetypes.length
		? `its ${hotArchetypes.join(' + ')} signal is hot in this month's saves`
		: 'the drum liked its timing';

	return {
		listingId: pick.id,
		body: {
			headline: pick.title,
			standfirst: `Drawn from the last ${DRIFT_POOL_SIZE} saves — the drum picked this one because ${reason}.`,
			listing: { id: pick.id, title: pick.title, url: pick.url, domain: pick.domain, created: pick.created },
			paragraphs: pick.purpose?.trim() ? [pick.purpose.trim()] : [],
			question: 'Would you have saved it?'
		},
		signals: {
			generator: 'tombola',
			poolSize: DRIFT_POOL_SIZE,
			scores: Object.fromEntries(candidates.map((c) => [c.id, Number(c.score.toFixed(2))])),
			winnerScore: Number(pick.score.toFixed(2)),
			drift30d: Object.fromEntries(driftMap)
		}
	};
}
