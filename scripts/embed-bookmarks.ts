// Idempotent, resumable backfill of bookmark embeddings.
//
//   npx tsx scripts/embed-bookmarks.ts              # backfill (batched, skips done)
//   npx tsx scripts/embed-bookmarks.ts --dry-run    # plan only, no API calls, no writes
//   npx tsx scripts/embed-bookmarks.ts --limit 50   # cap for testing
//
// Resumable: bookmark_ids already present in bookmark_embeddings are skipped.
import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';
import { embedTexts } from '../src/lib/server/embeddings.js';
import { buildSearchText } from '../src/lib/server/bookmark-text.js';

loadEnv();

const dryRun = process.argv.includes('--dry-run');
const limitFlag = process.argv.indexOf('--limit');
const limit = limitFlag !== -1 ? Number(process.argv[limitFlag + 1]) : undefined;
const BATCH = 100;

const sql = postgres(process.env.DATABASE_URL!, { max: 4, prepare: false });

type Row = {
	id: number;
	title: string;
	domain: string | null;
	tags: string | null;
	excerpt: string | null;
	note: string | null;
	markdown: string | null;
	purpose: string | null;
	how_to_use: string | null;
	relevance: string | null;
	category: string | null;
	analysis_tags: string | null;
};

console.log(`${dryRun ? '[DRY RUN] ' : ''}Fetching bookmarks needing embeddings…`);

const alreadyDone = await sql`SELECT bookmark_id FROM te9_dev.bookmark_embeddings`;
const doneSet = new Set(alreadyDone.map((r) => r.bookmark_id));
console.log(`Already embedded: ${doneSet.size}`);

const rows: Row[] = await sql`
	SELECT
		b.id, b.title, b.domain, b.tags, b.excerpt, b.note,
		c.markdown,
		a.purpose, a.how_to_use, a.relevance, a.category, a.tags AS analysis_tags
	FROM te9_dev.bookmarks b
	LEFT JOIN te9_dev.bookmark_content c ON c.bookmark_id = b.id
	LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
	ORDER BY b.id
	${limit !== undefined ? sql`LIMIT ${limit}` : sql``}
`;

const todo = rows.filter((r) => !doneSet.has(r.id));
console.log(`Total bookmarks: ${rows.length}. To embed: ${todo.length}.`);

if (dryRun) {
	console.log('\nPlan (first 10):');
	for (const r of todo.slice(0, 10)) {
		const text = buildSearchText(r, { markdown: r.markdown }, {
			purpose: r.purpose, howToUse: r.how_to_use, relevance: r.relevance,
			category: r.category, tags: r.analysis_tags
		});
		console.log(`  [${r.id}] ${r.title}  (${text.length} chars)`);
	}
	console.log(`\nWould make ${Math.ceil(todo.length / BATCH)} batches of up to ${BATCH}.`);
	await sql.end();
	process.exit(0);
}

if (todo.length === 0) {
	console.log('Nothing to do.');
	await sql.end();
	process.exit(0);
}

let done = 0;
for (let i = 0; i < todo.length; i += BATCH) {
	const batch = todo.slice(i, i + BATCH);
	const texts = batch.map((r) =>
		buildSearchText(r, { markdown: r.markdown }, {
			purpose: r.purpose, howToUse: r.how_to_use, relevance: r.relevance,
			category: r.category, tags: r.analysis_tags
		})
	);
	const vectors = await embedTexts(texts, 'document');

	await sql.begin(async (tx) => {
		for (let j = 0; j < batch.length; j++) {
			const r = batch[j];
			const vecStr = `[${vectors[j].join(',')}]`;
			const text = texts[j];
			// Upsert both the vector and a matching full-text tsvector so semantic
			// and keyword search operate over identical content.
			await tx`
				INSERT INTO te9_dev.bookmark_embeddings (bookmark_id, embedding, search_tsv, model)
				VALUES (${r.id}, ${vecStr}::vector, to_tsvector('english', ${text}), ${process.env.EMBEDDING_MODEL ?? 'voyage-4-large'})
				ON CONFLICT (bookmark_id) DO UPDATE
					SET embedding = EXCLUDED.embedding,
					    search_tsv = EXCLUDED.search_tsv,
					    model = EXCLUDED.model,
					    embedded_at = now()
			`;
		}
	});

	done += batch.length;
	console.log(`  ${done}/${todo.length} embedded`);
}

console.log('Backfill complete.');
await sql.end();
