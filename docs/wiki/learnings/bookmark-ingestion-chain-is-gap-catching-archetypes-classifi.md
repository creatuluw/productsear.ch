---
type: Learning
title: Bookmark ingestion chain is gap-catching; archetypes classifier lives at src/lib/archetypes.ts
description: Discovered 2026-11-06 while processing the 522 synthetic repo rows end-to-end.
tags: [ingestion, embeddings, archetypes, database, scripts]
timestamp: "2026-11-06T09:23:28.981Z"
---

# Bookmark ingestion chain is gap-catching; archetypes classifier lives at src/lib/archetypes.ts

Discovered 2026-11-06 while processing the 522 synthetic repo rows end-to-end.

**The ingestion chain after a manual insert (order matters):**

1. `npm run embed` (embed-bookmarks.ts) — **gap-catching**: it embeds *any* bookmark lacking a `bookmark_embeddings` row, not just new ones. Run for the 522 new rows, it also caught up 12 legacy bookmarks that had silently slipped through. Negative ids sort first, so freshly inserted synthetic rows are processed immediately.
2. `backfill-archetypes.ts --missing` — also **gap-catching**: classifies every row lacking a `bookmark_archetypes` entry. Same run caught up 74 previously-unclassified rows. Needed for the compendium surface.
3. `bookmark_content` / `bookmark_analysis` are **external** (crawler/analyzer pipelines outside this repo) — new rows lack them until those pipelines pick the rows up; search/rerank degrade gracefully (LEFT JOINs tolerate absence).

**Gotcha fixed en route:** `scripts/backfill-archetypes.ts` had a stale import — it pointed at `src/lib/server/archetypes`, but the classifier module actually lives at **`src/lib/archetypes.ts`** (shared, not server-only). The import was corrected so the script runs. Don't assume classifier/backfill modules follow the `lib/server/` layout.
