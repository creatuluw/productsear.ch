// One-off: applies scripts/migration.sql against the configured DATABASE_URL.
// Run with: npx tsx scripts/migrate.ts
import { readFileSync } from 'node:fs';
import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';

// ponytail: load .env manually so this script runs outside SvelteKit's env loader.
loadEnv();

const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const migration = readFileSync(new URL('./migration.sql', import.meta.url), 'utf8');

console.log('Applying migration…');
await sql.unsafe(migration);
console.log('Done.');
await sql.end();
