// The Drum draw runner — generates the next feed item when the cadence clock
// says it's due (or immediately with --force). Intended for the nightly GitHub
// Actions cron (feed-draw.yml) and for manual seeding:
//   npx tsx scripts/feed-draw.ts            # draw only when due (exit 0 either way)
//   npx tsx scripts/feed-draw.ts --force    # draw regardless — also seeds the first items
//   npx tsx scripts/feed-draw.ts --status   # print rotation state without drawing
//
// Uses the same import pattern as scripts/backfill-archetypes.ts: its own
// postgres client comes from $lib/server/db (process.env + dotenv/config, no
// $env modules), so this runs under plain tsx.

import { config as loadEnv } from 'dotenv';

loadEnv();
process.env.DB_SCHEMA ??= 'te9_dev';

const { nextDueInfo, drawNext } = await import('../src/lib/server/feed/rotation.js');
const { FEED_TYPE_BY_SLUG } = await import('../src/lib/server/feed/types.js');

const status = process.argv.includes('--status');
const force = process.argv.includes('--force');

const info = await nextDueInfo();
const nameOf = (slug: string | null) => (slug ? (FEED_TYPE_BY_SLUG.get(slug)?.name ?? slug) : '—');
console.log(
	`[drum] cadence=${info.cadenceHours}h · order=[${info.typeOrder.join(', ')}] · ` +
		`last draw=${info.lastDrawAt ?? 'never'} · next type=${nameOf(info.nextType)} · ` +
		`next draw due at=${info.nextDrawAt ?? 'now'} (${info.due ? 'DUE' : 'waiting'})`
);

if (status) process.exit(0);

const item = await drawNext(force);
const { closeDb } = await import('../src/lib/server/db/index.js');
await closeDb();
if (!item) {
	console.log(force ? '[drum] nothing to draw — all generators came up empty' : '[drum] not due, skipping');
	process.exit(0);
}

console.log(
	`[drum] drew: ${FEED_TYPE_BY_SLUG.get(item.type)?.name ?? item.type} — "${item.body.headline}" ` +
		`(${item.status}${item.listingId ? `, listing ${item.listingId}` : ''})`
);
