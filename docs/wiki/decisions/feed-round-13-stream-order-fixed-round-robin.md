---
type: Decision
title: "Feed round 13: stream order fixed round-robin; The Backlog in (draw-time drafts + auto-publish); inline editor on all posts; accounts = phase 2; Same Day Last Year pitched (type #12)"
description: Context
tags: [[feed, listings, stream-order, round-robin, the-backlog, inline-editor, accounts, editorial-workflow, same-day-last-year, brainstorm, proposed]]
status: proposed
supersedes: feed-round-12-wrap-approvals-are-per-item-admin-toggles-the-
timestamp: "2026-11-06T19:35:36.941Z"
---

# Feed round 13: stream order fixed round-robin; The Backlog in (draw-time drafts + auto-publish); inline editor on all posts; accounts = phase 2; Same Day Last Year pitched (type #12)

## Context

Continuation of the corpus-feed brainstorm (2026-11-06), resolving the round-12-wrap grill ([[decisions/feed-round-12-wrap-approvals-are-per-item-admin-toggles-the-]]) — the user answered Q13 (A), gave The Backlog verdict, and added a workflow requirement (inline editor).

## Newly settled this turn

- **Q13 stream order: A) fixed round-robin.** Types cycle mechanically through the stream — no admin drag-queue (B rejected), no ceremony anchor slots (C rejected).
- **The Backlog: IN — evolved from the round-12 launch pitch into an ongoing mechanic.** Drafts are generated per type **as draws come up** (the launch pre-draft folds into this), and items whose approval gate is off **publish automatically**. The pipeline now has a no-gate auto-publish path, not just an everything-queues path.
- **Inline editor on every post.** Admins edit/add to a post in place before approve/publish. The editorial workflow is now complete: draft → inline edit → approve (or auto) → live.
- **Accounts = phase 2.** Inferred from the user's earlier statement that personalization comes "if people have an account later"; the assistant marked it and offered an objection window. **Marginalia + Confessions park with accounts** (they need user-authored content).
- **Ledger inventory:** 11 item types + The Drum + The Digest + The Backlog + editorial workflow.

## New pitch — "Same Day Last Year" (type #12, awaiting in/out/parked)

The timestamp ritual: *"One year ago today, this got saved. Here's what happened since."* Nostalgia register — the counterpoint to Resurrections' guilt: it shows time doing its work rather than shaming the user. Zero generation cost (a date query plus a draft) and the corpus guarantees inventory every single day.

## Grill Q14 (asked, unanswered) — what is this thing called?

Converging identity fork (the last one):

- **A) The Feed** — plain, functional
- **B) The Drum** — the mechanic becomes the brand: the drum opens every 2 days, the tombola draws from it, the mascot turns the handle *(assistant lean — poetic, ownable, ties cadence + draw + mascot into one word)*
- **C) Listings Feed** — descriptive, SEO-safe, boring
- **D) Your own name**

## Open branches (interview state after this turn)

- **Q14 naming fork** — asked, awaiting A/B/C/D + the Same Day Last Year verdict.
- Parked carried: share expansion · Origin card (fourth nudge) · methodology detail · default states · accounts (→ phase 2, with Marginalia + Confessions).
- Interview format per [[rules/interview-questions-ship-with-lettered-options-plus-a-procee]]; pacing per [[rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc]].

## Consequences if adopted

- The pipeline builds a per-type draft generator scheduled by the draw cadence (1 item/2 days, admin-configurable per round 9), with an auto-publish path for gate-off items — extends the round-12 per-item approval toggles.
- The admin console needs an inline editor on every post card (edit/add content before approval).
- Stream rendering is deterministic rotation over the types; no admin ordering queue.
- Marginalia + Confessions stay unbuildable until accounts ship (phase 2).
- No code yet; this record tracks proposal state only.
