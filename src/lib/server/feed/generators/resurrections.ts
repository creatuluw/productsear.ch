// Resurrections — a save untouched for 300–900 days gets a second life.
// Cheapest type in the drum: a date query plus a draft. The corpus knows the
// save date; "untouched" is honest phrasing around raindrop_created_at, since
// the mirror carries no visit data.

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import type { GeneratorResult } from '../types';

interface Candidate {
	id: number;
	title: string;
	url: string;
	domain: string | null;
	excerpt: string | null;
	purpose: string | null;
	created: string | null;
	archetypes: string[];
}

export async function generateResurrection(): Promise<GeneratorResult | null> {
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
		WHERE b.raindrop_created_at < now() - interval '300 days'
		  AND b.raindrop_created_at > now() - interval '900 days'
		ORDER BY random()
		LIMIT 12`);

	const candidates: Candidate[] = rows
		.map((r) => ({ ...r, archetypes: (r.archetypes as string[]) ?? [] }))
		.filter((r) => !used.has(r.id));
	if (candidates.length === 0) return null;

	const pick = candidates[0];
	const days = Math.floor((Date.now() - new Date(pick.created ?? Date.now()).getTime()) / 86_400_000);
	const months = Math.round(days / 30);
	const what = pick.purpose?.trim() || pick.excerpt?.trim().slice(0, 240) || 'No notes survive about why this was worth keeping.';

	return {
		listingId: pick.id,
		body: {
			headline: pick.title,
			standfirst: `Saved ${months} month${months === 1 ? '' : 's'} ago and untouched since ${pick.created?.slice(0, 10) ?? 'then'}. Time to find out if it still deserves a place.`,
			listing: { id: pick.id, title: pick.title, url: pick.url, domain: pick.domain, created: pick.created },
			paragraphs: [what],
			question: 'Still relevant — or graveyard material?'
		},
		signals: {
			generator: 'resurrections',
			daysUntouched: days,
			archetypes: pick.archetypes,
			window: '300–900 days',
			candidatePool: candidates.length
		}
	};
}
