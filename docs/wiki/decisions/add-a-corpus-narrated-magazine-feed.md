---
type: Decision
title: Add a corpus-narrated magazine feed to productsear.ch (proposed)
description: Context
tags: [magazine, editorial, content-strategy, feed, corpus, proposed]
status: proposed
supersedes: [remove-ask-mode-productsear-ch-becomes-search-only]
timestamp: "2026-11-06T18:44:46.196Z"
---

# Add a corpus-narrated magazine feed to productsear.ch (proposed)

## Context

Brainstorm (2026-11-06, status: **proposed, awaiting user answers**). productsear.ch is currently search-only (see [the Ask-mode removal ADR](remove-ask-mode-productsear-ch-becomes-search-only.md)). The user is exploring adding an editorial layer: a **magazine narrated by the corpus**. The stated unfair advantage: the corpus (3,764 classified bookmarks with embeddings, 30 archetypes, timestamps, analysis fields) means every editorial claim has a receipt — the actual saved link — and enables formats no other publication can produce. No writing staff required; drafts are template-generated from corpus data.

## The proposal — three idea groups (round 1)

1. **"The Living Index"** — corpus-native formats (the ~80%):
   - *Why We Saved This* — the intention behind one save ("saved 4:02am, 412 days ago")
   - *The Semantic Walk* — essay connecting 4–5 embedding nearest-neighbor hops; readers can continue the walk live into search
   - *Resurrections* — saved-but-never-returned-to links, revived
   - *Distance charts* — the two most semantically distant bookmarks of the week

2. **"The Signal Desk"** — the unexpected ~20%:
   - *Archetype drift report* — 30 archetypes × timestamps as a mood ring for what builders care about
   - *Abandonware obituaries* — from the repo-scan data: 1,751 inactive repos (no push in 30+ days) with live successors
   - *The Floor* — searches that fell below relevance floor 0.45 = demand the corpus can't satisfy, published as transparency column (doubles as an ingestion pipeline)

3. **Feed primitives**:
   - *The One Save* — daily single-bookmark edition (one link, one paragraph, one question) as the habit anchor
   - *Desks rotation* instead of categories: Emotion / Real Life / Improvement / Ambition / Signal desks
   - *Receipt cards* as share primitive: claim + 3 nearest-neighbor bookmarks as proof, in the riso/instrument-grade visual identity
   - *Magazine-in-the-corpus flywheel*: articles themselves bookmarked, archetyped, searchable; KPI = **saves generated per edition**, not pageviews

## Round-2 additions (2026-11-06, untriaged — in the scorecard as ideas 12–14)

- *Marginalia Desk* — publish the private `bookmark_analysis` who/what/how/when fields as margin annotations on the saved page snapshot; readers add their own marginalia, which becomes corpus data (UGC loop that deepens with every reader).
- *The Ribbon's Diary* — product-search the mascot writes a serialized weekly first-person column on what it "witnessed" being saved this week; whimsy as an emotional register, screenshot-shaped and corpus-dependent.
- *Corpus Confessions* — monthly reader-submission issue: anonymous saved-but-abandoned intentions ("I bookmarked a German course in 2023. I still don't speak German."); readers co-write the magazine, keeping the writing budget flat.

## Alternatives considered

- **Conventional tech blog** — rejected: requires writers and has no corpus advantage.
- **Newsletter-only curation** — folded into The One Save daily edition.

## Open questions blocking adoption (re-posed 2026-11-06 as option-based rounds)

Interview reformatted per [the interview-protocol rule](../rules/interview-questions-ship-with-lettered-options-plus-a-procee.md): every question now ships lettered options + an interviewer lean, and all 14 ideas go through a "proceed? / notes / additional ideas?" scorecard (1b). Awaiting the user's letter answers:

- **1a** Narrator voice: A curator "I" / B mascot product-search as recurring narrator / C editorial "we" / D hybrid (mascot daily, curator deep pieces).
- **1b** Idea scorecard over all 14 ideas (proceed? / notes — e.g. "2 yes but frozen-walk, 7 kill") + user's own additional ideas.
- **2a** The Floor privacy line: A log aggregated/anonymized and publish / B no query logging, substitute "newest 100 saves" / C log but publish only themes/clusters.
- **2b** Abandonware obituary tone: A neutral intelligence brief / B editorial spicy / C death report + successor matchmaking.
- **3a** Writing budget: A zero-writing autopilot / B one evening per week (drafts auto-generated, human edits) / C full editorial.
- **3b** Primary share destination: A X/HN screenshots / B LinkedIn / C private send-to-a-friend / D one canonical card that crops everywhere.
- **G** Who it serves first: A existing users (retention) / B strangers from shares (acquisition) / C sequenced — habit first, acquisition after ~4 issues.

Note: the former "semantic walks live vs frozen at publish" question is folded into the 1b scorecard as per-idea notes.

## Consequences if adopted

- New content surfaces + a draft-generation pipeline over the corpus.
- Possible search-query logging → explicit privacy decision needed (2a).
- Partially extends/reverses the search-only direction set 2026-11-01.
