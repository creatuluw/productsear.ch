// Backfill bookmark_archetypes for every bookmark (idempotent; re-runs update).
//   npx tsx scripts/backfill-archetypes.ts            # classify + upsert all
//   npx tsx scripts/backfill-archetypes.ts --missing  # only rows not yet classified
import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';
import { classifyBookmark } from '../src/lib/archetypes.js';

loadEnv();

const onlyMissing = process.argv.includes('--missing');
const sql = postgres(process.env.DATABASE_URL!, { max: 4, prepare: false });

const rows = await sql`
	SELECT b.id, b.title, b.domain, b.tags,
	       a.category, a.purpose, a.tags AS analysis_tags
	FROM te9_dev.bookmarks b
	LEFT JOIN te9_dev.bookmark_analysis a ON a.bookmark_id = b.id
	${onlyMissing ? sql`WHERE NOT EXISTS (SELECT 1 FROM te9_dev.bookmark_archetypes x WHERE x.bookmark_id = b.id)` : sql``}
`;

console.log(`classifying ${rows.length} bookmarks…`);
let done = 0;
const BATCH = 200;
for (let i = 0; i < rows.length; i += BATCH) {
	const batch = rows.slice(i, i + BATCH);
	await sql.begin(async (tx) => {
		for (const r of batch) {
			const slugs = classifyBookmark(r);
			await tx`INSERT INTO te9_dev.bookmark_archetypes (bookmark_id, archetypes)
				VALUES (${r.id}, ${sql.json(slugs)})
				ON CONFLICT (bookmark_id) DO UPDATE SET archetypes = EXCLUDED.archetypes, classified_at = now()`;
		}
	});
	done += batch.length;
	if (done % 1000 < BATCH) console.log(`  ${done}/${rows.length}`);
}

const summary = await sql`
	SELECT archetype, count(*)::int n FROM (
		SELECT jsonb_array_elements_text(archetypes) AS archetype FROM te9_dev.bookmark_archetypes
	) t GROUP BY archetype ORDER BY n DESC`;
console.log('\narchetype distribution (top 20):');
summary.slice(0, 20).forEach((s) => console.log(`  ${String(s.n).padStart(5)}  ${s.archetype}`));
console.log(`total distinct in use: ${summary.length}`);

await sql.end();
