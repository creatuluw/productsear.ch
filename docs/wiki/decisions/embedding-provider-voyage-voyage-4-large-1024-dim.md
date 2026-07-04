---
type: Decision
title: "Embedding provider: Voyage voyage-4-large (1024-dim)"
description: Context
tags: [search, embeddings, voyage, architecture]
status: accepted
supersedes: "["decisions/hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi"]"
timestamp: "2026-07-04T09:57:20.862Z"
---

# Embedding provider: Voyage voyage-4-large (1024-dim)

## Context
The search stack (see [hybrid-semantic-search-stack](../pages/concepts/hybrid-search-via-reciprocal-rank-fusion)) originally specified OpenAI `text-embedding-3-small` (1536-dim). Before this decision it had been reduced to 384-dim. We are now switching to **Voyage AI `voyage-4-large` at 1024 dimensions**.

## Choice
- Embedding model: **Voyage `voyage-4-large`**, **1024 dimensions**, cosine similarity.
- The `bookmark_embeddings` table is dropped and recreated at `vector(1024)` via `scripts/migration-voyage-1024.sql` (HNSW index rebuilt).
- `src/lib/server/embeddings.ts` rewritten to call the Voyage API, passing `input_type=query` at search time and `input_type=document` at backfill time (Voyage's recommended asymmetric encoding).
- `scripts/embed-bookmarks.ts` defaults to `input_type='document'` and model `voyage-4-large`.
- `.env` / `.env.example` carry the Voyage key + new model defaults.
- `src/lib/server/db/index.ts` Drizzle schema dims updated 384 → 1024.
- Full re-embed of all 2,270 bookmarks required after migration (table wiped).

## Alternatives considered
- **Stay on OpenAI 384-dim**: rejected — Voyage `voyage-4-large` benchmarks better on retrieval and the swap was always intended (the parent decision named Voyage/Cohere as swappable).
- **1536-dim OpenAI**: rejected on cost/quality tradeoff vs Voyage.

## Rationale
Voyage `voyage-4-large` gives stronger retrieval quality at 1024-dim; the embed layer was already isolated behind a thin seam (`embeddings.ts` + the backfill script), so the swap touches no search/RAG logic. Asymmetric `input_type` (query vs document) is Voyage's recommended usage and improves ranking.

## Consequences
- Dimension is now a hard-coded contract (1024) across the migration, Drizzle schema, and `embeddings.ts`. Changing it again requires a coordinated drop+recreate + full re-embed.
- The corpus must be fully re-embedded (~2,270 rows, ~700K tokens) before live search returns results.
- See [voyage-free-tier-rate-limit](../learnings/voyage-free-tier-rate-limit-3-rpm-10k-tpm-blocks-bulk-backfi.md) — the backfill is blocked until a Voyage billing method is added or the script self-throttles.

## Source
- `scripts/migration-voyage-1024.sql` — drop+recreate at 1024-dim
- `src/lib/server/embeddings.ts` — Voyage client, input_type, 429 backoff
- `scripts/embed-bookmarks.ts` — backfill with input_type=document
- `src/lib/server/db/index.ts` — schema dims 1024
