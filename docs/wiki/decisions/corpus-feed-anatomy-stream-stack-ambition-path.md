---
type: Decision
title: "Corpus feed anatomy: stream + stack; Ambition Path accepted; The Pulse pitched (proposed)"
description: Context
tags: [[feed, listings, item-types, stream, ambition-path, the-pulse, brainstorm, proposed]]
status: proposed
supersedes: reshape-the-corpus-feed-as-a-listings-feed-of-item-types-pit
timestamp: "2026-11-06T19:08:35.419Z"
---

# Corpus feed anatomy: stream + stack; Ambition Path accepted; The Pulse pitched (proposed)

## Context

Round 4 of the corpus-feed brainstorm (2026-11-06). Supersedes the round-3 state record, which superseded the magazine-feed proposal — one running ledger of interview state, so future sessions resume the interview rather than re-litigate the framing. The user's round-4 answer: *"q3 - c + the idea i want to keep."*

## Newly settled this round

- **Feed anatomy = C: stream + stack.** One mixed stream interleaving all item types; every card links to its listing's full post-stack page. Rationale (assistant lean the user adopted): the stream drives return visits, the stack drives depth. This implies **two surfaces**: the stream itself and a per-listing post-stack page.
- **Ambition Path: accepted as an item type** (was "awaiting in/out/tweaked"). A feed item chaining multiple listings into one ordered route toward a named ambition — *"From spreadsheet chaos to shipping your first SaaS — the 5 listings that matter, in order"* — generated from archetype + semantic clusters. A bigger share artifact than a single post (people share destinations, not steps).

## Confirmed item-type set (4)

1. **Target-User Pitch** — machine-drafted from `bookmark_analysis.who`, synthetic persona voices (user chose A round 3; see [[learnings/corpus-schema-facts-raindrop-created-at-analysis]])
2. **One Save**
3. **Two Futures** — two-column before/after micro-story per listing
4. **Ambition Path** — new this round

## New idea pitched this round — "The Pulse" (awaiting in/out/tweaked)

A weekly feed item generated purely from corpus data — pitched as the realization of the **~20% unexpected/trend surprise quota** (currently no accepted item type covers it; flagged as a criteria gap):

- **Archetype drift** — "AI-agent saves +40% this month" from the 30-archetype × timestamp data
- **Inactive-repo obituaries folded in** — from the repo-scan activity split (1,751 repos with no push in 30+ days; see [[pages/artifacts/digital-products-repos-activity-split-csvs]])
- **Rising domains nobody's talking about yet**

Framing: "market intelligence from a newsroom that happens to be a database." Effectively condenses the old Signal Desk formats (magazine ADR idea group 2) into one weekly item type.

## Open branches (interview state after round 4)

- **Stream ordering (Q4, asked, unanswered)**: A pure recency / B rotation algorithm — guarantees type/angle variety daily, Pulse on Mondays (assistant lean; makes the "multiple angles" promise mechanical and gives return visits a rhythm) / C personalized relevance — needs tracking, cold-start is weak.
- **The Pulse: in / out / tweaked** — asked alongside Q4. If rejected, the 20%-surprise criteria gap reopens.
- Parked/carried: persona-attribution disclosure line; 2a The Floor privacy; 2b obituary tone; 3a writing budget; 3b share destination; G audience sequencing. Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- Stream + stack requires a per-listing post-stack page surface in addition to the feed stream.
- Draft-generation pipeline over corpus analysis fields (pitches, futures, ambition routes, Pulse statistics) — consistent with the zero-writing-budget direction.
- Still extends/reverses the search-only direction set 2026-11-01 (see [[decisions/remove-ask-mode-productsear-ch-becomes-search-only]]).
- Unbuilt — no code yet; this record tracks proposal state only.
