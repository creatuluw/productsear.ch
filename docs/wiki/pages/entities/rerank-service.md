---
type: Entity
title: Rerank service
description: `src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.
tags: [search, rerank, voyage, server]
timestamp: "2026-07-04T10:54:34.586Z"
---

# Rerank service

`src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.

Re-scores a pool of candidate documents against a query and returns them in relevance order. Used as the second stage of the retrieval pipeline: [hybrid-search-via-reciprocal-rank-fusion](./hybrid-search-via-reciprocal-rank-fusion.md) produces a first-pass ranking, then this reranks the top candidates.

## Details
- **Location**: `src/lib/server/rerank.ts`
- **Interface**: takes `(query, documents[], topK?)`, calls Voyage rerank, returns reordered docs.
- **Configuration**: requires `VOYAGE_API_KEY`.
- **Model**: `rerank-2.5-lite`.

## Relationships
- [api-search-endpoint](./api-search-endpoint.md) — consumes rerank via `src/lib/server/search.ts`.
- [api-ask-endpoint](./api-ask-endpoint.md) — same; the RAG path also benefits.
- [hybrid-search-via-reciprocal-rank-fusion](./hybrid-search-via-reciprocal-rank-fusion.md) — the first-pass retriever whose output this reranks.
- [embedding-provider-voyage-voyage-4-large-1024-dim](./embedding-provider-voyage-voyage-4-large-1024-dim.md) — sibling Voyage dependency (embeddings).

## Lifecycle
- First added: 2026-07-04, as the reranking stage of the [adopt-cross-encoder-reranking-voyage-rerank-25-lite-on-top-of-rrf-hybrid-search](./adopt-cross-encoder-reranking-voyage-rerank-25-lite-on-top-o.md) decision.
