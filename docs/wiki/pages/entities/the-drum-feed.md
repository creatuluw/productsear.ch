---
type: Entity
title: The Drum feed
description: **The Drum** is the official name (2026-11-06, brainstorm round 14) of productsear.ch's corpus-narrated magazine feed — a machine-drafted, human-gated stream of
tags: [feed, the-drum, listings, editorial-workflow, designed-not-built]
timestamp: "2026-11-06T19:37:36.529Z"
---

# The Drum feed

**The Drum** is the official name (2026-11-06, brainstorm round 14) of productsear.ch's corpus-narrated magazine feed — a machine-drafted, human-gated stream of 11 item types published on a 2-day draw cadence. The mechanic is the masthead: the drum opens every 2 days, the tombola draws from it, and [pages/entities/product-search-mascot-illo-character-pack](./product-search-mascot-illo-character-pack.md) turns the handle; the countdown ("next draw in 31:22:08") is the appointment mechanic.

## What it is

- Lives at `/feed`, linked in the site nav; the homepage center space shows the 3 latest cards, which vanish the moment a search starts.
- Every item is machine-drafted from the [pages/concepts/hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md) corpus and human-gated: draft → inline editor → per-item approval toggle → publish (gate-off items publish automatically).
- Every card links to its listing's stack — the stacks are the depth surface; the stream is the appointment surface.

## The 11 item types (fixed round-robin order)

1. **One Save** — daily anchor
2. **Target-User Pitch** — motivation via synthetic persona voices
3. **Two Futures** — real-life before/after
4. **Ambition Path** — multi-listing route to an ambition
5. **The Pulse** — 20% content: archetype drift, repo obituaries
6. **Receipt cards** — share primitive: claim + proof, server-side rendered, Bluesky share in v1
7. **Resurrections** — forgotten saves, second life
8. **The Walk** — embedding-hop serendipity trail
9. **The Tombola** — draw from the last 10, corpus-derived scoring
10. **The Floor** — 20% content: aggregated search misses, themes only
11. **Impress the Boss** — real artifact output, hybrid + origin tags (real when feasible, sourced/mocked otherwise, always origin-tagged)

## Why it matters

The Drum turns a static search corpus into a narrated, cadenced surface that gives people a reason to return without an account — serving novelty (80% new primitives), emotion, real-life improvement, ambition, tech insight, and a 20% unexpected-data quotient. The Digest (email via [pages/entities/utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md)) extends it off-site, dark by default and admin-activated.

## Details

- **Status**: designed, **not yet implemented** — brainstorm converged (Q15-A, 2026-11-06); formal spec committed at `docs/specs/the-drum.md` — see [The Drum feed spec](../artifacts/the-drum-feed-spec.md) and [decisions/the-drum-converged-q15-a-formal-spec-written-at-docs-specs-t](../../decisions/the-drum-converged-q15-a-formal-spec-written-at-docs-specs-t.md).
- **Planned location**: `/feed` route + homepage 3-latest slot; admin queue/editor inside [pages/entities/admin-console-admin](./admin-console-admin.md).
- **Configuration (admin console owns)**: cadence (1 item / 2 days default), per-item approval toggles, feature toggles (Digest off by default), the queue.
- **Type roster history**: pitched types killed along the way include Ribbon's Diary, Origin card, Same Day Last Year — the roster is closed at 11.

## Relationships

- [pages/entities/admin-console-admin](./admin-console-admin.md) — owns cadence, approvals, toggles, queue; hosts the inline editor
- [pages/entities/utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md) — powers The Digest distribution
- [pages/entities/product-search-mascot-illo-character-pack](./product-search-mascot-illo-character-pack.md) — turns the drum handle; visual identity
- [pages/entities/bookmark-archetype-system](./bookmark-archetype-system.md) — source of archetype-drift signals for The Pulse
- [pages/entities/collections-pages](./compendium-pages.md) — listing stacks that cards deep-link into

## Lifecycle

- First added: 2026-11-06 — corpus-feed brainstorm rounds 1–14 ([decisions/add-a-corpus-narrated-magazine-feed-to-productsear-ch-propos](../../decisions/add-a-corpus-narrated-magazine-feed-to-productsear-ch-propos.md) onward)
- Named: 2026-11-06 — round 14, user chose "The Drum" (Q14 → B)
- Significant changes: same-day rounds settled anatomy (stream + stack), editorial workflow, cadence, round-robin order, The Backlog pre-seeding; implementation not started.
- Significant changes: 2026-11-06 later same day — Q15-A convergence closed the pending verdict; formal spec written at `docs/specs/the-drum.md` ([The Drum feed spec](../artifacts/the-drum-feed-spec.md)); implementation plan is the next step.
