---
type: Learning
title: Feed surfaces link synthetic negative-id listings — public listing routes must accept any integer id
description: "**The coupling (found 2026-11-10, fixed in commit `e4ecd86`):** feed surfaces link `/listings/{id}` for their drawn items — Drum cards and The Walk — and 522 co"
tags: [synthetic-ids, listings, routing, feed, og-images]
timestamp: "2026-11-10T11:43:26.026Z"
---

# Feed surfaces link synthetic negative-id listings — public listing routes must accept any integer id

**The coupling (found 2026-11-10, fixed in commit `e4ecd86`):** feed surfaces link `/listings/{id}` for their drawn items — Drum cards and The Walk — and 522 corpus rows use **negative synthetic ids** (the [[learnings/negative-synthetic-ids-for-manual-bookmarks-table-inserts-ne]] convention). The public listing route (`src/routes/listings/[id]/+page.server.ts`) and the OG card endpoint (`src/routes/api/feed/og/listing/[id]/+server.ts`) carried a stale **positive-id-only gate**, so every synthetic listing returned 404 — meaning any synthetic item drawn to The Drum would have served visitors a dead link.

**Fix:** both routes now validate only the numeric shape of the id and accept any integer. The OG endpoint's fail-soft path is unchanged — it 404s naturally when no card exists for the id.

**Implication:** never re-introduce an id-sign or positive-only gate on public listing surfaces; synthetic ids are first-class corpus content. Verified with `/listings/-520` → 200 with its title (salmanulharis/optic-editor) and `/listings/1` still 200.
