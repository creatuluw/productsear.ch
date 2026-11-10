---
type: Entity
title: The Digest (email digest pipeline)
description: The Digest (email digest pipeline)
tags: [email, feed, the-drum, digest, cron, utobo]
timestamp: "2026-11-09T15:22:41.807Z"
---

# The Digest (email digest pipeline)

# The Digest (email digest pipeline)

**The Digest** is the weekly email edition of [the-drum-feed](./the-drum-feed.md) — an opt-in digest of freshly published drum cards, delivered through [utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md). **Dark by default**: gated by the admin-toggled `feed_settings.digest_enabled` flag, nothing sends until the admin flips it on.

## What it is

Readers opt in via an email form on `/feed` (`POST /api/digest/subscribe` — public, validated, duplicate-safe; resubscribing after an unsubscribe clears the flag and rotates the token). Every email carries a per-reader unsubscribe token linking to `/digest/unsubscribe` (subscribers are marked, never erased — kept for abuse forensics).

## Why it matters

It completes The Drum's publish loop: corpus draws → admin gates → publishes → Bluesky share → OG unfurl → inbox. Readers follow the feed without visiting the site, and token-based unsubscribe keeps every send consent-clean.

## Details

- **Location**: core pipeline `src/lib/server/feed/digest.ts` (subscribers, windowed selection, `buildDigestHtml`, `sendDigest()`); opt-in endpoint `src/routes/api/digest/subscribe/+server.ts`; unsubscribe page `src/routes/digest/unsubscribe/`; send runner `scripts/digest-send.ts` (`--dry` renders only / `--send` real); cron `.github/workflows/digest-send.yml` (Mondays 10:07 UTC — off the top of the hour to dodge GitHub's cron rush — plus manual `workflow_dispatch`; **fixed 2026-11-09** after invalid-YAML startup failures left it dead since creation, see lifecycle); migration `scripts/migration-digest.sql`.
- **Data model**: `te9_dev.digest_subscribers` (id, unique email, unique unsubscribe token, `unsubscribed_at`, `created_at`) + `feed_settings.last_digest_sent_at` — the send-window cursor.
- **Send semantics**: items with `published_at > last_digest_sent_at` (limit 12) make up the next digest; first-ever send (no cursor yet) takes the latest 5 cards; a quiet week skips the send and the cursor stays put; the cursor advances **only after a real send reaches at least one subscriber**. Partial utobo failures are tolerated and reported (`sent to N/M`).
- **Email build**: brand-styled, table-based HTML with inline styles only (email-client safe); the `{{UNSUBSCRIBE_TOKEN}}` placeholder is replaced per recipient with their token.
- **Configuration**: `UTOBO_EMAIL_API_KEY` (send-only `ut_live_…` — without it sends fail gracefully with a clean reason and the digest stays dark by design), optional `DIGEST_FROM_EMAIL` (default `The Drum <drum@productsear.ch>`), admin block on [admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) (subscriber count, last-sent timestamp, enabled badge, confirm-gated send-now).

## Relationships

- [the-drum-feed](./the-drum-feed.md) — the digest emails this feed's published cards (spec slice E)
- [utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md) — the delivery transport: raw REST POST to `api.email.utobo.com/v1/emails` with a Bearer key, per the wiki contract
- [admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) — where the digest is toggled, monitored, and triggered manually

## Lifecycle

- First added: 2026-11-06 — commit `29fa3a8`, The Drum's spec slice E ([the-drum-feed-spec](../artifacts/the-drum-feed-spec.md)); dark by default pending the operator adding `UTOBO_EMAIL_API_KEY` to `.env` and the repo's GitHub secrets.
- **Send cron fixed: 2026-11-09** — `.github/workflows/digest-send.yml` shared the invalid-YAML startup-failure bug with `feed-draw.yml` (a colon+space inside a plain scalar → every run died with zero jobs, so the weekly schedule never fired once since its 11-06 creation); fixed in the same commit `5169320` (failure signature in [learnings/github-actions-invalid-yaml-startup-failure-with-zero-jobs-t](../../learnings/github-actions-invalid-yaml-startup-failure-with-zero-jobs-t.md)). First real send still pending `digest_enabled` + a publish window with fresh cards.
