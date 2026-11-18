---
type: Learning
title: Drum 24h cadence clock runs from the last draw — a manual redraw legitimately skips the next morning email
description: "**The fact (established 2026-11-13 while answering "should I have gotten an email already?"):** the Drum approval-email cadence is a **24h clock measured from t"
tags: [drum, cadence, approval-email, github-actions, cron]
timestamp: "2026-11-13T09:50:40.458Z"
---

# Drum 24h cadence clock runs from the last draw — a manual redraw legitimately skips the next morning email

**The fact (established 2026-11-13 while answering "should I have gotten an email already?"):** the Drum approval-email cadence is a **24h clock measured from the last draw** (`due = max(created_at)` of feed items — see [[wiping-feed-items-due-max-created-at-rotation-resets-empty-s]]), NOT an anchored daily 06:03 schedule. Consequence: a manual **Generate new** redraw (or an Approve that draws the next slot) shifts the due time, so the *following* morning's 05:03 UTC cron check can legitimately find the slot not-yet-due and skip → **no approval email that morning is expected behavior, not a bug.** The clock self-aligns to the cron from the next day (once overdue, the cron draws immediately at 05:03 UTC / ~06:03 Amsterdam).

Observed sequence (Nov 12–14, 2026): waku card drawn manually 17:04 Amsterdam → next slot due Nov 12 17:04+24h... i.e. the Nov 13 06:03 cron found it not yet due and correctly skipped; regular morning email resumes Nov 14 ~06:03 (slot overdue by then → draws on the cron).

**Secondary observation, same session:** the *scheduled* run for Nov 12 05:03 UTC never appeared in GitHub Actions (last scheduled run Nov 11, before the cron change) — GitHub can lag registering a changed cron schedule by a day or so. The workflow itself was proven healthy via **`workflow_dispatch` (manual dispatch) as the health-check tool** — don't conclude a workflow is broken from a missing scheduled run right after editing its `schedule:`. Watch item agreed with the user: if the Nov 14 morning email also misses (~06:15 check), add a second daily draw attempt so the morning email can't be missed. Related guardrail: [[rules/verify-production-runtime-env-vars-before-declaring-a-send-p]] (the Nov 12 silent-fail incident is a *different* failure mode — missing Railway env var — already fixed).

**Resolution (2026-11-13, commit `b9ccb22`):** the watch item shipped the same day — the schedule is now **miss-proof**: morning attempts at 04:03 / 05:03 / 06:03 UTC plus an evening catch-up at 16:03 UTC, all behind the cadence gate (only the first past-due attempt draws; redundant attempts no-op) — see [[decisions/drum-draw-schedule-made-miss-proof-cron-redundancy]]. The same push re-registers the cron schedules with GitHub, and the cadence anchor was rewound so the drum comes due exactly at 05:03 UTC (06:03 Amsterdam CET): the manual-redraw drift described above is now corrected by re-anchoring the clock rather than left to self-align.
