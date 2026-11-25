---
type: Decision
title: "Feed round 12: editorial workflow in (corpus-drafted, admin-approved); artifact source D hybrid+origin tags; The Drum in; The Digest pitched (utobo email)"
description: Context
tags: [[feed, listings, editorial-workflow, admin-gate, the-drum, the-digest, impress-the-boss, artifact-origin-tags, utobo, brainstorm, proposed]]
status: proposed
supersedes: feed-round-11-the-floor-in-type-10-impress-the-boss-in-as-us
timestamp: "2026-11-06T19:29:47.720Z"
---

# Feed round 12: editorial workflow in (corpus-drafted, admin-approved); artifact source D hybrid+origin tags; The Drum in; The Digest pitched (utobo email)

## Context

Round 12 of the corpus-feed brainstorm (2026-11-06). The user answered the round-11 grill with *"q11-d"* (Impress-the-Boss artifact source) and *"the drum: i like it"* (The Drum verdict), and **originated a new architectural piece themselves**: the admin editorial gate. See [[decisions/feed-round-11-the-floor-in-type-10-impress-the-boss-in-as-us]] for the Q11/The-Drum context.

## Newly settled this round

- **Editorial workflow: IN — user-originated.** The system **drafts the item page with automated/drafted results**; admins **edit, augment, then approve → publish**. The feed becomes *corpus-drafted, human-approved*: an editorial workflow layer sits between pipeline and live card. This defines the publish pipeline for every feed item.
- **Q11 artifact source: D) Hybrid, labeled.** Impress-the-Boss artifacts are real output when feasible, sourced/mocked otherwise; every artifact card carries an **origin tag** (real | sourced | illustrative). A was rejected as too expensive, C alone as "fake demo" smell.
- **The Drum: IN.** The 48h countdown return mechanic pitched in round 11 is accepted — live countdown to the next draw on every card + the `/feed` header, styled as the mascot's raffle drum.
- **Rotation status unchanged:** 11 types × 1 item/2 days; the Drum now frames that cadence as an appointment.

## New pitch — "The Digest" (awaiting in/out/parked)

Not a type — the **distribution layer**: a recurring email via utobo (the existing email stack, [[pages/entities/utobo-email-transactional-email-service]]) carrying the latest feed items since last send, ending with the drum countdown. Rationale: homepage cards vanish when someone searches — an inbox is the one place nothing can make them disappear; email turns the 48h cadence into a habit loop for readers who don't return on their own.

## Grill Q12 (asked, unanswered) — what passes the admin gate?

- **A) Everything** — no feed item publishes without admin approval (~15 review sessions/month); quality ceiling is total.
- **B) High-stakes only** — Impress the Boss, Pitches, Two Futures get the gate; data types (Pulse, Tombola, Resurrections, Floor) auto-publish — review judgment calls, not math.
- **C) Gate + deadline** — everything drafts to admin but auto-publishes after 48h if untouched, so the drum never stalls *(assistant lean — cadence survives busy weeks)*.

## Open branches (interview state after round 12)

- **Q12 gate scope** — asked, awaiting A/B/C + The Digest verdict.
- Carried parked: accounts · share expansion · Marginalia · Confessions · Origin card · methodology page detail.
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- The feed needs an **admin approval surface**: item-page draft state, edit/augment UI, approve→publish action (admin console extension).
- Q12 (gate scope) must be answered before the pipeline can be wired — it decides which types bypass the human gate.
- The Drum adds a live countdown component to every card + `/feed` header.
- The Digest, if accepted, rides the existing utobo sending domain — no new email infrastructure.
- No code yet; this record tracks proposal state only.
