---
type: Entity
title: Search diagnostics
description: "Search-quality diagnostic tooling shipped with the 2026-11-01 rerank fix: a trace script for the retrieval stages, a debug env flag for the rerank stage, and a "
tags: [search, debugging, diagnostics, tooling]
timestamp: "2026-11-01T00:35:00.778Z"
---

# Search diagnostics

Search-quality diagnostic tooling shipped with the 2026-11-01 rerank fix: a trace script for the retrieval stages, a debug env flag for the rerank stage, and a one-shot end-to-end verifier. Built while diagnosing the MotionClone miss; kept as permanent tools.

## Details

- **`scripts/diagnose-query.ts`** — `npx tsx scripts/diagnose-query.ts "<query>" ["<url-substring>"]`. Traces one query through the retrieval stages: prints the target's vec rank, text rank, RRF rank (vs pool cutoff 50), top-12 by RRF, and — if the target is past the pool — its text-rank/vec neighbours to explain why. Standalone `postgres` client (`max: 1`), ends with `sql.end()`.
- **`SEARCH_DEBUG=<url-substring>`** — env flag inside `src/lib/server/search.ts`. When set, `hybridSearch` logs to stderr the target's pool index, rerank doc length + head (catches "column silently missing from doc text"), and the first 5 rerank order entries.
- **`scripts/verify-search.ts`** — runs the real `hybridSearch("i am looking for a tool that lets me process videos and edit them after", 30)`, prints latency, result count, top-8, and `#N` for the MotionClone target (`STILL MISSING` if absent). Ends with `process.exit(0)` — the Drizzle/postgres-js pool keeps the event loop alive otherwise.

## Why it matters

Makes "why didn't search find X" a 2-minute answer instead of an archaeology dig. See [diagnose-search-misses-stage-by-step-before-tuning](../../rules/diagnose-search-misses-stage-by-stage-before.md) for the workflow.

## Relationships

- [api-search-endpoint](./api-search-endpoint.md) — the endpoint these tools debug.
- [enrich-reranker-input-with-page-content-show-30](../../decisions/enrich-reranker-input-with-page-content-show-30.md) — the fix that produced them.
- [rerank-service](./rerank-service.md) — the stage `SEARCH_DEBUG` traces.

## Lifecycle

- First added: 2026-11-01, during the MotionClone rerank-miss diagnosis (commit `decb723`).
