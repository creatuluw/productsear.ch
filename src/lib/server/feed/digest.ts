// The Digest — the drum's email edition (spec slice E, dark by default:
// gated by feed_settings.digest_enabled, admin-toggled). Subscribers opt in
// via /api/digest/subscribe; every email carries a per-reader unsubscribe
// token. Sending goes through utobo Email (see wiki entity page).

import { sql } from 'drizzle-orm';
import { db } from '../db';
import { listPublished, getFeedSettings, type FeedSettings } from './queries';
import type { FeedItem } from './types';

// ── subscribers ──────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Opt-in (or re-opt-in): upsert by email, fresh unsubscribe token each time. */
export async function addSubscriber(email: string): Promise<void> {
	await db.execute(sql`
		INSERT INTO te9_dev.digest_subscribers (email)
		VALUES (${email.trim().toLowerCase()})
		ON CONFLICT (email) DO UPDATE
		SET token = gen_random_uuid(), unsubscribed_at = NULL`);
}

/** Unsubscribe by token — mark, never erase (kept for abuse forensics). Returns the email or null. */
export async function removeSubscriber(token: string): Promise<string | null> {
	const rows = await db.execute<{ email: string }>(sql`
		UPDATE te9_dev.digest_subscribers SET unsubscribed_at = now()
		WHERE token = ${token} AND unsubscribed_at IS NULL
		RETURNING email`);
	return rows[0]?.email ?? null;
}

export async function subscriberCount(): Promise<number> {
	const rows = await db.execute<{ n: number }>(sql`
		SELECT count(*)::int AS n FROM te9_dev.digest_subscribers WHERE unsubscribed_at IS NULL`);
	return rows[0]?.n ?? 0;
}

export async function listActiveSubscribers(): Promise<string[]> {
	const rows = await db.execute<{ email: string }>(sql`
		SELECT email FROM te9_dev.digest_subscribers WHERE unsubscribed_at IS NULL ORDER BY created_at`);
	return rows.map((r) => r.email);
}

// ── digest content ───────────────────────────────────────────────────────────

export interface DigestState {
	enabled: boolean;
	subscribers: number;
	lastDigestSentAt: string | null;
	settings: FeedSettings;
}

export async function getDigestState(): Promise<DigestState> {
	const settings = await getFeedSettings();
	const rows = await db.execute<{ t: string | null }>(
		sql`SELECT last_digest_sent_at::text AS t FROM te9_dev.feed_settings WHERE id = true`
	);
	return {
		enabled: settings.digestEnabled,
		subscribers: await subscriberCount(),
		lastDigestSentAt: rows[0]?.t ?? null,
		settings
	};
}

function esc(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Brand-styled, table-based email HTML (inline styles only — email clients). */
export function buildDigestHtml(items: FeedItem[], sentWindow: { from: string | null }): string {
	const typeName = (t: string) => t.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
	const range = sentWindow.from
		? `${sentWindow.from.slice(0, 10)} → ${new Date().toISOString().slice(0, 10)}`
		: `latest ${items.length}`;

	const cards = items
		.map((item) => {
			const url = item.body.listing ? `https://productsear.ch/listings/${item.body.listing.id}` : 'https://productsear.ch/feed';
			return `<tr><td style="padding:18px 0;border-top:1px solid #e5e9e6;">
	<div style="font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#6E7A72;">${esc(typeName(item.type))}</div>
	<div style="margin-top:8px;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.3;">
		<a href="${url}" style="color:#262B27;text-decoration:none;">${esc(item.body.headline)}</a>
	</div>
	${item.body.standfirst ? `<div style="margin-top:8px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6E7A72;">${esc(item.body.standfirst)}</div>` : ''}
	${(item.body.paragraphs ?? []).map((p) => `<div style="margin-top:8px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6E7A72;">${esc(p)}</div>`).join('')}
	${item.body.question ? `<div style="margin-top:10px;font-family:Menlo,Consolas,monospace;font-size:12px;color:#0021FF;">${esc(item.body.question)}</div>` : ''}
</td></tr>`;
		})
		.join('\n');

	return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F9FBFA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FBFA;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e9e6;">
<tr><td style="padding:24px 28px 0;">
	<table role="presentation" cellpadding="0" cellspacing="0"><tr>
		<td width="8" style="background:#0021FF;font-size:0;line-height:0;">&nbsp;</td>
		<td style="padding-left:16px;">
			<div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#262B27;">the drum</div>
			<div style="margin-top:4px;font-family:Menlo,Consolas,monospace;font-size:12px;color:#9AA5A0;">${range} · what the corpus drew</div>
		</td>
	</tr></table>
</td></tr>
<tr><td style="padding:8px 28px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cards}</table>
</td></tr>
<tr><td style="padding:16px 28px 28px;border-top:1px solid #e5e9e6;">
	<div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9AA5A0;">
		Every card is machine-drafted from the productsear.ch corpus — how it works:
		<a href="https://productsear.ch/feed/methodology" style="color:#0021FF;">the methodology</a>.
	</div>
	<div style="margin-top:10px;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#9AA5A0;">
		<a href="https://productsear.ch/feed" style="color:#0021FF;">open the drum</a>
		&nbsp;·&nbsp;
		<a href="https://productsear.ch/digest/unsubscribe?token={{UNSUBSCRIBE_TOKEN}}" style="color:#9AA5A0;">unsubscribe</a>
	</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ── sending ──────────────────────────────────────────────────────────────────

export interface SendResult {
	sent: boolean;
	reason: string;
	recipients?: number;
	subject?: string;
}

const DIGEST_FROM = process.env.DIGEST_FROM_EMAIL || 'The Drum <drum@productsear.ch>';

/**
 * Build + send the digest via utobo. When dry, renders the email and returns
 * it without touching utobo or the send cursor. Real sends are gated by the
 * digest_enabled flag (unless forced), a non-empty subscriber list, and an
 * available UTOBO_EMAIL_API_KEY. The cursor only advances on a real send.
 */
export async function sendDigest(opts: { dry?: boolean; force?: boolean; sinceOverride?: string | null } = {}): Promise<SendResult & { html?: string }> {
	const state = await getDigestState();
	if (!state.enabled && !opts.force && !opts.dry) {
		return { sent: false, reason: 'digest is disabled (feed_settings.digest_enabled)' };
	}
	if (!state.enabled && !opts.force && opts.dry) {
		// dry mode renders regardless — the admin toggles the flag when ready
	}

	const since = opts.sinceOverride ?? state.lastDigestSentAt;
	let items: FeedItem[] = [];
	if (since) {
		// normal cadence: whatever was published since the last digest
		const rows = await db.execute<Parameters<typeof mapDigestItem>[0]>(sql`
			SELECT id, type, body, published_at::text AS published_at, created_at::text AS created_at
			FROM te9_dev.feed_items
			WHERE status = 'published' AND published_at > ${since}
			ORDER BY published_at DESC NULLS LAST, created_at DESC
			LIMIT 12`);
		items = rows.map(mapDigestItem);
		if (items.length === 0) {
			return { sent: false, reason: 'nothing new since the last digest — cursor stays put' };
		}
	} else {
		// first-ever send: no cursor yet — the latest 5 cards
		items = await listPublished(5);
	}
	if (items.length === 0) return { sent: false, reason: 'no published feed items to digest' };

	const subject = `the drum — ${items.length} new card${items.length === 1 ? '' : 's'}`;
	const html = buildDigestHtml(items, { from: since });

	if (opts.dry) {
		return { sent: false, reason: 'dry run — rendered only', recipients: 0, subject, html };
	}

	const apiKey = process.env.UTOBO_EMAIL_API_KEY;
	if (!apiKey) {
		return { sent: false, reason: 'UTOBO_EMAIL_API_KEY is not configured' };
	}

	const subscribers = await listActiveSubscribers();
	if (subscribers.length === 0) {
		return { sent: false, reason: 'no active subscribers — cursor not advanced' };
	}

	let sentCount = 0;
	const errors: string[] = [];
	for (const to of subscribers) {
		const personalized = html.replace('{{UNSUBSCRIBE_TOKEN}}', await tokenFor(to));
		const res = await fetch('https://api.email.utobo.com/v1/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: DIGEST_FROM,
				to: [to],
				subject,
				html: personalized
			})
		});
		if (res.ok) {
			sentCount++;
		} else {
			const body = await res.text();
			errors.push(`${to}: HTTP ${res.status} ${body.slice(0, 120)}`);
		}
	}

	if (sentCount === 0) {
		return { sent: false, reason: `utobo rejected every send — ${errors.join(' | ').slice(0, 300)}` };
	}

	await db.execute(sql`UPDATE te9_dev.feed_settings SET last_digest_sent_at = now() WHERE id = true`);
	return {
		sent: true,
		reason: errors.length > 0 ? `sent to ${sentCount}/${subscribers.length} (${errors.length} failed)` : `sent to ${sentCount} subscriber${sentCount === 1 ? '' : 's'}`,
		recipients: sentCount,
		subject
	};
}

function mapDigestItem(r: {
	id: string;
	type: string;
	body: unknown;
	published_at: string | null;
	created_at: string;
}): FeedItem {
	return {
		id: r.id,
		type: r.type as FeedItem['type'],
		listingId: null,
		body: (r.body ?? {}) as FeedItem['body'],
		status: 'published',
		requiresApproval: false,
		publishedAt: r.published_at,
		signals: {},
		createdAt: r.created_at
	};
}

async function tokenFor(email: string): Promise<string> {
	const rows = await db.execute<{ token: string }>(sql`
		SELECT token::text AS token FROM te9_dev.digest_subscribers WHERE email = ${email}`);
	return rows[0]?.token ?? 'unknown';
}
