import { verifyApprovalToken, getDraftItem, APPROVAL_RECIPIENT } from '$lib/server/feed/approval';
import { setItemStatus, deleteItem } from '$lib/server/feed/queries';
import { drawNext } from '$lib/server/feed/rotation';
import type { RequestHandler } from './$types';

// GET /api/feed/approve?id=<uuid>&token=<hmac>&action=approve|regenerate|skip
//
// The email-click endpoint for the drum's approval flow (see approval.ts).
// The token is the capability — HMAC(item id, server secret) — so no session
// is required from a mail client. Confirms with a tiny standalone HTML page
// (no site chrome: this is a machine-actioned response read in a mail context).

function page(title: string, body: string, ok = true): Response {
	const color = ok ? '#0021FF' : '#8A3324';
	return new Response(
		`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} · productsear.ch</title></head>
<body style="margin:0;padding:0;background:#F9FBFA;font-family:Helvetica,Arial,sans-serif;">
<div style="max-width:520px;margin:64px auto;padding:32px;background:#ffffff;border:1px solid #e5e9e6;border-radius:10px;">
<div style="font-family:Menlo,Consolas,monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9AA5A0;">the drum · approval</div>
<h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${color};">${title}</h1>
<p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#6E7A72;">${body}</p>
<p style="margin:20px 0 0;font-size:13px;"><a href="https://productsear.ch/admin/feed" style="color:#0021FF;">open the admin feed console</a></p>
</div></body></html>`,
		{ status: ok ? 200 : 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
	);
}

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id') ?? '';
	const token = url.searchParams.get('token') ?? '';
	const action = url.searchParams.get('action') ?? '';

	const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	if (!uuidRe.test(id) || !verifyApprovalToken(id, token)) {
		return page('invalid link', 'This approval link is not valid — tokens are per-card and unforgeable. Open the card from a fresh email, or manage it in the admin feed console.', false);
	}
	if (action !== 'approve' && action !== 'regenerate' && action !== 'skip') {
		return page('unknown action', 'Actions are: approve, generate new, skip this one.', false);
	}

	const item = await getDraftItem(id);
	if (!item) {
		return page('already handled', 'This card has already been approved, skipped, or removed. Nothing to do.', true);
	}

	if (action === 'approve') {
		await setItemStatus(id, 'published');
		return page('published ✓', `“${item.body.headline}” is live on <a href="https://productsear.ch/feed">the drum</a>.`);
	}

	if (action === 'skip') {
		await deleteItem(id);
		return page('skipped', `“${item.body.headline}” was discarded. The next draw comes due at the regular cadence — nothing published in this slot.`);
	}

	// regenerate: discard this draft and draw a fresh card right now — the
	// rotation emails the replacement for the same decision
	await deleteItem(id);
	const next = await drawNext(true);
	return page(
		next ? 'regenerated ✓' : 'regeneration came up empty',
		next
			? `A fresh card was drawn and mailed to ${APPROVAL_RECIPIENT} — approve it from your inbox. “${item.body.headline}” was discarded.`
			: `“${item.body.headline}” was discarded, but all generators came up empty — the next draw comes due at the regular cadence.`
	);
};
