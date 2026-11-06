---
type: Decision
title: "Reshape the corpus feed as a listings feed of item types: pitches, One Save, Two Futures (proposed)"
description: Context
tags: [feed, listings, item-types, pitches, brainstorm, proposed]
status: proposed
supersedes: [add-a-corpus-narrated-magazine-feed-to-productsear-ch-propos]
timestamp: "2026-11-06T19:04:19.398Z"
---

# Reshape the corpus feed as a listings feed of item types: pitches, One Save, Two Futures (proposed)

## Context

Rounds 2–3 of the corpus-feed brainstorm (2026-11-06). The user answered round 1 (narrator voice → **A, corpus-drafted**) and in round 2 reframed the deliverable. Quote: *"the listings feed will be a feed with different types of content from multiple angles and ideas to which a user can better understand how it can change or enrich their life and ambitions."* This reshapes the prior framing (see the superseded magazine-feed proposal below): **not a magazine of articles, but a feed of typed content items clustered around listings.**

## The choice

- The surface is a **listings feed composed of typed content items**, not magazine articles. Each listing gets multiple angle-posts showing how it can change or enrich a life.
- **Confirmed item types (user, 2026-11-06):**
  - **Target user pitches** — posts under the feed where the target users of a listing talk about it, to promote it and motivate other target users to look. Machine-drafted from the corpus: the `bookmark_analysis.who` field already records who each save was for (see [[learnings/corpus-schema-facts-raindrop-created-at-analysis]]), so pitch drafts are template-generated — no writing staff. **Voices are synthetic personas** (user picked A, round 3): drafted from analysis data ("For the freelance designer drowning in revisions…"), not real reader quotes.
  - **One Save** — repurposed from "daily edition" (its framing in the superseded proposal) to a **feed item type**.
  - **Two Futures** — confirmed (user, round 3): machine-drafted two-column micro-story per listing, "Your Tuesday without it vs. with it" (concrete morning/deadline/weekend snapshots, before/after). Screenshot-shaped; only possible because the corpus knows what each tool actually does.

The 14 ideas from the superseded magazine proposal remain the candidate item-type pool (Semantic Walk, Resurrections, Signal Desk formats, etc.).

## Alternatives considered

- **Magazine with articles** (the prior proposal) — replaced by the user's item-type-feed framing; see the superseded ADR for the full idea menu and interview rounds.
- **Pitch voices**: A synthetic personas (chosen) / B real reader voices only — pitch slots empty until users submit / C hybrid — labeled synthetic drafts ship day one, real quotes replace them with visual priority. Assistant lean was C; user chose A.
- **Feed anatomy** — now the live grill question (Q3, see below).

## Open branches (interview state after round 3)

- **Feed anatomy (Q3, asked, unanswered)**: A one mixed stream (all item types interleave, recency/relevance-ranked, social-feed style) / B listing-centered (browse listings; each carries its stack of pitch/two-futures/one-save posts) / C stream + stack — one mixed stream, every card links to the listing's full post-stack page (assistant lean: C — stream drives return visits, stack drives depth).
- **Ambition Path (pitched round 3, awaiting in/out/tweaked)**: a feed item type chaining multiple listings into one ordered route toward a named ambition — *"From spreadsheet chaos to shipping your first SaaS — the 5 listings that matter, in order"* — generated from archetype + semantic clusters in the corpus. Bigger share artifact than a single post (people share destinations, not steps). Not yet accepted.
- **Persona attribution (parked, flagged round 3)**: invented pitch voices will occasionally get called out online; the feed needs a one-line "drafted from the corpus, not a human" disclosure convention. Parked, not grilled.
- Carried over from the superseded proposal, still unanswered: writing budget (3a), primary share destination (3b), audience-first sequencing (G), The Floor privacy line (2a). Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- A draft-generation pipeline over corpus analysis fields (`who` → pitches) — consistent with the zero-writing-budget direction.
- Voice is corpus-drafted and explicitly synthetic; disclosure/attribution for persona voices is a known follow-up (persona attribution branch).
- Still extends/reverses the search-only direction set 2026-11-01 (see [[decisions/remove-ask-mode-productsear-ch-becomes-search-only]]).
- Unbuilt — no code yet; this record tracks the proposal shape so future sessions resume the interview, not re-litigate the framing.
