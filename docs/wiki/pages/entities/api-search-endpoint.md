---
type: Entity
title: API search endpoint
description: What is it?
tags: [search, api, sveltekit, llms-view]
timestamp: "2026-11-06T00:00:00.000Z"
---

# API search endpoint

## What is it?
`GET /api/search` — the hybrid semantic search endpoint for bookmarks. Fuses pgvector cosine similarity with Postgres `ts_rank` full-text via Reciprocal Rank Fusion in one SQL query, then returns ranked bookmark hits with snippet/analysis context.

## Why it matters
This is the primary read path users hit when searching bookmarks. It is the runtime realization of the [hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md) decision, and — since 2026-11-06 — the endpoint advertised to every LLM at the top of each `?view=llm` document.

## Details
- **Location**: `src/routes/api/search/+server.ts`
- **Interface**: `GET ?q=<query>&page=N` → JSON (default) or markdown.
  - JSON (default): `{ query, tookMs, count, total, page, pageSize, results[] }` with `rerankScore` per result.
  - **Markdown output** (added 2026-11-06): `?format=md` or request header `Accept: text/markdown` → `text/markdown; charset=utf-8`, same rows as [llm-content-negotiation](../concepts/llm-content-negotiation.md) search view minus the full preamble — built by `searchApiMd()` in `src/lib/server/llmview.ts`. No API key, no auth.
- **Query style**: 2–4 word noun phrases ("url to markdown", "ocr pdf"); `total` is the honest count above the relevance floor (0.45).
- **Depends on**: `src/lib/server/search.ts` (pool-then-rerank), `src/lib/server/db/index.ts` (Drizzle/postgres-js), Voyage embeddings + rerank.
- **Configuration**: `VOYAGE_API_KEY` for embedding/reranking.

## Relationships
- [hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md) — the fusion concept it implements.
- [llm-content-negotiation](../concepts/llm-content-negotiation.md) — markdown output mirrors the ?view=llm search format.
- [skill-doc](../../learnings/llm-usage-skill-lives-outside-the-repo-e-skills.md) — usage guide served at `/skill.md` documents this endpoint.

## Lifecycle
- First added: 2026-07-03 (initial project scaffold).
- 2026-11-06: markdown output (`format=md` / `Accept: text/markdown`) + `searchApiMd()` builder; advertised as a try-it-now link in every `?view=llm` preamble (commit fb62e85).
