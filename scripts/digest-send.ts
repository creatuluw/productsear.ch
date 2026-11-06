// The Digest send runner — the drum's email edition.
//   npx tsx scripts/digest-send.ts --dry    render the email, touch nothing
//   npx tsx scripts/digest-send.ts --send   real send via utobo (gated by digest_enabled)
// Intended for the weekly GitHub Actions cron (digest-send.yml) and for manual runs.

import { config as loadEnv } from 'dotenv';

loadEnv();
process.env.DB_SCHEMA ??= 'te9_dev';

const { sendDigest, getDigestState, subscriberCount } = await import('../src/lib/server/feed/digest.js');
const { closeDb } = await import('../src/lib/server/db/index.js');

const dry = process.argv.includes('--dry');
const send = process.argv.includes('--send');

const state = await getDigestState();
console.log(
	`[digest] enabled=${state.enabled} · subscribers=${await subscriberCount()} · last sent=${state.lastDigestSentAt ?? 'never'}`
);

if (!dry && !send) {
	console.log('[digest] pass --dry or --send');
	await closeDb();
	process.exit(0);
}

const result = await sendDigest({ dry });
if (result.html) {
	// dry preview: first table row only, to keep the console readable
	console.log(`[digest] subject: ${result.subject}`);
	console.log(`[digest] html bytes: ${result.html.length}`);
}
console.log(`[digest] ${result.sent ? 'SENT' : 'not sent'} — ${result.reason}`);
await closeDb();
