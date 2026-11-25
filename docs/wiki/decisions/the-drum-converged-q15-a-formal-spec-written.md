---
type: Decision
title: The Drum converged (Q15-A) — formal spec written at docs/specs/the-drum.md
description: Context
tags: [[feed, the-drum, convergence, spec, brainstorm]]
status: accepted
timestamp: "2026-11-06T19:38:56.880Z"
---

# The Drum converged (Q15-A) — formal spec written at docs/specs/the-drum.md

## Context

The 15-turn Drum brainstorm (feed rounds 1–14, see prior feed-round decisions) ended with a convergence slate locked pending final verdict on Q15. All criteria were served and every major fork had a verdict.

## The verdict

User answered **Q15-A: converged**. The full slate is written up as the formal spec at `docs/specs/the-drum.md`.

Final locked slate (summary):

- **Name:** The Drum; mascot turns the handle; `/feed` canonical route + homepage shows 3 latest cards (vanish on search start)
- **Cadence:** 1 item / 2 days, admin-configurable; fixed round-robin over 11 types; countdown appointment mechanic
- **11 item types:** One Save · Target-User Pitch (synthetic personas) · Two Futures · Ambition Path · The Pulse (20%) · Receipt cards · Resurrections · The Walk · The Tombola (corpus-derived scoring) · The Floor (20%, themes-only) · Impress the Boss (hybrid artifacts + origin tags)
- **Structure:** stream + stack; stacks are the depth surface, The Walk extends them
- **Workflow:** pipeline drafts → inline editor → per-item approval toggles → publish (auto for ungated); The Backlog pre-seeds
- **Trust:** type tags + methodology page; artifact origin tags
- **Sharing:** Receipt cards + Bluesky button (v1); **The Digest** via utobo, dark by default (admin-toggled)
- **Phase 2:** accounts → personalization, Marginalia, Confessions, share expansion

## Consequences

- Next step is the implementation plan (data model, generation pipeline, admin queue, routes).
- Parked items carry forward: Origin card (never verdicted), methodology copy, round-robin canonical order, receipt-card visual spec.
- Brainstorm protocol that produced this: 1 idea + 1 grill question per turn, decision ledger maintained — proven effective for this user.
