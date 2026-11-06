---
type: Decision
title: "Feed round 8: homepage shows 3 latest feed cards; The Walk in, Ribbon's Diary re-pitched"
description: "Feed round 8: homepage shows 3 latest feed cards; The Walk in, Ribbon's Diary re-pitched"
tags: [[feed, listings, item-types, homepage, the-walk, ribbons-diary, brainstorm, proposed]]
status: proposed
supersedes: feed-round-7-v1-ships-all-7-item-types-the-walk-pitched
timestamp: "2026-11-06T19:20:18.124Z"
---

# Feed round 8: homepage shows 3 latest feed cards; The Walk in, Ribbon's Diary re-pitched

# Feed round 8: homepage shows 3 latest feed cards; The Walk in, Ribbon's Diary re-pitched

## Context

Round 8 of the corpus-feed brainstorm (2026-11-06). Answers the round-7 grill Q7 (where does the feed live — see [[decisions/feed-round-7-v1-ships-all-7-item-types-the-walk-pitched]]) plus the pending Walk verdict. The user's answer, with a homepage screenshot: *"q7 - /feed + we add the most recent 3 items from the feed in cards in the center of the available space, when a user starts a search then the cards disappear"* — and *"the idea stays"* confirming The Walk.

## Newly settled this round

- **Feed placement: `/feed` canonical + homepage teaser (Q7 option C, upgraded).** The homepage keeps search as the hero; the empty canvas below the TRY chips carries the **3 most recent feed items as cards, centered in the available space**. The cards **disappear the moment a user starts a search** — the feed borrows the homepage's empty space, never competes with the search hero.
- **The Walk: in.** Confirmed as item type **and** stack-page mechanic — every stack page ends with "keep walking →" into its own embedding-hop semantic neighborhood. The confirmed item-type set grows from 7 to **8**: One Save · Target-User Pitch · Two Futures · Ambition Path · The Pulse · Receipt cards · Resurrections · The Walk.
- v1 still ships every type (round-7 scope decision unchanged).

## Functional gap spotted

All 8 confirmed types look **backward** — nothing surfaces **new arrivals** (~+423 listings/month have no feed moment).

## Re-pitch — "The Ribbon's Diary" (awaiting in/out/parked)

Originally pitched in round 2; re-surfaced this round as the new-arrivals fix: the product-search mascot narrates the week's arrivals in first person — *"This week I watched 9 agent frameworks and a bread-making scraper get saved. One of these is not like the others."* Whimsy register, brandable, corpus-drafted.

## Grill Q8 (asked, unanswered) — how much feed per day?

- A) 1 item/day — slow and precious; each card feels like an event
- B) 3–5 items/day — small mixed batch, rotation guarantees type variety (assistant lean)
- C) Trickle + ceremonies — 1/day plus weekly rituals: Pulse Mondays, Diary Fridays, Resurrections Sundays

## Open branches (interview state after round 8)

- **Q8 cadence** — asked, awaiting A/B/C + Ribbon's Diary verdict.
- Carried parked: persona attribution · accounts (personalization post-accounts) · rotation calendar · share expansion.
- Still unclaimed from the round-1 menu: Marginalia · Confessions · The Floor.
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- Homepage gets its first feed-coupled surface: 3 latest cards centered below the TRY chips, dismissed on search start — implementation must hook the card block's visibility to search start (no code yet; this record tracks proposal state only).
- The Walk adds a vector-index-dependent navigation surface (stack pages get "keep walking →").
- Ribbon's Diary, if accepted, gives ~+423 listings/month a feed moment and becomes the mascot-narrated type.
- The Q8 cadence choice sets draft-generation throughput and the rotation-calendar shape.
