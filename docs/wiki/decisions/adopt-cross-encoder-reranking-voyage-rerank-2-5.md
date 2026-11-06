---
type: Decision
title: Adopt cross-encoder reranking (Voyage rerank-2.5-lite) on top of RRF hybrid search
description: Context
tags: [search, rerank, voyage, architecture, rag]
status: accepted
timestamp: "2026-07-04T10:54:34.585Z"
---

# Adopt cross-encoder reranking (Voyage rerank-2.5-lite) on top of RRF hybrid search

## Context

Hybrid search already fused pgvector cosine similarity + Postgres `ts_rank` FTS via Reciprocal Rank Fusion (see [[hybrid-search-via-reciprocal-rank-fusion]]). RRF does good first-pass retrieval but still surfaces keyword-match noise over genuinely-on-topic docs (e.g. a LinkedIn post / tweet ranked at #3/#5 for "tools to build a SaaS quickly" because of keyword overlap, not semantic relevance).

## Choice

Add a **cross-encoder reranking stage**: after RRF retrieves a pool of candidate docs, a Voyage `rerank-2.5-lite` cross-encoder re-scores them and we return the top `limit`. Implemented in `src/lib/server/rerank.ts`, wired into `src/lib/server/search.ts` so both [[api-search-endpoint]] and [[api-ask-endpoint]] benefit.

## Alternatives considered

- **Larger RRF `k` / different fusion weights** — tuning fusion alone still ranks on lexical+vector overlap, doesn't model query-doc interaction. Cheap but doesn't fix the semantic-relevance gap.
- **Bigger embedding model** — already moved to Voyage voyage-4-large 1024-dim. Bi-encoder embeddings cap out on this axis; a cross-encoder is the complementary step.
- **LLM-based reranking** — slower and costlier per query than a dedicated rerank API.

## Rationale

A cross-encoder scores the query and each candidate *together*, so it captures relevance a bi-encoder can't. Verified live: for "tools to build a SaaS quickly", reranking promoted *"How I Build about 60% of My App's Codebase in a day"* to #1 — a doc RRF had ranked lower but is the most semantically on-topic — while demoting the keyword-noise hits. Exactly the behaviour a cross-encoder is supposed to deliver.

## Consequences

- **Latency**: one extra API call per query (Voyage rerank). Pool is capped at 50 candidates to bound it.
- **Resilience**: rerank is non-critical — if the Voyage rerank call fails, `search.ts` falls back to plain RRF order. Search degrades gracefully, never breaks.
- **Cost**: small per-query rerank call; acceptable for a search/RAG workload.
- **Content cap raised** as a follow-on: `bookmark-text.ts` 1500 → 6000 chars (the 1500 cap only existed for MiniLM's 512-token limit; Voyage voyage-4-large takes 32k). Re-embedded all 2,277 bookmarks.
