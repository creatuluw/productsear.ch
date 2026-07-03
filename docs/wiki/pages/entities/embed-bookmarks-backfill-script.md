---
type: Entity
title: Embed-bookmarks backfill script
description: What is it?
tags: [embeddings, script, backfill]
timestamp: "2026-07-03T14:42:17.796Z"
---

# Embed-bookmarks backfill script

## What is it?
`scripts/embed-bookmarks.ts` — a resumable, batched script that joins bookmarks + content + bookmark_analysis into one searchable text blob per bookmark, embeds it via OpenAI `text-embedding-3-small` (1536-dim), and upserts into the `bookmark_embeddings` table.

## Why it matters
Hybrid search needs pre-computed embeddings for the corpus. This script is the one-time (and re-runnable) backfill that populates them. Dry-run verified: 2,270 bookmarks → 23 batches; estimated ~$0.02 and ~1 min.

## Details
- **Location**: `scripts/embed-bookmarks.ts`; migration at `scripts/migration.sql`; runner at `scripts/migrate.ts`.
- **Interface**: `npx tsx scripts/embed-bookmarks.ts [--dry-run]`. npm script: `npm run embed`.
- **Batching**: resumable across batches; safe to re-run.
- **Configuration**: requires `OPENAI_API_KEY` in `.env` (gitignored).

## Relationships
- [hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi](./hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi.md) — produces the vectors the search stack queries.
- [env-dynamic-private-breaks-under-plain-tsx-use-process-env-i](./env-dynamic-private-breaks-under-plain-tsx-use-process-env-i.md) — reason server modules use `process.env` not `$env/dynamic/private`.

## Lifecycle
- First added: 2026-07-03 (initial project scaffold).
