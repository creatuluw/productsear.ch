// Calibrate RELEVANCE_FLOOR: score distributions for real vs nonsense queries.
import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';
import { embedQuery } from '../src/lib/server/embeddings.js';
import { rerank } from '../src/lib/server/rerank.js';

loadEnv();
const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });

const queries = {
	good: 'i am looking for a tool that lets me process videos and edit them after',
	good2: 'url to markdown',
	nonsense: 'purple elephant dishwasher xkcd quantum marmalade'
};

for (const [label, q] of Object.entries(queries)) {
	const vec = await embedQuery(q);
	const rows = (await sql`
		WITH scored AS (
			SELECT e.bookmark_id,
				(e.embedding <=> ${`[${vec.join(',')}]`}::vector) AS vec_distance,
				ts_rank(e.search_tsv, plainto_tsquery('english', ${q})) AS text_rank_value,
				b.title, b.url, b.excerpt, b.tags, a.purpose, c.markdown
			FROM te9_dev.bookmark_embeddings e
			JOIN te9_dev.bookmarks b ON b.id = e.bookmark_id
			LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = e.bookmark_id
			LEFT JOIN te9_dev.bookmark_content c ON c.bookmark_id = b.id
		),
		ranked AS (
			SELECT scored.*,
				ROW_NUMBER() OVER (ORDER BY vec_distance) AS vec_rank,
				ROW_NUMBER() OVER (ORDER BY text_rank_value DESC) AS text_pos_rank
			FROM scored
		)
		SELECT title, url, excerpt, tags, purpose, markdown
		FROM ranked
		ORDER BY (1.0 / (60 + vec_rank)) + (1.0 / (60 + text_pos_rank)) DESC
		LIMIT 50
	`) as { title: string; purpose: string | null; excerpt: string | null; tags: string | null; markdown: string | null }[];

	const docs = rows.map((r) =>
		[r.title, r.purpose, r.excerpt, r.tags, (r.markdown ?? '').slice(0, 1200)].filter(Boolean).join(' · ')
	);
	const hits = await rerank(q, docs, docs.length);
	const scores = hits.map((h) => h.score);
	const over = (t: number) => scores.filter((s) => s >= t).length;
	console.log(
		`${label.padEnd(9)} scores: max=${scores[0]?.toFixed(2)} p5=${scores[Math.floor(scores.length * 0.05)]?.toFixed(2)} median=${scores[Math.floor(scores.length / 2)]?.toFixed(2)} | ≥0.35: ${over(0.35)}  ≥0.45: ${over(0.45)}  ≥0.55: ${over(0.55)}  ≥0.65: ${over(0.65)} (of ${scores.length})`
	);
}
await sql.end();
process.exit(0);
