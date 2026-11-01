// Diagnostic: trace one query through the hybrid-search stages for a target bookmark.
//   npx tsx scripts/diagnose-query.ts "the query" "url-substring-to-track"
import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';
import { embedQuery } from '../src/lib/server/embeddings.js';

loadEnv();

const query = process.argv[2];
const target = process.argv[3]?.toLowerCase();
if (!query) {
	console.error('usage: tsx scripts/diagnose-query.ts "<query>" [url-substring]');
	process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });

const queryVec = await embedQuery(query);

const rows = await sql`
	WITH scored AS (
		SELECT
			e.bookmark_id,
			b.url,
			(e.embedding <=> ${`[${queryVec.join(',')}]`}::vector) AS vec_distance,
			ts_rank(e.search_tsv, plainto_tsquery('english', ${query})) AS text_rank_value
		FROM te9_dev.bookmark_embeddings e
		JOIN te9_dev.bookmarks b ON b.id = e.bookmark_id
	),
	ranked AS (
		SELECT scored.*,
			ROW_NUMBER() OVER (ORDER BY vec_distance) AS vec_rank,
			ROW_NUMBER() OVER (ORDER BY text_rank_value DESC) AS text_pos_rank
		FROM scored
	)
	SELECT url, vec_distance, vec_rank, text_rank_value, text_pos_rank,
		(1.0 / (60 + vec_rank)) + (1.0 / (60 + text_pos_rank)) AS rrf,
		ROW_NUMBER() OVER (ORDER BY (1.0 / (60 + vec_rank)) + (1.0 / (60 + text_pos_rank)) DESC) AS rrf_rank
	FROM ranked
`;

const targetRow = target ? rows.find((r) => (r.url as string).toLowerCase().includes(target)) : undefined;
console.log('query:', JSON.stringify(query));
console.log('corpus:', rows.length);

if (targetRow) {
	console.log('\nTARGET:', targetRow.url);
	console.log('  vec_distance:', Number(targetRow.vec_distance).toFixed(4), '→ vec rank', targetRow.vec_rank);
	console.log('  ts_rank:     ', Number(targetRow.text_rank_value).toFixed(4), '→ text rank', targetRow.text_pos_rank);
	console.log('  rrf:         ', Number(targetRow.rrf).toFixed(5), '→ rrf rank', targetRow.rrf_rank, '(pool cutoff = 50)');
} else if (target) {
	console.log('\nTARGET NOT FOUND');
}

console.log('\ntop 12 by RRF:');
for (const r of rows.slice(0, 12)) {
	console.log(
		`  #${String(r.rrf_rank).padStart(3)} rrf=${Number(r.rrf).toFixed(4)} vec=${String(r.vec_rank).padStart(4)} txt=${String(r.text_pos_rank).padStart(4)} ${r.url.slice(0, 80)}`
	);
}

if (targetRow && Number(targetRow.rrf_rank) > 50) {
	console.log('\ntarget text-rank neighbours (why text side is weak/strong):');
	const byText = rows.slice().sort((a, b) => Number(a.text_pos_rank) - Number(b.text_pos_rank));
	console.log('  target text rank:', targetRow.text_pos_rank, 'ts_rank:', Number(targetRow.text_rank_value).toFixed(4));
	console.log('  ts_rank of text-rank #1..#5:', byText.slice(0, 5).map((r) => Number(r.text_rank_value).toFixed(4)).join(', '));
	const byVec = rows.slice().sort((a, b) => Number(a.vec_rank) - Number(b.vec_rank));
	const idx = byVec.findIndex((r) => r === targetRow);
	console.log('  vec neighbours of target:');
	for (const r of byVec.slice(Math.max(0, idx - 2), idx + 3)) {
		console.log(`    vec#${String(r.vec_rank).padStart(4)} d=${Number(r.vec_distance).toFixed(3)} ${r.url.slice(0, 70)}`);
	}
}

await sql.end();
