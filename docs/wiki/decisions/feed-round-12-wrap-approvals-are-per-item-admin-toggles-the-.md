---
type: Decision
title: "Feed round 12 wrap: approvals are per-item admin toggles; The Digest in as admin-toggled dark launch (off by default); The Backlog pitched (launch pre-draft)"
description: Context
tags: [feed, listings, editorial-workflow, admin-gate, the-digest, the-backlog, dark-launch, default-states, brainstorm, proposed]
status: proposed
supersedes: feed-round-12-editorial-workflow-in-corpus-drafted-admin-app
timestamp: "2026-11-06T19:32:55.391Z"
---

# Feed round 12 wrap: approvals are per-item admin toggles; The Digest in as admin-toggled dark launch (off by default); The Backlog pitched (launch pre-draft)

## Context

Continuation of the corpus-feed brainstorm (2026-11-06), resolving the round-12 grill ([[decisions/feed-round-12-editorial-workflow-in-corpus-drafted-admin-app]]) — the user answered Q12 and gave The Digest verdict, and the assistant pitched round 13.

## Newly settled this turn

- **Q12 gate scope: per-item approvals, set in the admin.** The approval gate is not a global rule or type-class split — it is a **dial per item**: admins set approval on/off for each item in the admin console. Every A/B/C option from round 12 is superseded by this user-originated answer; the review surface is per-item toggles rather than a scope policy.
- **The Digest: IN — with a modified launch shape.** The utobo email distribution layer is accepted, but its **UI, mechanics, and state are all admin-toggled and off by default** — it ships dark, activated from the admin when wanted. This is the first feature with an explicit dark-launch contract.
- **Emerging convention (noted, not yet formalized):** feed subsystems arrive behind admin switches; "which feed features are on vs. dark at launch" was spun out as its own parked ledger branch (default states) to be settled separately.
- **Ledger inventory:** 11 item types + The Drum + The Digest + editorial workflow.

## New pitch — "The Backlog" (awaiting in/out/parked)

A **launch mechanic, not a type**: before the feed goes live, the pipeline pre-drafts the first ~30 items (mixed types, newest corpus data) into the admin approval queue, so day one already shows a lived-in feed — 6+ weeks of rhythm, stacks with items attached, homepage cards populated. Rationale: feeds die of emptiness at birth; the Backlog kills the cold start before it exists.

## Grill Q13 (asked, unanswered) — who orders the stream?

- **A) Fixed round-robin** — types cycle mechanically, no brain.
- **B) Admin-curated queue** — upcoming items in a drag-orderable queue; pipeline auto-fills gaps by rotation *(assistant lean — matches the admin-first pattern: drafts arrive, admin arranges, cadence never stalls)*.
- **C) Ceremony anchors** — fixed weekly slots (Pulse Mondays, Tombola Fridays) + round-robin filler.

## Open branches (interview state after this turn)

- **Q13 stream ordering** — asked, awaiting A/B/C + The Backlog verdict.
- **Default states** — new parked branch: which feed features are on vs. dark at launch.
- Carried parked: accounts · share expansion · Marginalia · Confessions · Origin card (fourth nudge) · methodology detail · rotation calendar.
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- Admin console grows a **per-item approval toggle** (item-level switch, not a type policy) — refines the round-12 approval-surface requirement.
- The Digest ships dark: admin-facing activation switches for UI, mechanics, and send state; no reader-visible surface until enabled.
- The Backlog, if accepted, means the pipeline must draft a bulk initial batch into the approval queue as a launch step, not just steady-state.
- Q13 decides whether the pipeline needs a drag-orderable admin queue (B) or just rotation logic (A/C).
- No code yet; this record tracks proposal state only.
