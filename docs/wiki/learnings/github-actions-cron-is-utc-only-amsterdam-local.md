---
type: Learning
title: GitHub Actions cron is UTC-only — Amsterdam-local schedules drift an hour with DST
description: "**The fact (found 2026-11-12 while retiming the drum draw):** GitHub Actions `schedule:` accepts cron expressions in **UTC only** — there is no timezone paramet"
tags: [github-actions, cron, timezone, dst, feed-draw, digest-send]
timestamp: "2026-11-12T15:58:17.798Z"
---

# GitHub Actions cron is UTC-only — Amsterdam-local schedules drift an hour with DST

**The fact (found 2026-11-12 while retiming the drum draw):** GitHub Actions `schedule:` accepts cron expressions in **UTC only** — there is no timezone parameter.

Pinning a local clock time (e.g. 06:00 Europe/Amsterdam) therefore means hardcoding a fixed UTC slot (05:03 UTC), which **drifts +1 hour during CEST** (roughly late March–late October: the same slot fires at 07:03 Amsterdam). The alternatives are both worse:

- two cron entries → double-fires half the year;
- seasonal edits to the workflow → someone must remember to flip it twice a year.

**House choice:** accept the drift and document the CET/CEST split in a header comment on the workflow (`feed-draw.yml` notes "05:03 UTC = 06:03 Amsterdam; 07:03 during summer time"). The same applies to `digest-send.yml` (Monday 10:07 UTC).

Note also: cron runs don't count as repo activity for the 60-day scheduled-workflow disable (see [github-disables-scheduled-workflows-after-60-days]) — a quiet quarter can silently kill the daily draw even though the cron "runs".
