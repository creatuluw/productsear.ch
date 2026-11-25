---
type: Decision
title: Drum rotation never draws the same type twice in a row
description: Context
tags: [the-drum, rotation, no-repeat, feed]
status: accepted
timestamp: "2026-11-20T13:38:51.453Z"
---

# Drum rotation never draws the same type twice in a row

## Context

The drum's catch-and-skip rotation can land on the same type multiple draws in a row: the cursor advances one slot per draw, but when every generator before a slot fails, the first survivor wins — and during the November 2026 LLM outage that survivor was always The Walk (three consecutive Walks, Nov 14/16/17). The Walk got a type-specific 20-day minimum gap (2026-11-18), but the owner generalized the requirement: **never, for any type, the same drum type twice in a row in the sequence**.

## The choice

A general no-consecutive-repeat rule in the rotation itself (`src/lib/server/feed/rotation.ts`):

- New query `lastPublishedType()` (`src/lib/server/feed/queries.ts`): the type of the most recently **published** item — exactly what the reader sees on top of /feed.
- `drawNext()` fetches it once per draw and **skips that type** for the entire candidate loop, whatever the cursor says.
- Deliberate semantics: an empty day beats a duplicate. If the skip makes every remaining candidate fail, the draw returns null and the drum waits — the drum never publishes a repeat to escape a dry spell. (Realistic risk is low: pulse/resurrections/tombola are data-driven and rarely all fail together.)
- The Walk's 20-day gap stays — it is a stricter per-type resting cadence on top of the universal adjacent-repeat ban.

## Alternatives considered

- Gate on the last *drawn* (draft) type instead of last *published* — rejected: drafts pending approval aren't in the reader's stream yet, and the rule exists to protect what the reader sees. (Edge: two same-type drafts approved back-to-back could still repeat — accepted as rare; the owner controls approvals.)
- Per-type minimum gaps for all 10 types — overkill; the failure mode is adjacent repeats, not per-type frequency (except Walk, which keeps its stricter rule).

## Consequences

- Consecutive-type streaks are now structurally impossible in the published stream, even during full LLM outages.
- During an outage the drum may skip a day entirely rather than repeat — accepted trade, consistent with the human-gated editorial philosophy.
