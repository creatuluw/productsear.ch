---
type: Learning
title: Explicit outer SELECT silently drops columns carried by CTE `scored.*`
description: The gotcha
tags: [postgres, sql, search, debugging]
timestamp: "2026-11-01T00:34:46.657Z"
---

# Explicit outer SELECT silently drops columns carried by CTE `scored.*`

## The gotcha

In `src/lib/server/search.ts`, the pipeline is CTEs: `scored` → `ranked` (`scored.*` + window ranks) → final explicit `SELECT` that **enumerates columns**. When `markdown` was added to `scored` (and inherited by `ranked` via `scored.*`), the outer `SELECT bookmark_id, title, url, …` still listed the *old* columns — so `markdown` was silently dropped and `rerankText()` received no page content. No error, no warning; `r.markdown` was just `undefined`.

Worse, the isolation test "worked": the hand-rolled diagnostic query happened to include `markdown` in its outer SELECT, so hand-run checks disagreed with the app pipeline. Only `SEARCH_DEBUG` instrumentation inside the real `hybridSearch` (`doc len 580` — no markdown) exposed it.

## Rule of thumb

- When adding a column anywhere in a multi-stage SQL pipeline, **grep every explicit SELECT list** between the CTE that introduces it and the consumer — `cte.*` propagation hides the drop.
- Verify pipeline changes **through the real code path** (`hybridSearch` + `SEARCH_DEBUG`), not an equivalent hand-rolled query — the hand-rolled version can differ from production SQL in exactly the way that matters.

## Source

- `src/lib/server/search.ts` — final SELECT now includes `markdown`; comment at `rerankText()` documents the enrichment.
- Found while shipping [[enrich-reranker-input-with-page-content-show-30]].
