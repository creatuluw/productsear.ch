---
type: Learning
title: Raindrop→DB sync runs outside this repo; published page count sums all collections
description: "**Architecture:** The `te9_dev.bookmarks` table (and `bookmark_content`, `bookmark_analysis`) is a **read-only mirror populated by an EXTERNAL Raindrop-sync pro"
tags: [raindrop, sync, data-pipeline, bookmarks, gotcha]
timestamp: "2026-08-06T08:55:24.700Z"
---

# Raindrop→DB sync runs outside this repo; published page count sums all collections

**Architecture:** The `te9_dev.bookmarks` table (and `bookmark_content`, `bookmark_analysis`) is a **read-only mirror populated by an EXTERNAL Raindrop-sync process that does NOT live in this repository.** `src/lib/server/db/index.ts:28` literally calls them "read-only mirrors of the existing Raindrop-synced schema." This app only **reads** them and **adds** embeddings (`bookmark_embeddings`). There is no Raindrop fetch/sync code here — `rg -i raindrop` matches only `README.md` and the db schema column names (`raindrop_id`, `raindrop_created_at`, `raindrop_updated_at`, `synced_at`).

**The sync IS healthy and current.** Live check (2026-08-06): `max(synced_at) = 2026-08-06 06:33 UTC` — it re-synced 2,442 rows that same day. The daily `Embed new bookmarks` GitHub Action is also green daily (25–48s runs = nothing new to embed, since DB stays fully embedded; embedding gap = 0).

**The "2,270 vs 2,784" scare is a collection-scope mismatch, not a sync bug.** The published page `https://creatuluw.raindrop.page/link-drop-34657545` shows a headline of `2784 bookmarks`, but that number is the **grand total across ALL of creatuluw's published collections** (~20 sub-collections: 38, 31, 27, 26, 25…). The LinkDrop collection's own `data.collection.count` in the page's JSON island is **2,454**. The DB mirrors only LinkDrop → holds **2,446**. So the real delta is **~8 bookmarks**, not 338. Those ~8 are most likely drops added after the 06:33 UTC sync (they'll flow in on the next run).

**The app homepage previously showed a hardcoded "2,270"** (`src/routes/+page.svelte`). This is now live via `src/routes/+page.server.ts` (`count(*) FROM te9_dev.bookmarks`) → renders the real 2,446.

**To diff the exact missing raindrop_ids:** the Raindrop REST API (`api.raindrop.io/rest/v1/raindrops/{collectionId}`) returns **401 without an owner test-token**, and the published page lazy-loads items at `perpage:30` with no public JSON endpoint (probed 4 candidates, all 404). So a precise id-diff needs a `RAINDROP_TOKEN` in env, then: pull collection 34657545 ids, diff against `SELECT raindrop_id FROM te9_dev.bookmarks`.
