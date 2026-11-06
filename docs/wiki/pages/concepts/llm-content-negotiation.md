---
type: Concept
title: LLM content negotiation
description: What is it?
tags: [llms-view, content-negotiation, markdown, sveltekit]
timestamp: "2026-11-06T00:00:00.000Z"
---

# LLM content negotiation

## What is it?

One canonical URL (any page with `?view=llm`) serves two representations: non-browser clients receive the raw document as `text/markdown; charset=utf-8` straight from a SvelteKit server hook; browsers fall through to the normal page, which renders the *same markdown string* styled, with a `raw .md` link. The markdown is built server-side per route and every document opens with an instruction-bearing preamble whose first section is a **prominent "Search the API" advertisement** (try-it-now link `https://productsear.ch/api/search?q=llm`, `format=md` note) so an LLM knows the next steps.

## Why does it matter?

LLM collaboration is first-class on this site: a URL pasted into a chat and the same URL opened by a human must each get their ideal format — without separate routes, duplicated content, or drifting copies. It makes every llms surface self-serve: fetch, digest, act.

## Key rules / properties

- Negotiation lives in `wantsRawMarkdown()` (`src/lib/server/llms.ts`): requires `view=llm`; `raw=1` forces raw; **user-agent match forces raw (2026-11-06)** — `MARKDOWN_USER_AGENTS` covers known LLM/agent UAs (ChatGPT, Claude, Perplexity, GPTBot, …) plus CLI/script clients (curl, wget, python, httpx, …) *even when they send `Accept: text/html`* (many LLM fetchers mimic browsers); otherwise raw iff `Accept` lacks `text/html`. Real browser UAs never match, so the humans|llms tab switch is unaffected.
- Raw responses carry `Content-Type: text/markdown; charset=utf-8` and `Cache-Control: no-store`.
- `llmMarkdown()` in `llms.ts` is the router: each llm surface (search, archive, collections index/group) must register a builder there, or fetchers silently get the HTML page.
- Never intercept SvelteKit data requests: the hook must early-return `resolve(event)` when `event.isDataRequest` — answering a `__data.json` fetch with markdown crashes the client router (prod 500, fixed 2026-11-01).
- Markdown may echo user input (search query) → builders must HTML-escape echoes; markup itself is server-owned, so no sanitizer (per the sanitizer rule).
- The search API also speaks markdown directly: `GET /api/search?q=…&format=md` or `Accept: text/markdown` (see [api-search-endpoint](../entities/api-search-endpoint.md)); JSON stays the default.
- Preamble is instructions, not just data: **search the API (top section)** → shortlist → verify URLs → browse archetypes → decide per candidate.

## Relationships

- [url-driven-search-state](./url-driven-search-state.md) — the view/state stays in the URL; only the representation is negotiated
- [llmdoc-component](../entities/llmdoc-component.md) — the browser-side renderer of the same markdown
- [collections-pages](../entities/compendium-pages.md) — archetype pages ship both faces under this contract
- [api-search-endpoint](../entities/api-search-endpoint.md) — the endpoint the preamble advertises; also serves markdown
- Decision: "Dual-view surfaces: humans | llms tabs with ?view=llm on every route" — this mechanism implements and extends that decision

## Source

- `src/hooks.server.ts` — the `handle` intercept performing the negotiation
- `src/lib/server/llms.ts` — `wantsRawMarkdown()`, `MARKDOWN_USER_AGENTS`, `llmMarkdown()` router, raw `Response` builder
- `src/lib/server/llmview.ts` — markdown builders + instruction preamble (`searchApiMd()` for the API's markdown face)
