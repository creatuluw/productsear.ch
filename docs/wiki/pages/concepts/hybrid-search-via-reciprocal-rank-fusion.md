---
type: Concept
title: Hybrid search via Reciprocal Rank Fusion
description: What is it?
tags: [search, rag, concept]
timestamp: "2026-07-03T14:42:17.795Z"
---

# Hybrid search via Reciprocal Rank Fusion

## What is it?
Hybrid search combines semantic (vector cosine similarity) and keyword (`tsvector` full-text) ranking into one result list. **Reciprocal Rank Fusion (RRF)** fuses the two ranked lists by scoring each result as `Σ 1/(k + rank_i)` across both rankers — no score normalization needed, just ranks.

## Why does it matter?
Semantic and keyword signals catch different queries. Normalizing cosine distance and `ts_rank` into a comparable scale is fiddly and provider-dependent. RRF sidesteps normalization entirely: it only cares about each result's *rank* in each list, so it fuses cleanly in a single SQL query.

## Key rules / properties
- Only ranks matter, not raw scores — robust to different score distributions.
- `k` (constant, typically 60) dampens the contribution of top ranks; tunable but rarely needs tuning.
- Both rankers must cover comparable content ground — here both operate on one shared searchable text blob.

## Relationships
- [hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi](./hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi.md) — the decision that chose RRF.
- [api-search-endpoint](./api-search-endpoint.md) — implements RRF over pgvector cosine + `ts_rank`.

## Source
- `src/lib/server/search.ts` — the single fused SQL query
