---
type: Learning
title: bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo
description: The gotcha
tags: [data-model, architecture-boundary, raindrop, database, debugging]
timestamp: "2026-08-06T08:42:23.876Z"
---

# bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo

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
- The ~338-item gap between Raindrop and the DB is a **persistent filter in the external sync** (it excludes some bookmark types/broken links), **not** a stopped pipeline. Investigate that in whatever repo owns the sync.

## Related surface gotcha

The homepage "2,270 bookmarks" text is **hardcoded** at `src/routes/+page.svelte:141` — it is NOT a live count. The DB actually held 2,446 on the day this was checked. Any count mismatch seen in the UI should be verified against a live `SELECT count(*) FROM te9_dev.bookmarks` before assuming a data problem.

## Relationships

- [[embed-bookmarks-backfill-script]] — the only writer this app owns (embeddings + search_tsv only).
- [[daily-embed-new-bookmarks-workflow]] — runs nightly; green 25–48s runs = nothing new to embed, confirming the sync-then-embed chain is current.
