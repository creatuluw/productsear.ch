---
type: Decision
title: Feed stream runs on rotation (personalization post-accounts); The Pulse accepted; Receipt cards pitched (proposed)
description: Context
tags: [feed, listings, item-types, rotation, the-pulse, receipt-cards, accounts, brainstorm, proposed]
status: proposed
supersedes: corpus-feed-anatomy-stream-stack-ambition-path-accepted-the-
timestamp: "2026-11-06T19:10:50.639Z"
---

# Feed stream runs on rotation (personalization post-accounts); The Pulse accepted; Receipt cards pitched (proposed)

## Context

Round 5 of the corpus-feed brainstorm (2026-11-06). Supersedes the round-4 anatomy record — one running ledger of interview state, so future sessions resume the interview rather than re-litigate the framing. The user's round-5 answer: *"q4-b + c if people have an account later"* + *"the idea is good"* (on The Pulse).

## Newly settled this round

- **Stream ordering = B rotation, with C personalization deferred until accounts exist.** A rotation algorithm picks the leading item type each day — variety is mechanical, not ranked. Personalized relevance layering is explicitly deferred to a future **accounts branch** (better-auth is already in the stack, so the dependency exists when needed). Cold-start problem sidestepped: anonymous visitors get the same rotation, no tracking required.
- **The Pulse: accepted** as an item type (was "awaiting in/out/tweaked"). The weekly corpus-statistics item (archetype drift, inactive-repo obituaries, rising domains) now serves the ~20% unexpected/trend-surprise quota.
- **Criteria gap narrowed to one:** with The Pulse in, every stated criterion has at least one item type serving it **except sharing** — no share primitive accepted yet. Flagged as tonight's remaining gap.

## Confirmed item-type set (5)

1. **One Save**
2. **Target-User Pitch** — synthetic personas from `bookmark_analysis.who`
3. **Two Futures**
4. **Ambition Path**
5. **The Pulse**

## New idea pitched this round — "Receipt cards" (awaiting in/out/tweaked)

Resurfaces the receipt-cards primitive from the original magazine proposal, now that sharing is the last unserved criterion: every feed item auto-renders a **shareable card** in the riso/instrument-grade visual identity — the claim on top, the proof underneath (the actual listing plus its 2 nearest neighbors as receipts). Not title+image OG-slop: a card that carries the *argument*, so it spreads even when the link isn't clicked. Generated server-side from the same data that wrote the post.

**Grill Q5 (asked, unanswered) — what's the unit of sharing?** A the card image (one-click download/copy, link in caption) / B the link + OG card (classic share, card only as preview) / C both — "copy link" + "copy image" side by side (assistant lean: C — cheap, lets readers choose per platform).

## Open branches (interview state after round 5)

- **Accounts** (new, spawned this round): when/if readers get accounts, personalization layers onto the rotation. better-auth already in stack.
- **Rotation calendar** (new, parked): which type leads which day.
- **Receipt cards: in / out / tweaked** — asked as Q5 alongside the unit-of-sharing question.
- Carried: persona-attribution disclosure line; 2a The Floor privacy; 2b obituary tone; 3a writing budget; 3b share destination; G audience sequencing. Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- Feed ordering is a deterministic rotation algorithm, not a ranked feed — no personalization code until accounts exist.
- Draft-generation pipeline now spans five item types including weekly Pulse statistics.
- Sharing primitive undecided — Receipt cards + Q5 answer close the last criteria gap.
- Still unbuilt — no code yet; this record tracks proposal state only.
