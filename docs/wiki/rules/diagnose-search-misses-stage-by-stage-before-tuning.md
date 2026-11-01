---
type: Rule
title: Diagnose search misses stage-by-stage before tuning
description: Guideline
tags: [search, debugging, retrieval, rerank]
timestamp: "2026-11-01T00:34:38.325Z"
---

# Diagnose search misses stage-by-stage before tuning

## Guideline

When a search result is "missing" or ranked wrong, **do not tune retrieval knobs first**. Trace the exact query + target through every stage and fix the stage that actually drops it:

1. **Corpus** — does the target exist, with an embedding and content? (`bookmark_embeddings`, `bookmark_content`)
2. **Vector rank** — cosine distance of the target for this query.
3. **Text rank** — `ts_rank` position.
4. **RRF pool** — fused rank vs the pool cutoff (`RERANK_POOL = 50`).
5. **Rerank cut** — cross-encoder score and position vs `limit`.

Only then change code — and A/B the change against the old behavior on existing example queries before shipping.

## Tools (use them)

- `npx tsx scripts/diagnose-query.ts "<query>" "<url-substring>"` — traces stages 1–4 (prints vec rank, text rank, RRF rank, pool cutoff, neighbours).
- `SEARCH_DEBUG=<url-substring> npm run dev` — prints, inside the live `hybridSearch`, the target's rerank doc length/head and the rerank order (stages 4–5). See [[search-diagnostics]].
- `scripts/verify-search.ts` — quick end-to-end check that a known query returns a known target.

## When it applies

Any "why didn't search find X" investigation on productsear.ch's retrieval pipeline ([[api-search-endpoint]], `src/lib/server/search.ts`).

## Rationale

Measured on 2026-11-01 (MotionClone miss): the failure *looked* like retrieval but retrieval was fine (pool #35/50) — the **reranker** cut it (#32 vs limit 20) because it saw only metadata while the signal lived in page content. Tuning the retriever would have fixed nothing. Also: rerank scores cluster tightly ([[voyage-rerank-2-5-lite-has-run-to-run-rank-variance]]), so single-run rank comparisons mislead — rerun before concluding.
