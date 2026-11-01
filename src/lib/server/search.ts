import { sql } from 'drizzle-orm';
import { db } from './db';
import { embedQuery } from './embeddings';
import { rerank } from './rerank';

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
	rerankScore: number | null;
	snippet: string;
}

export interface SearchResponse {
	results: SearchResult[];
	/** total results that cleared the relevance floor (across all pages) */
	total: number;
	page: number;
	pageSize: number;
	/** true when the strong-match list ended because the pool was exhausted, not the floor */
	poolLimited: boolean;
}

// RRF retrieves this many candidates, then the cross-encoder reranker scores
// them and the relevance floor decides what is actually a match.
const RERANK_POOL = 50;
// rerank-2.5-lite relevance floor: calibrated so entries users call "should be
// found" (≈0.64+) survive and noise (≤0.45) does not.
export const RELEVANCE_FLOOR = 0.45;

function rerankText(r: {
	title: string;
	purpose: string | null;
	excerpt: string | null;
	tags: string | null;
	markdown?: string | null;
}): string {
	// The cross-encoder decides relevance from this text alone. Feed it the page
	// content (first ~1200 chars) too — the embedder already sees it, and without
	// it the reranker under-scores bookmarks whose signal lives in the body
	// (measured: MotionClone went rerank #32 → ~#20 for a conversational query).
	return [r.title, r.purpose, r.excerpt, r.tags, (r.markdown ?? '').slice(0, 1200)]
		.filter(Boolean)
		.join(' · ');
}

/**
 * Hybrid search over the bookmark corpus using Reciprocal Rank Fusion (RRF),
 * then cross-encoder rerank with a relevance floor and 20/page pagination.
 * Only good matches are returned; `total` is the honest count.
 */
export async function hybridSearch(
	query: string,
	page = 1,
	pageSize = 20
): Promise<SearchResponse> {
	const poolSize = Math.max(pageSize, RERANK_POOL);
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
		markdown: string | null;
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
				a.purpose, a.category, c.markdown
			FROM te9_dev.bookmark_embeddings e
			JOIN te9_dev.bookmarks b ON b.id = e.bookmark_id
			LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = e.bookmark_id
			LEFT JOIN te9_dev.bookmark_content c ON c.bookmark_id = b.id
		),
		ranked AS (
			SELECT
				scored.*,
				ROW_NUMBER() OVER (ORDER BY vec_distance) AS vec_rank,
				ROW_NUMBER() OVER (ORDER BY text_rank_value DESC) AS text_pos_rank
			FROM scored
		)
		SELECT
			bookmark_id, title, url, domain, excerpt, tags, purpose, category, markdown,
			vec_distance, text_rank_value AS text_rank,
			(1.0 / (60 + vec_rank)) + (1.0 / (60 + text_pos_rank)) AS rrf,
			COALESCE(
				ts_headline('english', excerpt, plainto_tsquery('english', ${query}),
					'MaxWords=35, MinWords=10'),
				''
			) AS snippet
		FROM ranked
		ORDER BY rrf DESC
		LIMIT ${poolSize}
	`));

	const mapped: SearchResult[] = rows.map((r) => ({
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
		rerankScore: null,
		snippet: r.snippet
	}));

	if (mapped.length === 0) {
		return { results: [], total: 0, page: 1, pageSize, poolLimited: false };
	}

	// Cross-encoder scores over the whole pool, floor applied after.
	try {
		const hits = await rerank(
			query,
			rows.map(rerankText),
			rows.length
		);
		for (const h of hits) mapped[h.index].rerankScore = h.score;

		const strong = hits.filter((h) => h.score >= RELEVANCE_FLOOR).map((h) => mapped[h.index]);
		const poolLimited = strong.length === hits.length; // floor never kicked in
		const start = (page - 1) * pageSize;
		return {
			results: strong.slice(start, start + pageSize),
			total: strong.length,
			page,
			pageSize,
			poolLimited
		};
	} catch (e) {
		console.error('rerank failed, returning RRF order:', e);
		const start = (page - 1) * pageSize;
		return { results: mapped.slice(start, start + pageSize), total: mapped.length, page, pageSize, poolLimited: true };
	}
}
