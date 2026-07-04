---
type: Rule
title: Sanitize text at the embedding API boundary
description: Guideline
tags: [embeddings, voyage, utf-8, data-quality, gotcha]
timestamp: "2026-07-04T10:04:03.547Z"
---

# Sanitize text at the embedding API boundary

## Guideline
Before sending any text to an embedding API (Voyage, OpenAI, Cohere, …), run it through a `clean()` step that strips **lone UTF-16 surrogates** and **C0/C1 control characters**. Apply it at the single embedding boundary (`src/lib/server/embeddings.ts`) and in the backfill script, not at every caller.

## When it applies
Always, when the source text is scraped/foreign (markdown, HTML, user paste). Our bookmark corpus contains scraped markdown where some rows have lone surrogates and control chars.

## Rationale
Providers reject malformed Unicode with **HTTP 400** mid-backfill, killing the whole job. The fix is one guard in the shared embed function — smaller and safer than guarding every producer. Lone surrogates are invalid UTF-8 by definition; control chars contribute nothing to embeddings.

## Implementation
In `src/lib/server/embeddings.ts`, `clean(s)` strips lone surrogates and control chars before the Voyage POST. The backfill script routes every row through `embed()` so it inherits the guard.

## Related
- [[embedding-provider-voyage-voyage-4-large-1024-dim]] — the migration that introduced the Voyage client and this guard.
