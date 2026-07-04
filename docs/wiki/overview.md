---
type: System Overview
title: Overview
description: What this project contains and its structure.
timestamp: "2026-07-04T00:00:00.000Z"
---

# Overview

**productsear.ch** is a semantic bookmark search application. Users search a corpus of bookmarks using natural language; the app returns relevant bookmarks via **hybrid search** (pgvector cosine similarity over embeddings fused with PostgreSQL full-text `ts_rank` via [reciprocal rank fusion](./pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md)), plus an **Ask** mode that streams a RAG-style answer grounded in the top results.

## Tech stack

- **Frontend**: SvelteKit 2 + Svelte 5, Tailwind CSS v4. Visual design follows the agentos-sdk.dev look (light warm paper theme) — see [the ADR](./decisions/adopt-agentos-sdk-dev-visual-design-system.md).
- **Database**: PostgreSQL on Railway (`te9_dev` schema), with the `pgvector` extension. Embeddings are 1024-dimensional (Voyage `voyage-4-large`) after a migration from the original 384-dim OpenAI/HuggingFace model — see the [embedding-provider ADR](./decisions/embedding-provider-voyage-voyage-4-large-1024-dim.md).
- **Embeddings & reranking**: Voyage AI (`VOYAGE_API_KEY`). `src/lib/server/embeddings.ts` (embeddings) and `src/lib/server/rerank.ts` (cross-encoder rerank with `rerank-2.5-lite`) — both raw `fetch`, no SDK. Reranking was added on top of RRF — see the [reranking ADR](./decisions/adopt-cross-encoder-reranking-voyage-rerank-2-5-lite-on-top-.md).
- **Chat/RAG**: Vercel AI SDK v4 `streamText`. Chat provider is DeepSeek by default (OpenAI-compatible); `OPENAI_API_KEY` + `CHAT_BASE_URL` switch to OpenAI/OpenRouter.
- **Deployment**: Railway via `@sveltejs/adapter-node`. `npm start` runs `node build`.

## Project layout

Three top-level dirs hold runtime/scratch state: `.pi/` (coding-agent session state), `.work/` (task-tracker scratch), and `.agents/` (skill definitions). `docs/` holds the OKF knowledge wiki (`docs/wiki/`) and `docs/research_semantic_search/research_report.md`. The application source lives in `src/`: `src/lib/server/` for the search/RAG pipeline, `src/routes/` for SvelteKit pages and API routes. `scripts/` holds the embedding backfill and SQL migrations. `.github/workflows/embed-new-bookmarks.yml` runs a daily cron to embed newly added bookmarks. See [architecture/file-tree](./architecture/file-tree.md) for the complete file map.

## Knowledge wiki

`docs/wiki/` is an [OKF](https://github.com/earendil-works/okf) bundle: `index.md` (navigation), this overview, `glossary.md`, `architecture/file-tree.md`, plus typed folders — `decisions/` (ADRs), `rules/`, `learnings/`, `preferences/`, and `pages/` (split into `concepts/`, `entities/`, `artifacts/`). Each typed folder has its own `index.md`.
