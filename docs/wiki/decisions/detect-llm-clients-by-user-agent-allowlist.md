---
type: Decision
title: Detect LLM clients by user-agent allowlist, not Accept header alone, for raw-markdown negotiation
description: Context
tags: [llms-view, content-negotiation, user-agent, api, llm-clients]
status: accepted
timestamp: "2026-11-06T14:35:35.979Z"
---

# Detect LLM clients by user-agent allowlist, not Accept header alone, for raw-markdown negotiation

## Context

The original negotiation (see [Content-negotiate llms views](content-negotiate-llms-views-raw-text-markdown-for.md)) switched on the `Accept` header only: raw `text/markdown` iff `Accept` lacked `text/html`. Live checks showed the gap: **most LLM/agent fetchers mimic browsers** — ChatGPT-User, Claude, Perplexity, GPTBot and friends send `Accept: text/html`, so they silently received the styled HTML console view instead of the raw document they came for.

## The choice

`wantsRawMarkdown()` (`src/lib/server/llms.ts`) now matches **user agents** as well as headers:

- `MARKDOWN_USER_AGENTS` allowlist: known LLM/agent clients (ChatGPT, Claude, Perplexity, GPTBot, …) plus CLI/script clients (curl, wget, python, httpx, …) → raw markdown immediately, even with `Accept: text/html`.
- Real browser UAs are **never** in the allowlist, so the humans|llms tab switch still renders the styled view.

Same commit also added markdown as an API output format (`GET /api/search?q=…&format=md` or `Accept: text/markdown`) and a prominent "Search the API" advertisement section at the top of every `?view=llm` document — see [api-search-endpoint](../pages/entities/api-search-endpoint.md) and [llm-content-negotiation](../pages/concepts/llm-content-negotiation.md).

## Alternatives considered

- **Accept-header-only (status quo)** — rejected: empirically fails for the majority of LLM fetchers.
- **Serve raw markdown to everyone** — rejected: destroys the human console view and the dual-surface identity.
- **Custom header/param requirement (`raw=1`)** — kept as an escape hatch, but LLM clients won't know to send it without reading docs first; detection must be automatic.

## Rationale

UA matching is the only signal that distinguishes an LLM fetcher pretending to be a browser from an actual browser. The allowlist is fail-safe in both directions: unknown UAs fall back to header-based negotiation, and excluding real browser UAs guarantees humans never lose the styled view.

## Consequences

- New LLM clients must be added to `MARKDOWN_USER_AGENTS` when discovered (live checks caught this gap; expect more).
- CLI tools (curl, wget, python) also get raw markdown on `?view=llm` URLs — intentional, matches how humans script against the site.
- Deployed and verified live on production 2026-11-06 (commit `fb62e85`, Railway).
