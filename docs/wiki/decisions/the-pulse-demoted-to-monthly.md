---
type: Decision
title: The Pulse demoted to monthly — opens each month covering the last month
description: Context
tags: [the-drum, the-pulse, feed, rotation, demotion, monthly-cadence]
status: accepted
timestamp: "2026-11-25T09:32:00.792Z"
---

# The Pulse demoted to monthly — opens each month covering the last month

## Context

The Pulse drew from the round-robin like every type — its slot came up roughly every 10 draws (slot 0 of the type order, 10 types, 1 draw/day), and November produced **two** "(November 2026)" editions (Nov 9 manual seed, Nov 19 cron draw). But the item's nature is a monthly report: rolling 30-day windows and a month-named headline. As a ~weekly-ish round-robin type it both over-published (two November editions) and under-delivered its premise (each edition's data window straddled months). Owner asked: **The Pulse appears once a month, at the beginning of a new month, covering last month.**

## The choice

Three layers, following the established catch-and-skip semantics:

1. **Generator gate** (`pulse.ts`, the Walk-demotion pattern): `generatePulse()` returns null unless `pulseEligible()` — Amsterdam editorial day-of-month ≤ 7 (`PULSE_WINDOW_DAYS`) AND no Pulse published in the current calendar month AND the last published Pulse's `signals.month` ≠ the month about to be covered. The covered-month label guard prevents re-covering a month that already has its edition; editions drawn before this rule carry no label (null ≠ label → draw allowed), so the gate can never silently brick the monthly rhythm.
2. **Month-opener preference** (`rotation.ts`): a generator gate alone cannot guarantee a monthly appearance — the round-robin only hands the pulse a slot every ~10 draws, so a 7-day window would miss the slot ~30% of the time. Instead, while `pulseEligible()`, `drawNext()` tries `pulse` FIRST, ahead of the cursor: the first due draw of each month opens with The Pulse. null → normal loop runs (catch-and-skip), and the pulse gets another lead chance the next day. `nextDueInfo()`'s next-type reflects the override so the /feed header stays honest.
3. **Content covers the previous calendar month**: drift = covered month vs the 3 months before (rate-normalized, baseline window length computed exactly); rising domains = ≥3 saves in the covered month vs ≤1 in the 10 months before. Headline names the covered month ("(November 2026)") and `signals.month` carries it. Boundaries derive from `pulseCalendar()` in Europe/Amsterdam (the editorial clock; a manual draw-now at any hour stays consistent — UTC vs Amsterdam only diverge after midnight).

## Transition (2026-11-25)

The two pre-rule November pulses (`7ad2588c`, `5b36bfc6` — both "(November 2026)") were stamped with `signals.month='November 2026'` (backup at `.work/pulse-rows-backup-2026-11-25.json`, idempotent jsonb_set, dry-run first). Consequence: **December skips its Pulse** — November is already double-covered — and the January 1–7 window draws a **December-covering** edition, after which steady state holds (one edition per month, opening it, covering the month before).

## Alternatives considered

- Generator gate only (Walk pattern) — rejected as sole mechanism: the ~10-day slot cadence makes a first-week window miss ~30% of months; the rotation lead is what makes "opens the month" deterministic.
- Rotation-level minimum gap for all types — overkill; per-type policy belongs in the generator, the lead preference is the only rotation-level piece.
- Gate on last-pulse published month only (no covered-label guard) — would have drawn a third "(November 2026)" edition on Dec 1; readers would see it as a bug.
- Allow the December edition anyway — rejected: three November-titled cards in a 30-day feed window.

## Consequences

- The month literally opens with The Pulse (first due draw, days 1–7), covering the previous month.
- Skip/approve retries stay inside the window (drafts don't count as published — a pending draft never burns the month's slot).
- An empty week (pulse generator returns null all 7 days) means no edition that month — same acceptance as the Floor's starving.
- Verified live against the shared Railway DB: eligible(false on Nov 25 / mock Dec 1, true on mock Jan 1); a mock October edition built 3 movers with the new windows. Spec cadence cell (`docs/specs/the-drum.md` type 5) updated to monthly.
