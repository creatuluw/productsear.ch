---
type: Decision
title: "Feed round 7: v1 ships all 7 item types; The Walk pitched"
description: Context
tags: [feed, listings, item-types, resurrections, the-walk, brainstorm, proposed]
status: proposed
supersedes: feed-round-6-bluesky-only-share-receipt-cards-accepted
timestamp: "2026-11-06T19:18:27.965Z"
---

# Feed round 7: v1 ships all 7 item types; The Walk pitched

## Context

Round 7 of the corpus-feed brainstorm (2026-11-06). Answers the round-6 grill Q6 (how much feed ships in v1). The user's answer: *"q6 - a + keep the idea"* — option A plus confirming the pending Resurrections pitch.

## Newly settled this round

- **v1 scope = full arsenal: every item type ships at launch.** No phased rollout of types (Q6's B/C rejected). Rationale: the draft pipeline is mostly the same machinery for every type, so the marginal cost of each additional type is low — the build cost is in the machinery, not the types.
- **Resurrections: in** (7th type). Saved-but-never-returned-to links get a second-life pitch; cheapest type to generate (a date query plus a draft).

## Confirmed item-type set (7)

1. **One Save** — the daily featured save
2. **Target-User Pitch** — synthetic personas from `bookmark_analysis.who`
3. **Two Futures**
4. **Ambition Path**
5. **The Pulse** — weekly corpus statistics
6. **Receipt cards** — share primitive + card renderer (Bluesky-only share at v1)
7. **Resurrections** — 300+ days untouched, deserves a second life

## New idea pitched this round — "The Walk" (awaiting in/out/parked)

Feed item type **and** navigation mechanic, descended from the round-1 "Semantic Walk" candidate: a trail of 3–5 listings connected by **embedding hops** — *"Five steps from a Rust CLI to a marriage manual."* Every stack page ends with **"keep walking →"** into its own semantic neighborhood. Positioning: the serendipity engine that turns the feed from a queue into an endless corridor — and the one mechanic competitors literally cannot rebuild without the vector index.

**Grill Q7 (asked, unanswered) — where does the feed live?**

- A) Own route (`/feed`) — clean magazine identity, linked from nav
- B) Homepage-first — the feed takes over the homepage below the search hero
- C) Route + homepage teaser — `/feed` canonical, homepage carries a compact "latest from the feed" block *(assistant lean — search keeps its throne, the feed gets a daily doorway)*

Plus: is The Walk in, out, or parked?

## Open branches (interview state after round 7)

- **Q7 feed placement** — asked, awaiting A/B/C + The Walk verdict.
- Carried parked: persona attribution · accounts (personalization post-accounts) · rotation calendar · share expansion (copy-image/link, other networks).
- Still unclaimed from the round-1 menu: Semantic Walk · Marginalia · Ribbon's Diary · Confessions · The Floor. Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- Draft-generation pipeline spans **seven** item types at v1 — build order is no longer phased by type.
- The Walk, if accepted, adds a vector-index-dependent navigation surface beyond the feed itself (stack pages get "keep walking →").
- Still unbuilt — no code yet; this record tracks proposal state only.
