---
type: Entity
title: API search endpoint
description: What is it?
tags: [search, api, sveltekit]
timestamp: "2026-07-03T14:42:17.796Z"
---

# API search endpoint

## What is it?
`GET /api/search` — the hybrid semantic search endpoint for bookmarks. Fuses pgvector cosine similarity with Postgres `ts_rank` full-text via Reciprocal Rank Fusion in one SQL query, then returns ranked bookmark hits with snippet/analysis context.

[Concrete thing — the SvelteKit `+server.ts` route.]

## Why it matters
This is the primary read path users hit when searching bookmarks. It is the runtime realization of the [hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi](./hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi.md) decision.

## Details
- **Location**: `src/routes/api/search/+server.ts`
- **Interface**: `GET ?q=<query>` → JSON list of ranked bookmark results.
- **Depends on**: `src/lib/server/search.ts` (RRF query), `src/lib/server/db/index.ts` (Drizzle/postgres-js), OpenAI embeddings client.
- **Configuration**: requires `OPENAI_API_KEY` to embed the query; without it, returns a clear "OPENAI_API_KEY is not set" error (wiring verified end-to-end, live run gated on a key).

## Relationships
- [hybrid-search-via-reciprocal-rank-fusion](./hybrid-search-via-reciprocal-rank-fusion.md) — the fusion concept it implements.
- [api-ask-endpoint](./api-ask-endpoint.md) — sibling RAG endpoint that reuses the same search.
- [postgres-js-db-execute-returns-rows-directly-not-rows](./postgres-js-db-execute-returns-rows-directly-not-rows.md) — gotcha fixed in this file.

## Lifecycle
- First added: 2026-07-03 (initial project scaffold).
