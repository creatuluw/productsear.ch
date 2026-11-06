// The Walk — a trail through embedding space. Pure geometry, no LLM, no
// rerank: from a random seed, each hop takes the nearest neighbor not already
// on the trail. The serendipity layer — competitors cannot rebuild it without
// the vector index (spec 80% criterion).

import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { usedListingIds } from '../queries';
import type { GeneratorResult } from '../types';

const HOPS = 4;

type WalkNode = {
	id: number;
	title: string;
	url: string;
	domain: string | null;
	distance: number | null;
}

/** int[] literal for <> ALL(...) — drizzle expands JS arrays into a param tuple, which PG rejects here. */
function intArrayLiteral(ids: number[]): string {
	const safe = ids.filter((n) => Number.isInteger(n));
	return `ARRAY[${safe.length > 0 ? safe.join(',') : '0'}]::int[]`;
}

export async function generateWalk(): Promise<GeneratorResult | null> {
	const used = await usedListingIds();

	// seed: random embedded listing, not already drawn
	const seeds = await db.execute<{ id: number; title: string; url: string; domain: string | null }>(sql`
		SELECT b.id, b.title, b.url, b.domain
		FROM te9_dev.bookmarks b
		JOIN te9_dev.bookmark_embeddings e ON e.bookmark_id = b.id
		WHERE NOT EXISTS (SELECT 1 FROM te9_dev.feed_items f WHERE f.listing_id = b.id)
		ORDER BY random()
		LIMIT 5`);
	if (seeds.length === 0) return null;

	const trail: WalkNode[] = [];
	for (const seed of seeds) {
		if (used.has(seed.id)) continue;
		trail.length = 0;
		trail.push({ ...seed, distance: null });
		for (let hop = 0; hop < HOPS; hop++) {
			const current = trail[trail.length - 1];
			const exclude = trail.map((n) => n.id).concat([...used]);
			const next = await db.execute<WalkNode>(sql`
				SELECT b.id, b.title, b.url, b.domain,
				       (e.embedding <=> src.embedding) AS distance
				FROM te9_dev.bookmark_embeddings src
				JOIN te9_dev.bookmark_embeddings e ON e.bookmark_id <> src.bookmark_id
				JOIN te9_dev.bookmarks b ON b.id = e.bookmark_id
				WHERE src.bookmark_id = ${current.id}
				  AND e.bookmark_id <> ALL(${sql.raw(intArrayLiteral(exclude))})
				ORDER BY e.embedding <=> src.embedding
				LIMIT 1`);
			if (!next[0]) break; // dead end — trail as-is is fine (≥2 nodes)
			trail.push(next[0]);
		}
		if (trail.length >= HOPS + 1) break; // full trail found
	}
	if (trail.length < 2) return null;

	const seed = trail[0];
	const items = trail.map((n, i) => ({
		id: n.id,
		label: i === 0 ? `Start: ${n.title}` : `+${(n.distance ?? 0).toFixed(3)}: ${n.title}`,
		url: n.url,
		note: i === 0 ? 'the seed' : `hop ${i} — nearest neighbor in embedding space`
	}));

	return {
		listingId: seed.id,
		body: {
			headline: `A ${trail.length}-step walk through the corpus, starting at “${seed.title}”`,
			standfirst: `No ranking, no rerank — each hop is the raw nearest neighbor in embedding space. ${trail.length - 1} geometric hops from one save to the next.`,
			items,
			question: 'Where would you have walked instead?'
		},
		signals: {
			generator: 'walk',
			hops: trail.length - 1,
			distances: trail.slice(1).map((n) => n.distance)
		}
	};
}
