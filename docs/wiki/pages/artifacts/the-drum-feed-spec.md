---
type: Artifact
title: The Drum feed spec
description: "**The Drum feed spec** — the formal, converged specification for the [The Drum feed](../entities/the-drum-feed.md) entity, committed at `docs/specs/the-drum.md` after the 15-turn diverge/con"
tags: [the-drum, feed, spec, editorial-workflow, designed-not-built]
timestamp: "2026-11-06T19:39:44.066Z"
---

# The Drum feed spec

**The Drum feed spec** — the formal, converged specification for [The Drum feed](../entities/the-drum-feed.md), committed at `docs/specs/the-drum.md` after the 15-turn diverge/converge brainstorm converged (Q15-A, 2026-11-06). It is the build contract the implementation plan will be drafted from.

## What it documents

- [The Drum feed](../entities/the-drum-feed.md) — the full feature: identity, surfaces (`/feed`, homepage 3-latest slot, listing stacks), cadence (1 item / 2 days, admin-configurable), the fixed round-robin over the 11 item types, editorial workflow (draft → inline editor → per-item approval → publish), trust & attribution, sharing (Receipt cards + Bluesky, The Digest dark by default), data model sketch, and parked phase-2 scope
- [the convergence decision](../../decisions/the-drum-converged-q15-a-formal-spec-written-at-docs-specs-t.md) — the convergence decision that closed the Q15 loop and commissioned this spec
- **Format**: Markdown spec, 10 numbered sections plus an original-criteria goal check
- Generated from: the 15-round feed brainstorm; per-round verdicts logged in `docs/wiki/decisions/feed-round-*`

## Key contents

- **§4 — the 11 item types table**: each type's angle and generation source (analysis `who` personas, archetype drift, embedding hops, 300+ day staleness, search misses below the 0.45 relevance floor)
- **§5 — editorial workflow**: pipeline drafts land on the item page; inline editor on every post; per-item approval toggles; ungated items auto-publish; The Backlog pre-seeds the queue
- **§8 — data model sketch**: app-owned `feed_items` (jsonb per-type payload, status, requires_approval, signals provenance) + singleton `feed_settings` (cadence_hours 48, digest_enabled false, type_order) on Postgres `te9_dev`; never writes to the read-only mirror tables
- **§10 — open launch details**: canonical round-robin order, methodology-page copy, default-on vs dark states, Receipt card visual spec (riso/instrument identity, OKLCH tokens only)

## Source

- `docs/specs/the-drum.md` — the spec itself (97 lines, converged status header)
