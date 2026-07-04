---
type: Entity
title: Daily embed-new-bookmarks workflow
description: "`.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that runs the [[embed-bookmarks-backfill-script]] nightly to embed only newly-"
tags: [devops, github-actions, embeddings, automation]
timestamp: "2026-07-04T10:54:34.586Z"
---

# Daily embed-new-bookmarks workflow

`.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that runs the [embed-bookmarks-backfill-script](./embed-bookmarks-backfill-script.md) nightly to embed only newly-added bookmarks.

## Details
- **Location**: `.github/workflows/embed-new-bookmarks.yml`
- **Schedule**: `04:17 UTC` daily, plus a manual `workflow_dispatch` ("Run workflow") trigger.
- **What it runs**: `npm run embed` (i.e. `npx tsx scripts/embed-bookmarks.ts`). The script is already idempotent — it builds a `doneSet` of already-embedded IDs and **only processes new bookmarks**, so each nightly run is cheap and resumable.
- **Concurrency guard**: prevents overlapping runs.
- **Secrets required**: `DATABASE_URL` (Railway Postgres), `VOYAGE_API_KEY`. Sanity-checked before running; step summary posted on completion.

## Relationships
- [embed-bookmarks-backfill-script](./embed-bookmarks-backfill-script.md) — the script this workflow invokes.
- [embedding-provider-voyage-voyage-4-large-1024-dim](./embedding-provider-voyage-voyage-4-large-1024-dim.md) — the embedding API it depends on.

## Lifecycle
- First added: 2026-07-04, to keep the corpus embedded as new bookmarks are added without manual backfill runs.
