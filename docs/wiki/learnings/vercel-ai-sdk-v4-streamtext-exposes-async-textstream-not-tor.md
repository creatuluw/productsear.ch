---
type: Learning
title: Vercel AI SDK v4 streamText exposes async textStream, not toReadableStream()
description: In AI SDK v4, `streamText(...)` exposes a **`textStream`** property (an async iterable of string chunks), not a `toReadableStream()` method. To stream a respons
tags: [ai-sdk, streaming, gotcha]
timestamp: "2026-07-03T14:41:28.829Z"
---

# Vercel AI SDK v4 streamText exposes async textStream, not toReadableStream()

In AI SDK v4, `streamText(...)` exposes a **`textStream`** property (an async iterable of string chunks), not a `toReadableStream()` method. To stream a response from a SvelteKit `+server.ts`, iterate `result.textStream` manually and write each chunk to the `ReadableStream`.

Discovered while building `/api/ask` (RAG streaming). The `.toReadableStream()` call did not exist in this version. Fixed in `src/lib/server/rag.ts`.

When upgrading the AI SDK, re-check the streaming surface — it has changed across v3/v4/v5.
