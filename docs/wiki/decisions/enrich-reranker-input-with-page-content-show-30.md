---
type: Decision
title: Enrich reranker input with page content; show 30 results
description: Context
tags: [search, rerank, retrieval, voyage]
status: accepted
timestamp: "2026-11-01T00:34:31.954Z"
---

# Enrich reranker input with page content; show 30 results

## Context

A user searched `"i am looking for a tool that lets me process videos and edit them after"` and expected MotionClone (a video-editing tool bookmark) in the results — it wasn't even listed. Stage-by-stage diagnosis showed:

- Retrieval was **fine**: MotionClone made the RRF pool at #35/50 (vec #44, text #33).
- The **cross-encoder reranker dropped it**: score 0.641 → rerank #32, cut at `limit=20`.

Root cause: the reranker only saw `title · purpose · excerpt · tags` — metadata. The actual signal ("rebuild a video as an *editable* project, export MP4") lives in the page body, which the **embedder sees but the reranker didn't**. So a doc could be found by the vector side yet under-scored by the rerank side.

## Decision

1. **Enrich the rerank doc text with page content**: `rerankText()` in `src/lib/server/search.ts` now appends the first ~1200 chars of `bookmark_content.markdown` (via `LEFT JOIN te9_dev.bookmark_content`). Rerank runs over the **raw DB rows** (which carry `markdown`), not the mapped `SearchResult` API payload — the payload deliberately stays lean (no markdown shipped to the client).
2. **Show 30 results instead of 20**: `limit` raised 20 → 30 at the call sites (UI passes 30). Pool stays at **50**; rerank `top_k` = `limit`, and cost scales with pool size, so the API cost is unchanged.

Measured: MotionClone moved rerank #32 → **#20-21**, stable across 4 runs (~1s end-to-end latency, slightly up due to longer rerank docs). A/B on the UI's example queries showed no regression (same #1s, minor top-5 shuffles).

## Alternatives considered and rejected

- **Bigger pool (50 → 100)**: no help — slightly *worse*, more competition for the cross-encoder. Pool stays 50.
- **Conversational-query trimming** (stripping filler like "i am looking for a tool that…"): no measurable effect on ranks.
- **Shipping markdown in `SearchResult`**: rejected — bloats the API payload for no reason; rerank reads from raw rows instead.

## Consequences

- Reranker and embedder now see the same evidence, at least up to 1200 chars.
- A corpus genuinely dense in a topic (20+ strong video tools) can still push any single item to the edge — the wider 30-result band absorbs that.
- Rerank scores cluster tightly; expect ±2 rank variance run-to-run ([[voyage-rerank-2-5-lite-has-run-to-run-rank-variance]]).
- Extends (does not replace) [[adopt-cross-encoder-reranking-voyage-rerank-2-5]]; the pool-then-rerank-fallback shape is unchanged ([[pool-then-rerank-with-graceful-fallback-for]]).
- Committed as `decb723`.
