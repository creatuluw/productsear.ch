// Generic SQL file runner against DATABASE_URL — replaces the one-off migrate.ts.
// Reads the SQL file, wraps it in a transaction.
//
//   Dry-run (applies, then ROLLBACKs):  npx tsx scripts/run-sql.ts <file.sql>
//   Commit for real:                    npx tsx scripts/run-sql.ts <file.sql> --commit
import { readFileSync } from 'node:fs';
import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';

// ponytail: load .env manually so this script runs outside SvelteKit's env loader.
loadEnv();

const file = process.argv[2];
if (!file) {
	console.error('Usage: npx tsx scripts/run-sql.ts <file.sql> [--commit]');
	process.exit(1);
}
const commit = process.argv.includes('--commit');
const sqlText = readFileSync(file, 'utf8');

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });

console.log(commit ? `COMMITTING ${file}` : `DRY RUN ${file} (rollback at end)`);
const wrapped = commit ? sqlText : `BEGIN;\n${sqlText}\nROLLBACK;`;
try {
	await sql.unsafe(wrapped);
	console.log(commit ? 'Done — committed.' : 'OK — rolled back (nothing persisted).');
} catch (e) {
	console.error('FAILED:', e instanceof Error ? e.message : e);
	process.exitCode = 1;
} finally {
	await sql.end();
}
