// Listing stack data — one listing, its published feed items, and its Walk
// (embedding nearest neighbors). Shared by the /listings/[id] page load and
// the llms.ts raw-markdown branch so both surfaces stay identical.

import { sql } from 'drizzle-orm';
import { db } from '../db';
import { listByListing } from './queries';
import type { FeedItem } from './types';

export interface StackListing {
	id: number;
	title: string;
	url: string;
	domain: string | null;
	excerpt: string | null;
	created: string | null;
	archetypes: string[];
	purpose: string | null;
	howToUse: string | null;
	whenToUse: string | null;
}

export interface WalkNeighbor {
	id: number;
	title: string;
	url: string;
	domain: string | null;
	distance: number;
}

export interface Stack {
	listing: StackListing;
	items: FeedItem[];
	walk: WalkNeighbor[];
}

export async function getStack(id: number): Promise<Stack | null> {
	const rows = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		excerpt: string | null;
		created: string | null;
		purpose: string | null;
		how_to_use: string | null;
		when_to_use: string | null;
		archetypes: unknown;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain, b.excerpt,
		       b.raindrop_created_at::text AS created,
		       a.purpose, a.how_to_use, a.when_to_use,
		       COALESCE(x.archetypes, '[]'::jsonb) AS archetypes
		FROM te9_dev.bookmarks b
		LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
		LEFT JOIN te9_dev.bookmark_archetypes x ON x.bookmark_id = b.id
		WHERE b.id = ${id}`);
	const row = rows[0];
	if (!row) return null;

	// The Walk: embedding nearest neighbors (pgvector cosine), unranked —
	// raw vector distance, no rerank. The serendipity layer, not a search.
	const walk = await db.execute<{
		id: number;
		title: string;
		url: string;
		domain: string | null;
		distance: number;
	}>(sql`
		SELECT b.id, b.title, b.url, b.domain,
		       (e.embedding <=> src.embedding) AS distance
		FROM te9_dev.bookmark_embeddings src
		JOIN te9_dev.bookmark_embeddings e ON e.bookmark_id <> src.bookmark_id
		JOIN te9_dev.bookmarks b ON b.id = e.bookmark_id
		WHERE src.bookmark_id = ${id}
		ORDER BY e.embedding <=> src.embedding
		LIMIT 4`);

	return {
		listing: {
			id: row.id,
			title: row.title,
			url: row.url,
			domain: row.domain,
			excerpt: row.excerpt,
			created: row.created,
			archetypes: (row.archetypes as string[]) ?? [],
			purpose: row.purpose,
			howToUse: row.how_to_use,
			whenToUse: row.when_to_use
		},
		items: await listByListing(id),
		walk
	};
}
