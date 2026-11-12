// Drum approval-by-email — every draw lands as a draft and is emailed to the
// operator for a decision BEFORE it publishes. The email carries a preview of
// the card plus three action links: approve (publish), generate new (discard
// + immediate redraw), skip (discard, next draw at the next due time).
//
// Actions are plain GET links (email clients) authorized by an HMAC token
// derived from the item id + server secret — no token column, nothing to
// store; the capability is unforgeable without the secret. Sending goes
// through utobo Email, same as The Digest (wiki: utobo email platform).

import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import type { FeedItem } from './types';

const ORIGIN = 'https://productsear.ch';
export const APPROVAL_RECIPIENT = process.env.DRUM_APPROVAL_EMAIL || 'creatuluw@gmail.com';
const FROM = process.env.DIGEST_FROM_EMAIL || 'The Drum <drum@productsear.ch>';

function secret(): string {
	const s = process.env.DRUM_APPROVAL_SECRET || process.env.BETTER_AUTH_SECRET;
	if (!s) throw new Error('no approval secret — set DRUM_APPROVAL_SECRET or BETTER_AUTH_SECRET');
	return s;
}

/** Unforgeable per-item capability: HMAC(id, secret), hex-truncated. */
export function approvalTokenFor(id: string): string {
	return createHmac('sha256', secret()).update(id).digest('hex').slice(0, 32);
}

export function verifyApprovalToken(id: string, token: string): boolean {
	const expected = approvalTokenFor(id);
	const a = Buffer.from(expected);
	const b = Buffer.from(token ?? '');
	return a.length === b.length && timingSafeEqual(a, b);
}

function esc(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function typeName(t: string): string {
	return t.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function actionUrl(id: string, token: string, action: 'approve' | 'regenerate' | 'skip'): string {
	return `${ORIGIN}/api/feed/approve?id=${id}&token=${token}&action=${action}`;
}

/** Table-styled action button (inline styles only — email clients). */
function button(href: string, label: string, bg: string, border: string, color: string): string {
	return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="background:${bg};border:1px solid ${border};border-radius:6px;">
<a href="${href}" style="display:inline-block;padding:10px 18px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;color:${color};text-decoration:none;">${label}</a>
</td></tr></table>`;
}

/** Brand-styled approval-request email: the card preview + the three decisions. */
export function buildApprovalHtml(item: FeedItem): string {
	const token = approvalTokenFor(item.id);
	const url = item.body.listing
		? `${ORIGIN}/listings/${item.body.listing.id}`
		: `${ORIGIN}/feed`;

	const body = `
<tr><td style="padding:24px 28px 0;">
	<table role="presentation" cellpadding="0" cellspacing="0"><tr>
		<td width="8" style="background:#0021FF;font-size:0;line-height:0;">&nbsp;</td>
		<td style="padding-left:16px;">
			<div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#262B27;">new drum card — your call</div>
			<div style="margin-top:4px;font-family:Menlo,Consolas,monospace;font-size:12px;color:#9AA5A0;">${esc(typeName(item.type))} · drafted ${esc(item.createdAt.slice(0, 16).replace('T', ' '))} UTC</div>
		</td>
	</tr></table>
</td></tr>
<tr><td style="padding:16px 28px;">
	<div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.35;color:#262B27;">${esc(item.body.headline)}</div>
	${item.body.standfirst ? `<div style="margin-top:10px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6E7A72;">${esc(item.body.standfirst)}</div>` : ''}
	${(item.body.paragraphs ?? []).map((p) => `<div style="margin-top:8px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6E7A72;">${esc(p)}</div>`).join('')}
	${item.body.question ? `<div style="margin-top:10px;font-family:Menlo,Consolas,monospace;font-size:12px;color:#0021FF;">${esc(item.body.question)}</div>` : ''}
	<div style="margin-top:12px;font-family:Helvetica,Arial,sans-serif;font-size:13px;">
		<a href="${url}" style="color:#0021FF;">open ${item.body.listing ? 'the listing' : 'the drum'} ↗</a>
	</div>
</td></tr>
<tr><td style="padding:8px 28px 24px;">
	<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
		<td>${button(actionUrl(item.id, token, 'approve'), 'Approve — publish', '#0021FF', '#0021FF', '#ffffff')}</td>
		<td style="padding-left:10px;">${button(actionUrl(item.id, token, 'regenerate'), 'Generate new', '#ffffff', '#262B27', '#262B27')}</td>
		<td style="padding-left:10px;">${button(actionUrl(item.id, token, 'skip'), 'Skip this one', '#ffffff', '#9AA5A0', '#6E7A72')}</td>
	</tr></table>
</td></tr>
<tr><td style="padding:16px 28px 28px;border-top:1px solid #e5e9e6;">
	<div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#9AA5A0;">
		Nothing publishes until you approve. Discarded cards are deleted. You can also manage
		cards in the <a href="${ORIGIN}/admin/feed" style="color:#0021FF;">admin feed console</a>.
	</div>
</td></tr>`;

	return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F9FBFA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FBFA;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e9e6;">
${body}
</table>
</td></tr></table>
</body></html>`;
}

export interface ApprovalSendResult {
	sent: boolean;
	reason: string;
}

/**
 * Email the draft card to the approval recipient. Fail-soft by design: a
 * failed send never loses the item — it stays a draft, visible in the admin
 * feed console, and the failure is logged for the draw runner's output.
 */
export async function sendApprovalRequest(item: FeedItem): Promise<ApprovalSendResult> {
	const apiKey = process.env.UTOBO_EMAIL_API_KEY;
	if (!apiKey) return { sent: false, reason: 'UTOBO_EMAIL_API_KEY is not configured' };

	const subject = `drum approval — ${typeName(item.type)}: ${item.body.headline.slice(0, 60)}`;
	const res = await fetch('https://api.email.utobo.com/v1/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: FROM,
			to: [APPROVAL_RECIPIENT],
			subject,
			html: buildApprovalHtml(item)
		})
	});
	if (!res.ok) {
		const body = await res.text();
		return { sent: false, reason: `utobo rejected the send — HTTP ${res.status} ${body.slice(0, 160)}` };
	}
	return { sent: true, reason: `approval request mailed to ${APPROVAL_RECIPIENT}` };
}

/** Load a draft item for an action; null when unknown (or already handled). */
export async function getDraftItem(id: string): Promise<FeedItem | null> {
	const rows = await db.execute<{
		id: string;
		type: string;
		listing_id: number | null;
		body: unknown;
		status: string;
		created_at: string;
	}>(sql`
		SELECT id, type, listing_id, body, status, created_at::text AS created_at
		FROM te9_dev.feed_items
		WHERE id = ${id} AND status = 'draft'`);
	const r = rows[0];
	if (!r) return null;
	return {
		id: r.id,
		type: r.type as FeedItem['type'],
		listingId: r.listing_id,
		body: (r.body ?? {}) as FeedItem['body'],
		status: r.status as FeedItem['status'],
		requiresApproval: true,
		publishedAt: null,
		signals: {},
		createdAt: r.created_at
	};
}
