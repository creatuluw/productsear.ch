---
type: Entity
title: Daily embed-new-bookmarks workflow
description: `.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that keeps the corpus enriched nightly. **Since 2026-11-06 it runs the full en
tags: [devops, github-actions, automation, corpus-pipeline]
timestamp: "2026-11-06T10:21:22.226Z"
---

# Daily embed-new-bookmarks workflow

`.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that keeps the corpus enriched nightly. **Since 2026-11-06 it runs the full enrichment chain** (crawl → analyze → archetypes → embed), not just embeddings — see [corpus-enrichment-pipeline-sync-crawl-analyze](./corpus-enrichment-pipeline-sync-crawl-analyze.md) and the [self-containment ADR](../../decisions/product-search-corpus-pipeline-is-self-contained-in-products.md).

## What is it?

The project's only scheduled automation: every night it drains any enrichment gaps so manually-ingested rows (e.g. the 522 GitHub-repo inserts) become searchable without manual runs.

## Details

- **Location**: `.github/workflows/embed-new-bookmarks.yml`
- **Schedule**: `04:17 UTC` daily, plus a manual `workflow_dispatch` ("Run workflow") trigger.
- **What it runs (2026-11-06 →)**: the full chain — `npm run crawl` → `npm run analyze` → archetypes backfill (`backfill-archetypes.ts --missing`) → `npm run embed`. Every stage is idempotent and self-selects only missing/pending rows, so a fully-caught-up night is cheap.
- **Before 2026-11-06**: it ran only `npm run embed` (`scripts/embed-bookmarks.ts`, which builds a `doneSet` of already-embedded IDs and processes only new bookmarks).
- **Concurrency guard**: prevents overlapping runs.
- **Secrets required**: `DATABASE_URL` (Railway Postgres), `VOYAGE_API_KEY`; **optional**: `ZAI_API_KEY` — without it, the analyze stage falls back to the Railway LLM gateway. Sanity-checked before running; step summary posted on completion.
- **Push constraint**: commits touching `.github/workflows/` require the `workflow` scope on the git token.

## Relationships

- [corpus-enrichment-pipeline-sync-crawl-analyze](./corpus-enrichment-pipeline-sync-crawl-analyze.md) — the pipeline this workflow schedules nightly.
- [embed-bookmarks-backfill-script](./embed-bookmarks-backfill-script.md) — the original (and still final) stage: embeddings.
- [embedding-provider-voyage-voyage-4-large-1024-dim](../../decisions/embedding-provider-voyage-voyage-4-large-1024-dim.md) — the embedding API the final stage depends on.

## Lifecycle

- First added: 2026-07-04 — embed-only nightly job.
- 2026-11-06 — extended to the full chain (crawl → analyze → archetypes → embed) when the corpus pipeline was imported into this repo; added optional `ZAI_API_KEY` secret.
