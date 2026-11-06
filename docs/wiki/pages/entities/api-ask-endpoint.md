---
type: Entity
title: API ask endpoint
description: What is it?
tags: [rag, api, sveltekit, deprecated]
timestamp: "2026-11-01T00:50:54.777Z"
---

# API ask endpoint

## What is it?
`GET /api/ask` — streaming RAG (Retrieval-Augmented Generation) endpoint. Runs the hybrid search to retrieve relevant bookmarks, feeds them as context to `gpt-4o-mini`, and streams the answer back with citations.

> **Deprecated (2026-11-01):** the P2 redesign removes Ask mode entirely — this endpoint and its UI are slated for removal when the redesign ships. See [remove-ask-mode-productsear-ch-becomes-search-only](../../decisions/remove-ask-mode-productsear-ch-becomes-search-only.md).

## Why it matters
This is the "Ask" mode the user-facing UI exposes — natural-language Q&A over the bookmark corpus with grounded citations. It reuses the same retrieval path as search so results stay consistent.

## Details
- **Location**: `src/routes/api/ask/+server.ts`
- **Interface**: `GET ?q=<question>` → streamed text response (chunked `ReadableStream`).
- **Depends on**: `src/lib/server/rag.ts` (retrieval + prompt + stream), `src/lib/server/search.ts` (retrieval), Vercel `ai` SDK `streamText`, OpenAI `gpt-4o-mini`.
- **Configuration**: requires `OPENAI_API_KEY`; without it returns the intended error.

## Relationships
- [api-search-endpoint](./api-search-endpoint.md) — shares the hybrid retrieval path.
- [hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md) — RAG sits on top of the chosen search stack.
- [vercel-ai-sdk-v4-streamtext-exposes-async](../../learnings/vercel-ai-sdk-v4-streamtext-exposes-async.md) — streaming gotcha fixed in `rag.ts`.
- [remove-ask-mode-productsear-ch-becomes-search-only](../../decisions/remove-ask-mode-productsear-ch-becomes-search-only.md) — the redesign decision that retires this endpoint.

## Lifecycle
- First added: 2026-07-03 (initial project scaffold).
- 2026-11-01 — Deprecated: slated for removal per the P2 redesign decision.
