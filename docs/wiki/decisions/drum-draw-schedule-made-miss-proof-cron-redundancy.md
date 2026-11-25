---
type: Decision
title: Drum draw schedule made miss-proof (cron redundancy)
description: Context
tags: [feed, the-drum, cron, github-actions, cadence, resilience, email-approval]
status: accepted
timestamp: "2026-11-13T09:57:16.982Z"
---

# Drum draw schedule made miss-proof (cron redundancy)

## Context

On 2026-11-13 the user asked for the Drum approval email at **06:00 Amsterdam time every day — "so also still for today"**. Two problems made a single daily cron insufficient:

- GitHub's scheduler had **silently skipped** the scheduled run that followed the Nov 12 cron change (see [[learnings/drum-24h-cadence-clock-runs-from-the-last-draw]], whose watch item read: *"if the morning email also misses, add a second daily draw attempt so the morning email can't be missed"*).
- The 24h cadence clock (measured from the last draw) had drifted off the morning anchor, so the next cron check would not be precisely due at 06:00.

## Choice

`.github/workflows/feed-draw.yml` (commit `b9ccb22`) now fires **four cadence-gated attempts daily**:

- **Morning window**: `3 4,5,6 * * *` — 04:03, 05:03, 06:03 UTC. The cadence gate draws only on the first attempt past the 24h clock (normally 05:03 UTC = 06:03 Amsterdam CET); redundant attempts no-op as "not due".
- **Evening catch-up**: `3 16 * * *` — 16:03 UTC (17:03 Amsterdam), fires only if the entire morning window missed, so the drum never silently loses a day.
- **Concurrency group** `feed-draw` (`cancel-in-progress: false`) serializes overlapping attempts.

Same session: today's approval mail was sent immediately via a manual draw (the 06:00 slot had already passed), and the cadence anchor was **rewound** so the drum came due exactly at tomorrow's 05:03 UTC check — permanently re-anchoring the 24h clock to the morning slot.

## Alternatives considered

- **Keep the single 05:03 UTC cron** — rejected: GitHub's scheduler demonstrably skips scheduled runs (the Nov 12 post-change run never appeared); one silent skip = one lost morning edition.
- **DST-aware / seasonal cron entries** — the earlier timing ADR ([[decisions/drum-draw-retimed-to-06-00-amsterdam-cron-05-03]]) rejected a second entry for fear of double-firing. That objection **dissolves now**: the cadence gate makes every extra attempt idempotent, so double-firing is the resilience mechanism, not a bug.

## Rationale

The email-approval gate makes the owner's inbox the primary review surface, so a silently missed cron equals a silently missed drum. Redundancy is free once draws are idempotent — the gate already no-ops attempts that are not due, and only the first past-due attempt draws.

## Consequences

- The drum can never silently lose a day unless all four attempts miss (the evening catch-up covers a fully missed morning).
- Timing unchanged: primary slot stays 05:03 UTC = 06:03 Amsterdam CET winter / 07:03 CEST summer — the DST drift remains accepted per the timing ADR, which this decision complements (does not supersede).
- Pushing the workflow file also re-registers the schedules with GitHub, itself addressing the lagged-registration skip.
- The health-check tool remains `workflow_dispatch`: a manual run correctly reports "not due, skipping" when the gate is satisfied.
