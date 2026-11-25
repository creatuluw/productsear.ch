---
type: Decision
title: Drum items gate on email approval — preview + Approve / Generate new / Skip mailed to the owner before anything publishes
description: Context
tags: [feed, the-drum, approval, email, editorial-workflow]
status: accepted
supersedes: decisions/feed-round-12-wrap-approvals-are-per-item-admin
timestamp: "2026-11-12T15:44:58.114Z"
---

# Drum items gate on email approval — preview + Approve / Generate new / Skip mailed to the owner before anything publishes

## Context

The Drum's human gate lived entirely in the admin console (`/admin/feed`): draft → inline editor → per-item approval toggle → publish, with gate-off items publishing automatically (see [[decisions/feed-round-12-wrap-approvals-are-per-item-admin]]). Reviewing a draw required logging in, and an unreviewed bad draw could go live — one did this session: a LinkedIn search-results listing ("leerkrachten basisonderwijs groningen - Google Zoeken") was drawn and published, then had to be removed from DB + site by hand.

## Choice

Every newly drawn Drum item is **first emailed to the owner (creatuluw@gmail.com)** containing the item preview plus three action buttons:

- **Approve** — publish the item
- **Generate new** — discard it and redraw
- **Skip this one** — discard it, advance the rotation

Nothing publishes without an explicit approval click from that email.

## Alternatives considered

- Keep auto-publish with post-hoc admin toggles (round-12 behavior): bad items go live before anyone sees them, and must be retracted after the fact.
- Admin-console-only approval: adds a login step and hides the preview behind the queue UI.

## Rationale

Inbox-native, zero-login review with the preview inline. Bad drafts die before publication instead of being retracted afterward; the owner stays in the loop without touching the admin console.

## Consequences

- The draw pipeline needs a pending/unpublished state per drawn item until an email action lands.
- The three email buttons must hit approval endpoints that are safe to expose in mail (secreted token or authenticated link).
- Ties into the daily Europe/Amsterdam draw (retimed to 06:00 later the same day — see the companion cadence decision).
- The admin console keeps the queue/inline editor as the secondary editorial surface (publish/retract/delete).
- The converged spec at `docs/specs/the-drum.md` needs its approval section updated to the email-first gate.
