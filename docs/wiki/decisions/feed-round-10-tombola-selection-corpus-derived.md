---
type: Decision
title: "Feed round 10: Tombola selection corpus-derived; Origin card parked; The Floor pitched (aggregated search misses)"
description: Context
tags: [[feed, listings, item-types, the-tombola, the-floor, disclosure, origin-card, brainstorm, proposed]]
status: proposed
supersedes: feed-round-9-cadence-1-item-2-days-admin-configurable-the-to
timestamp: "2026-11-06T19:24:54.611Z"
---

# Feed round 10: Tombola selection corpus-derived; Origin card parked; The Floor pitched (aggregated search misses)

## Context

Round 10 of the corpus-feed brainstorm (2026-11-06). Answers the round-9 grill Q9 — the user's answer: *"q9 - b"*. See [[decisions/feed-round-9-cadence-1-item-2-days-admin-configurable-the-to]] for the cadence + Tombola-in context.

## Newly settled this round

- **Tombola selection: corpus-derived (B).** The draw is scored automatically — archetype drift + Pulse signals rank the last 10 saves and pick the winner. Same brain as the Pulse, **zero new plumbing**: no manual admin toil (A) and no external trend ingestion (C). The Tombola shares the feed brain; no separate scoring dependency.
- **The Origin card: parked** (no in/out verdict). Joins the parked stack rather than resolving.
- **Rotation math surfaced:** 9 types × 1 item/2 days ≈ each type surfaces every ~2.5–3 weeks — the calendar/scheduling branch of the feed brain will matter soon.

## New pitch — "The Floor" (awaiting in/out/parked), re-pitched with concrete format

The **last unclaimed meaty type** (was parked; now actively pitched as type #10 candidate): a **monthly item built from aggregated search misses** — *"This month, 214 searches fell below the relevance floor. 40% wanted what we can't describe yet."*

- **Themes only, never raw queries** — privacy-safe by construction (the round's standing The Floor privacy line, now baked into the format).
- **Transparency-as-content**: shows the machine has holes, invites readers to fill them, and quietly doubles as the **ingestion radar** for what the corpus should collect next.
- Shares well because admitting misses is disarming.

## Grill Q10 (asked, unanswered) — how do synthetic voices disclose?

- **A) Overt label on every card** — "drafted from the corpus — no human wrote this"; bulletproof honesty, dulls the magic.
- **B) Type tags + one methodology page** — cards already carry their type name; add one "how this feed works" page explaining drafts are corpus-derived *(assistant lean — honest without stamping every card)*
- **C) Nothing** — read as editorial voice; lightest, but one Bluesky callout could cost the credibility the whole concept runs on.

## Open branches (interview state after round 10)

- **Q10 disclosure** — asked, awaiting A/B/C + The Floor verdict.
- Carried parked: persona attribution · accounts (personalization post-accounts) · share expansion · Marginalia · Confessions · **Origin card (newly parked this round)**.
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- The Tombola needs **no external trend source and no admin picking loop** — its scorer reuses the archetype-drift + Pulse signals already in the feed brain.
- The Floor, if accepted, becomes item type #10 and adds a monthly aggregation job over search-miss data (themes only) — transparency content that also feeds corpus strategy.
- The Q10 choice sets the disclosure baseline for **every** card the feed ships — it is the trust posture of the whole synthetic-voice concept.
- No code yet; this record tracks proposal state only.
