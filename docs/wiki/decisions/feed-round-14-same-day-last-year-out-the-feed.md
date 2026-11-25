---
type: Decision
title: "Feed round 14: Same Day Last Year out; the feed is named The Drum; convergence slate locked pending final verdict (Q15)"
description: Context
tags: [feed, the-drum, naming, same-day-last-year, convergence-slate, brainstorm, proposed]
status: proposed
supersedes: feed-round-13-stream-order-fixed-round-robin-the-backlog-in-
timestamp: "2026-11-06T19:37:30.055Z"
---

# Feed round 14: Same Day Last Year out; the feed is named The Drum; convergence slate locked pending final verdict (Q15)

## Context

Continuation of the corpus-feed brainstorm (2026-11-06), resolving the round-13 grill ([[decisions/feed-round-13-stream-order-fixed-round-robin-the-backlog-in-]]) — the user answered **Q14: B) The Drum** and gave the **Same Day Last Year** pitch verdict.

## Newly settled this turn

- **Same Day Last Year: OUT** — the type-#12 pitch is rejected outright (not parked). Every major fork and every pitched type now has a final verdict; the type roster is closed at **11 item types**.
- **The name lands: The Drum** (Q14 → B). The mechanic becomes the brand — "the mechanic is the masthead": the drum opens every 2 days, the tombola draws from it, the mascot turns the handle. The feature is no longer "the corpus feed"; its identity is **The Drum**.

## The convergence slate (locked as the working spec, pending final verdict)

- **Identity & placement**: lives at `/feed`, linked in nav; homepage center space shows the 3 latest cards, which vanish the moment a search starts. The mascot turns the drum handle; the countdown ("next draw in 31:22:08") is the appointment mechanic.
- **Cadence & ordering**: 1 item every 2 days, admin-configurable (round 9); fixed round-robin across the 11 types (round 13); The Backlog pre-seeds drafts so day one is lived-in; items with the approval gate off publish automatically.
- **The 11 item types** (all machine-drafted, human-gated): One Save · Target-User Pitch · Two Futures · Ambition Path · The Pulse (20% archetype drift/repo obituaries) · Receipt cards (share primitive: claim + proof) · Resurrections · The Walk (embedding-hop trail) · The Tombola (draw from last 10) · The Floor (20% aggregated search misses) · Impress the Boss (real artifact output, hybrid + origin tags).
- **Structure & workflow**: stream + stack (every card links to its listing's stack — the depth surface); draft → inline editor → per-item approval toggle → publish; Impress-the-Boss artifacts real when feasible, sourced/mocked otherwise, always origin-tagged; trust via type tags + one "how this Drum works" methodology page.
- **Distribution & sharing**: Receipt cards render server-side; Bluesky share button in v1 (round 6); The Digest email via [[pages/entities/utobo-email-transactional-email-service]] — dark by default, admin-activated.
- **Admin console owns**: cadence, per-item approvals, feature toggles (Digest off by default), the queue — see [[pages/entities/admin-console-admin]].
- **Phase 2 (parked)**: accounts → rotation personalization, Marginalia, Confessions, share expansion.
- **Criteria scorecard**: 80% novel primitives ✓ · sharing designed-in ✓ · emotion/real-life/improvement/ambition rotation ✓ · tech insights ✓ · 20% unexpected data content ✓.

## Grill Q15 (asked, unanswered) — final verdict

- **A) Converged** — write the formal spec, then an implementation plan
- **B) One more diverge round** — throw a new angle at it
- **C) Tweaks** — name what moves

## Open branches (interview state after this turn)

- **Q15 final verdict** — asked, awaiting A/B/C. Nothing is implementation-committed until it lands.
- Parked carried: share expansion · Origin card · methodology detail · default states · accounts (→ phase 2, with Marginalia + Confessions).
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-proceed]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branch]].

## Consequences if adopted

- The feature spec is consolidated on [[pages/entities/the-drum-feed]]; implementation planning starts from it on verdict A.
- No code yet; this record tracks proposal state only.
