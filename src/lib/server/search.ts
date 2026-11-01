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

// RRF retrieves this many candidates, then the cross-encoder reranker narrows
// to `limit`. Pool > limit is what makes reranking meaningful.
const RERANK_POOL = 50;

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
 * Hybrid search over the bookmark corpus using Reciprocal Rank Fusion (RRF).
 *
 * We score EVERY row on both signals (2.3k vectors = sub-ms brute-force cosine,
 * so no ANN prefilter is needed — HNSW index is there for future scale). RRF
 * fuses the two rank lists without needing score normalization, which matters
 * because cosine distance and ts_rank live on totally different scales.
 */
export async function hybridSearch(query: string, limit = 20): Promise<SearchResult[]> {
	const queryVec = await embedQuery(query);

	// Fetch a candidate pool (RERANK_POOL, or `limit` if it's larger) from the
	// fused rank list, then hand off to the cross-encoder reranker.
	const poolSize = Math.max(limit, RERANK_POOL);

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
			LEFT JOIN te9_dev.bookmark_content c ON c.bookmark_id = e.bookmark_id
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

	if (mapped.length <= limit) return mapped;

	// Cross-encoder rerank over the pool, fall back to RRF order on failure.
	// Rerank from `rows` (raw, incl. markdown) not `mapped` (API payload).
	try {
		const docs = rows.map(rerankText);
		if (process.env.SEARCH_DEBUG) {
			const ti = rows.findIndex((r) => (r.url as string).toLowerCase().includes(process.env.SEARCH_DEBUG!));
			console.error('[debug] pool', rows.length, 'target idx', ti, 'doc len', ti >= 0 ? docs[ti].length : '-', 'doc head:', ti >= 0 ? docs[ti].slice(0, 90) : '-');
		}
		const order = await rerank(
			query,
			docs,
			limit
		);
		if (process.env.SEARCH_DEBUG) {
			console.error('[debug] order len', order.length, 'first 5', order.slice(0, 5));
		}
		return order.map((i) => mapped[i]);
	} catch (e) {
		console.error('rerank failed, returning RRF order:', e);
		return mapped.slice(0, limit);
	}
}
