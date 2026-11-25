---
type: Entity
title: Drum email approval pipeline
description: "**The Drum email approval pipeline** — the code path that turns every drum draw into a **draft first, decision second**: the drawn card is emailed to the owner "
tags: [feed, the-drum, approval, email, hmac, utobo, editorial-workflow]
timestamp: "2026-11-12T15:59:03.146Z"
---

# Drum email approval pipeline

**The Drum email approval pipeline** — the code path that turns every drum draw into a **draft first, decision second**: the drawn card is emailed to the owner as a styled preview with three action links, and only an explicit click publishes it. Implements [decisions/drum-items-gate-on-email-approval-preview-approve](../../decisions/drum-items-gate-on-email-approval-preview-approve.md) on [pages/entities/the-drum-feed](./the-drum-feed.md).

## What it is

Two pieces, added 2026-11-12:

- `src/lib/server/feed/approval.ts` — HMAC capability tokens + the brand-styled approval email (card preview + three buttons), sent via the utobo stack (same sender path as [pages/entities/the-digest-email-digest-pipeline](./the-digest-email-digest-pipeline.md)).
- `src/routes/api/feed/approve/+server.ts` — the GET endpoint the email buttons hit. Renders a tiny standalone confirmation page (inline styles, no site chrome, `noindex` — it is read inside a mail context).

## Details

- **Interface**: `GET /api/feed/approve?id=<uuid>&token=<hmac>&action=approve|regenerate|skip`
  - `approve` → `setItemStatus(id, 'published')` → "published ✓" page
  - `skip` → `deleteItem(id)` → nothing publishes in this slot; next draw due at the regular cadence
  - `regenerate` ("Generate new") → `deleteItem(id)` + `drawNext(true)` **synchronously** — the fresh card is drafted and its approval email sent *before* the confirmation page renders, per the owner's requirement that the new request arrives right after the signal is received
  - invalid id/token → **403** page ("invalid link"); valid id, already-handled draft → friendly 200 ("already handled")
- **Capability token**: `HMAC-SHA256(item id, secret)`, hex-truncated to 32 chars, verified with `timingSafeEqual`. **No schema change and nothing stored** — the capability is derived from the id, so there is no token column to migrate or leak. Actions are plain GET links because email clients can't run JS or POST.
- **Configuration**: `DRUM_APPROVAL_SECRET` (falls back to `BETTER_AUTH_SECRET`; throws if neither is set), `DRUM_APPROVAL_EMAIL` (default `creatuluw@gmail.com`), `DIGEST_FROM_EMAIL` (from-line). The secret is set **identically on Railway + GitHub Actions + local `.env`** so tokens minted by the cron-run draw verify against production ([decisions/drum-draw-retimed-to-06-00-amsterdam-cron-05-03](../../decisions/drum-draw-retimed-to-06-00-amsterdam-cron-05-03.md)).
- **Failure safety**: a failed email never loses the card — the drawn item stays a **draft** visible in [pages/entities/admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) (the secondary editorial surface, which can also publish/retract/delete manually).

## Relationships

- [pages/entities/the-drum-feed](./the-drum-feed.md) — the cadenced surface this gates; every draw inserts as a draft and mails first
- [decisions/drum-items-gate-on-email-approval-preview-approve](../../decisions/drum-items-gate-on-email-approval-preview-approve.md) — the decision behind the gate
- [pages/entities/utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md) — the sending infrastructure (preview + confirmation emails)
- [pages/entities/admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) — fallback editorial surface; drafts land here if mail fails

## Lifecycle

- First added: 2026-11-12 (commits `e4ecd86..1b8bb66`) with the email-first approval gate.
- Same day, first real end-to-end run: a Resurrections draft on listing −424 (synthetic negative id) was drawn and mailed; the skip path deleted the throwaway, a tampered token was rejected with 403 (initially returned 200 — fixed by the `ok` flag on the page helper), and a `workflow_dispatch` run proved the cron environment + secrets green ("not due, skipping").
