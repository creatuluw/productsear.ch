---
type: Rule
title: Pool-then-rerank with graceful fallback for retrieval
description: Guideline
tags: [search, rerank, resilience, architecture]
timestamp: "2026-07-04T10:54:34.585Z"
---

# Pool-then-rerank with graceful fallback for retrieval

## Guideline

When adding a cross-encoder (e.g. Voyage `rerank-2.5-lite`) on top of a cheap first-pass retriever (RRF / vector / FTS):

- **Fetch a candidate pool** larger than the final limit (we use **50 → top `limit`**). Reranking is wasted on docs the retriever never surfaced; give the cross-encoder enough candidates to reorder.
- **Cap the pool** to bound rerank latency/cost — 50 is our working ceiling.
- **Treat the reranker as non-critical.** Wrap it so that if the rerank API errors/times out, you fall back to first-pass order and still return results. Search degrades to RRF, never breaks.

## When it applies

Any two-stage retrieval pipeline (bi-encoder retrieve → cross-encoder rerank) in this project — currently `src/lib/server/search.ts`, serving [[api-search-endpoint]] and [[api-ask-endpoint]].

## Rationale

A cross-encoder only helps if it sees a real candidate set, and a pool too small starves it. But the rerank call is an external dependency; making it mandatory means one outage blanks search. The fallback keeps the read path always-available.
