---
type: Decision
title: "Drum draw cadence: once daily at 07:00 Amsterdam time"
description: Context
tags: [feed, the-drum, cron, cadence, timezone]
status: accepted
supersedes: decisions/feed-round-9-cadence-1-item-2-days-admin-configurable-the-to
timestamp: "2026-11-12T15:44:58.115Z"
---

# Drum draw cadence: once daily at 07:00 Amsterdam time

## Context

The Drum's draw cadence since [[decisions/feed-round-9-cadence-1-item-2-days-admin-configurable-the-to]] was **1 item / 2 days** (admin-configurable, 1–720h range), with the GitHub Actions draw cron (`feed-draw.yml`) firing daily at 09:07 UTC and no-oping until the cadence gate said DUE.

## Choice

The drum draws **once a day, in the morning at 07:00 Amsterdam time** (`Europe/Amsterdam`, DST-aware).

## Alternatives considered

- Keep the 2-day cadence: too slow for a daily appointment surface; the owner wants a morning edition.
- Multiple draws per day: more items than the owner can review through the email approval gate.

## Rationale

A predictable morning rhythm; the draw directly feeds the approval email (companion decision) so the day's item lands in the inbox first thing.

## Consequences

- The schedule must pin `Europe/Amsterdam`, not a fixed UTC hour — Amsterdam shifts UTC+1/UTC+2 with DST, so a fixed UTC time would drift an hour twice a year (GitHub Actions cron is UTC-only; the offset must be computed or the workflow adjusted seasonally).
- Cadence settings (`feed_settings` / admin console) move from the 2-day default to the daily 07:00 schedule; the "next draw in …" countdown now targets a daily 07:00 clock time.
