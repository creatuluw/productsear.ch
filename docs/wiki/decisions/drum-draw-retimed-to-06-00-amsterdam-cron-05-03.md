---
type: Decision
title: "Drum draw retimed to 06:00 Amsterdam (cron 05:03 UTC, DST drift accepted)"
description: Context
tags: [feed, the-drum, cron, cadence, timezone, github-actions, railway]
status: accepted
supersedes: decisions/drum-draw-cadence-once-daily-at-07-00-amsterdam
timestamp: "2026-11-12T15:58:17.797Z"
---

# Drum draw retimed to 06:00 Amsterdam (cron 05:03 UTC, DST drift accepted)

## Context

Within the same session that adopted a daily 07:00 Amsterdam morning slot ([decisions/drum-draw-cadence-once-daily-at-07-00-amsterdam]), the user overrode the clock time: "no make that 6:00 amsterdam time". The daily cadence (24h) stands; only the draw time moves an hour earlier. Implementation shipped in commits `e4ecd86..1b8bb66`.

## Choice

The drum draws **once a day at 06:00 Amsterdam time**. Because GitHub Actions cron is UTC-only, the workflow pins **05:03 UTC** (off the top of the hour to dodge minute-cron contention) = **06:03 CET** in winter. During CEST (summer) the same UTC slot fires at **07:03 Amsterdam** — the one-hour drift is accepted and documented in the workflow header comment rather than chased with seasonal edits.

Concretely: `feed_settings` cadence 48h → **24h** (old value backed up before the update), `DEFAULT_CADENCE_HOURS` changed in code, `.github/workflows/feed-draw.yml` cron 09:07 → **05:03 UTC**.

## Alternatives considered

- Keep 07:00 — overridden by the user.
- DST-aware schedule (two cron entries or seasonal edits): GitHub Actions has no timezone-aware cron; a second entry would double-fire half the year. A fixed UTC slot with a documented CET/CEST split is simpler and predictable.

## Rationale

The inbox is the primary review surface (email-approval gate), so draw time = email time; the owner wants the morning edition before the day starts. The rotation clock sat at 2026-11-09 (a draw immediately due), which made the retiming testable the same day.

## Consequences

- Secrets `DRUM_APPROVAL_SECRET` + `DRUM_APPROVAL_EMAIL` must be **identical across Railway, GitHub Actions, and local `.env`** — tokens minted by the cron-run draw have to verify against the production endpoint that the emailed links hit.
- The "next draw in …" countdown and the admin console read the same cadence clock; a manual draw occupies the day's slot (the verified workflow_dispatch run correctly no-oped with "not due, skipping").
- Summer-time draws land at 07:03 Amsterdam until the slot is manually re-pinned in October.
