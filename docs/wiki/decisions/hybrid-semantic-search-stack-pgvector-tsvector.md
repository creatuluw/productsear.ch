---
type: Decision
title: "Hybrid semantic search stack: pgvector + tsvector with RRF fusion"
description: Context
tags: [search, rag, architecture, stack, pgvector, postgres]
status: accepted
timestamp: "2026-07-03T14:41:28.829Z"
---

# Hybrid semantic search stack: pgvector + tsvector with RRF fusion

## Context
productsear.ch needs semantic search and RAG ("ask") over ~2,270 existing bookmarks that already live in Postgres (bookmarks, content, and bookmark_analysis tables). The question was what stack to build the search/RAG layer on.

## Choice
- **SvelteKit 2 + adapter-node + TypeScript strict + Tailwind 4** as the app/runtime shell.
- **Drizzle ORM** for read models (bookmarks / content / analysis).
- **pgvector + native Postgres `tsvector`** in the existing Postgres (Railway) — no separate vector DB, no ParadeDB extension. pgvector's HNSW index for cosine similarity; GIN index for full-text.
- **Hybrid ranking via Reciprocal Rank Fusion (RRF)** — one SQL query fuses cosine rank + `ts_rank` rank without score normalization.
- **One searchable text blob** (title + tags + excerpt + `bookmark_analysis.purpose/how_to_use/relevance` + content snippet) feeds *both* the embedding and the tsvector, so semantic and keyword signals cover identical ground.
- **OpenAI `text-embedding-3-small` (1536-dim)** for embeddings, **`gpt-4o-mini`** for RAG, streamed via the **Vercel `ai` SDK**.

## Alternatives considered
- **Separate vector DB** (Pinecone/Qdrant/Weaviate): rejected — extra infra for 2.3k rows where an in-PG HNSW scan is sub-ms. Postgres already holds the source data.
- **ParadeDB**: rejected as unnecessary given pgvector + native `tsvector` already cover the hybrid need.
- **Larger embedding model / different provider**: `text-embedding-3-small` chosen for cost (~$0.02 to backfill all rows); provider is swappable (Ollama local, Voyage/Cohere) since it's isolated behind the embed script + API.

## Rationale
Keep everything in the Postgres you already have; fuse signals in SQL rather than in app code; isolate the LLM/embedding provider behind a thin seam so it can be swapped without touching search/RAG logic. At 2.3k rows exact/HNSW scan is sub-ms, so a dedicated vector store is pure overhead.

## Consequences
- Two API routes: `/api/search` (hybrid RRF) and `/api/ask` (streaming RAG with citations).
- `bookmark_embeddings` table (pgvector) + HNSW + GIN indexes required (migration shipped).
- A resumable backfill script (`scripts/embed-bookmarks.ts`) must run once (~1 min, ~$0.02) before live search works.
- Search/ask return a clear "OPENAI_API_KEY not set" error until a real key is configured — the wiring is verified end-to-end but live run is gated on a key.

## Source
- `research_semantic_search/research_report.md` — research backing the choice
- `src/lib/server/search.ts` — hybrid RRF query
- `src/lib/server/rag.ts` — streaming RAG
- `scripts/embed-bookmarks.ts` — resumable backfill
- `scripts/migration.sql` — pgvector + indexes
