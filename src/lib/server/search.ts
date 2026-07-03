import { sql } from 'drizzle-orm';
import { db } from './db';
import { embedQuery } from './embeddings';

export interface SearchResult {
	id: number;
	title: string;
	url: string;
	domain: string | null;
	excerpt: string | null;
	tags: string | null;
	purpose: string | null;
	category: string | null;
	vecDistance: number;
	textRank: number;
	rrf: number;
	snippet: string;
}

/**
 * Hybrid search over the bookmark corpus using Reciprocal Rank Fusion (RRF).
 *
 * We score EVERY row on both signals (2.3k vectors = sub-ms brute-force cosine,
 * so no ANN prefilter is needed — HNSW index is there for future scale). RRF
 * fuses the two rank lists without needing score normalization, which matters
 * because cosine distance and ts_rank live on totally different scales.
 */
export async function hybridSearch(query: string, limit = 20): Promise<SearchResult[]> {
	const queryVec = await embedQuery(query);

	const rows = (await db.execute<{
		bookmark_id: number;
		title: string;
		url: string;
		domain: string | null;
		excerpt: string | null;
		tags: string | null;
		purpose: string | null;
		category: string | null;
		vec_distance: number;
		text_rank: number;
		rrf: number;
		snippet: string;
	}>(sql`
		WITH scored AS (
			SELECT
				e.bookmark_id,
				(e.embedding <=> ${`[${queryVec.join(',')}]`}::vector) AS vec_distance,
				ts_rank(e.search_tsv, plainto_tsquery('english', ${query})) AS text_rank_value,
				b.title, b.url, b.domain, b.excerpt, b.tags,
				a.purpose, a.category
			FROM te9_dev.bookmark_embeddings e
			JOIN te9_dev.bookmarks b ON b.id = e.bookmark_id
			LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = e.bookmark_id
		),
		ranked AS (
			SELECT
				scored.*,
				ROW_NUMBER() OVER (ORDER BY vec_distance) AS vec_rank,
				ROW_NUMBER() OVER (ORDER BY text_rank_value DESC) AS text_pos_rank
			FROM scored
		)
		SELECT
			bookmark_id, title, url, domain, excerpt, tags, purpose, category,
			vec_distance, text_rank_value AS text_rank,
			(1.0 / (60 + vec_rank)) + (1.0 / (60 + text_pos_rank)) AS rrf,
			COALESCE(
				ts_headline('english', excerpt, plainto_tsquery('english', ${query}),
					'MaxWords=35, MinWords=10'),
				''
			) AS snippet
		FROM ranked
		ORDER BY rrf DESC
		LIMIT ${limit}
	`));

	return rows.map((r) => ({
		id: r.bookmark_id,
		title: r.title,
		url: r.url,
		domain: r.domain,
		excerpt: r.excerpt,
		tags: r.tags,
		purpose: r.purpose,
		category: r.category,
		vecDistance: Number(r.vec_distance),
		textRank: Number(r.text_rank),
		rrf: Number(r.rrf),
		snippet: r.snippet
	}));
}
