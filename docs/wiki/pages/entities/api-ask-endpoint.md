---
type: Entity
title: API ask endpoint
description: What is it?
tags: [rag, api, sveltekit]
timestamp: "2026-07-03T14:42:17.796Z"
---

# API ask endpoint

## What is it?
`GET /api/ask` — streaming RAG (Retrieval-Augmented Generation) endpoint. Runs the hybrid search to retrieve relevant bookmarks, feeds them as context to `gpt-4o-mini`, and streams the answer back with citations.

## Why it matters
This is the "Ask" mode the user-facing UI exposes — natural-language Q&A over the bookmark corpus with grounded citations. It reuses the same retrieval path as search so results stay consistent.

## Details
- **Location**: `src/routes/api/ask/+server.ts`
- **Interface**: `GET ?q=<question>` → streamed text response (chunked `ReadableStream`).
- **Depends on**: `src/lib/server/rag.ts` (retrieval + prompt + stream), `src/lib/server/search.ts` (retrieval), Vercel `ai` SDK `streamText`, OpenAI `gpt-4o-mini`.
- **Configuration**: requires `OPENAI_API_KEY`; without it returns the intended error.

## Relationships
- [api-search-endpoint](./api-search-endpoint.md) — shares the hybrid retrieval path.
- [hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi](./hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi.md) — RAG sits on top of the chosen search stack.
- [vercel-ai-sdk-v4-streamtext-exposes-async-textstream-not-tor](./vercel-ai-sdk-v4-streamtext-exposes-async-textstream-not-tor.md) — streaming gotcha fixed in `rag.ts`.

## Lifecycle
- First added: 2026-07-03 (initial project scaffold).
