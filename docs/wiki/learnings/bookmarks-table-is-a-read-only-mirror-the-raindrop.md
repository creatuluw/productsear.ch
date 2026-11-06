---
type: Learning
title: bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo
description: The gotcha
tags: [data-model, architecture-boundary, raindrop, database, debugging]
timestamp: "2026-08-06T08:42:23.876Z"
---

# bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo

> **Update 2026-11-06:** the Raindrop→DB sync now ALSO lives in this repo — `scripts/sync-raindrop.js` (`npm run sync`) was imported from `E:\te9.dev` when the corpus pipeline became self-contained (see the [self-containment ADR](../decisions/product-search-corpus-pipeline-is-self-contained-in-products.md) and [[corpus-enrichment-pipeline-sync-crawl-analyze]]). The sync is **upsert-only** (`ON CONFLICT (raindrop_id) DO UPDATE` — it never deletes), so manual negative-id rows survive syncs. te9.dev's copy keeps running; both are idempotent upserts against the same tables. The "no sync code in this repo" statements below are historical (pre-import).

## The gotcha

`te9_dev.bookmarks` (and the sibling source tables `bookmark_content`, `bookmark_analysis`) are **read-only mirrors** of an external Raindrop-synced schema. This repo does **not** contain any Raindrop→DB sync code — it only **reads + embeds** rows that another system populates.

`src/lib/server/db/index.ts:20` documents this explicitly:
> "The three source tables (bookmarks, bookmark_content, bookmark_analysis) are READ-ONLY to this app — we never mutate them... Source tables (read-only mirrors of the existing Raindrop-synced schema)."

The only thing this app *writes* is `bookmark_embeddings` (plus the denormalized `search_tsv`), owned by the [[embed-bookmarks-backfill-script]].

## Why this matters

If a future session asks "where is the Raindrop sync?" or "why don't DB counts match the Raindrop collection?", grepping this repo for `raindrop sync` will find **nothing actionable**. That is expected, not a bug — the sync job lives in another repo/service. Don't go building one here to "fix" a count gap.

## Evidence (live DB check, 2026-08-06)

- `bookmarks.synced_at` last updated **2026-08-06 06:33 UTC** (same day) — full re-sync of 2,442 rows ran today → **the external sync IS healthy and current**.
- `raindrop_updated_at` last = 2026-08-05.
- Raindrop collection `link-drop-34657545` shows **2,784** items; DB has **2,446**; embeddings cover **all 2,446** (0 gap).
- The **"338-item gap" is a collection-scope mismatch, NOT a sync filter.** The Raindrop published-page headline (2,784) sums **all** of creatuluw's ~20 published collections; this app mirrors only the **LinkDrop** collection (2,454 per its own `data.collection.count`), and the DB holds 2,446 — so the true per-collection delta is **~8**, not 338. See [[raindrop-db-sync-runs-outside-this-repo-published]] for the authoritative breakdown. *(An earlier hypothesis called this a "persistent filter in the external sync" — that was wrong.)*

## Homepage count (now live — 2026-08-06)

The homepage bookmark count is now **live, not hardcoded**: `src/routes/+page.server.ts` runs `SELECT count(*) FROM te9_dev.bookmarks` in its `load` function and `src/routes/+page.svelte` renders `data.bookmarkCount.toLocaleString()`. The old hardcoded "2,270" string has been removed. So a UI count mismatch is no longer a stale-string problem — only suspect the DB itself if the number looks wrong. *(Previously this section warned the count was hardcoded; that is no longer true.)*

## Relationships

- [[embed-bookmarks-backfill-script]] — the only writer this app owns (embeddings + search_tsv only).
- [[daily-embed-new-bookmarks-workflow]] — runs nightly; green 25–48s runs = nothing new to embed, confirming the sync-then-embed chain is current.
- [[raindrop-db-sync-runs-outside-this-repo-published]] — authoritative source for the sync-health check and the published-page scope-mismatch breakdown; supersedes the stale count-gap reading in this note.
