---
type: Decision
title: "Feed round 9: cadence 1 item/2 days admin-configurable; The Tombola in as type #9; The Origin card pitched"
description: Context
tags: [feed, listings, item-types, the-tombola, cadence, admin-console, origin-card, brainstorm, proposed]
status: proposed
supersedes: feed-round-8-homepage-shows-3-latest-feed-cards-the-walk-in-
timestamp: "2026-11-06T19:23:36.322Z"
---

# Feed round 9: cadence 1 item/2 days admin-configurable; The Tombola in as type #9; The Origin card pitched

## Context

Round 9 of the corpus-feed brainstorm (2026-11-06). Answers the round-8 grill Q8 (cadence — see [[decisions/feed-round-8-homepage-shows-3-latest-feed-cards-the-walk-in-]]) plus the pending Ribbon's Diary verdict. The user's answer: *"q8 - 1 item every 2 days, but make it a setting in the admin"* — and *"the idea -> make it: last 10 tombola - where we narrate 1 item from the last 10 most relevant to current trends or sentiments"*.

## Newly settled this round

- **Cadence: 1 item every 2 days, admin-configurable.** The feed's generation rate is not a hardcoded constant — it becomes a **setting in the admin console** ([[pages/entities/admin-console-admin]]), so cadence can be tuned without a deploy. This resolves Q8 with a slower-than-proposed rate (option A's "slow and precious" register, halved to 1/2days).
- **The Tombola: in, as item type #9** (Ribbon's Diary reshaped, not accepted as pitched). The mascot-narrated new-arrivals mechanic is now a **draw**: pick from the **last 10 saves**, narrate the **one most in tune with current trends or sentiments**. The mascot gets a raffle drum. The round-8 functional gap (new arrivals have no feed moment) is covered.
- **Feed inventory (9 types):** One Save · Target-User Pitch · Two Futures · Ambition Path · The Pulse · Receipt cards · Resurrections · The Walk · The Tombola. v1 still ships every type (round-7 scope unchanged).

## New pitch — "The Origin card" (awaiting in/out/parked)

A **stack-spine primitive, not a feed type**: every listing's stack page opens with a provenance card — *saved on 2025-03-14, classified AI Coding Agent + RAG & Search, 8 feed items written about it since.* The receipt-of-intent that anchors every stack, gives each listing a story even with zero feed items, and makes any stack URL shareable on its own. The thing all 9 types implicitly point back to.

## Grill Q9 (asked, unanswered) — what scores the Tombola draw?

- **A) Manual** — admin picks the winner each draw; full control, recurring toil
- **B) Corpus-derived** — archetype drift + Pulse signals score the last 10 automatically *(assistant lean — self-contained, no new dependencies, same brain as the Pulse)*
- **C) External trends** — ingest HN/Bluesky/Google Trends to score; freshest signal, new plumbing

## Open branches (interview state after round 9)

- **Q9 tombola selection brain** — asked, awaiting A/B/C + Origin card verdict.
- Carried parked: persona attribution · accounts (personalization post-accounts) · share expansion · Marginalia · Confessions · The Floor.
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- The feed gains a runtime-configurable cadence knob in the admin console — draft-generation throughput becomes an ops setting, not a code constant.
- The Tombola adds a **trend/sentiment scoring requirement** to the feed brain; the Q9 choice determines whether that scorer is manual, corpus-internal, or needs external trend plumbing.
- The Origin card, if accepted, makes every stack page start with provenance — a new stack-page primitive independent of feed item types, and the shareability anchor for stack URLs.
- No code yet; this record tracks proposal state only.
