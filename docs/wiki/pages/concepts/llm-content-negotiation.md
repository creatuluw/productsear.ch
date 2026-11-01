---
type: Concept
title: LLM content negotiation
description: What is it?
tags: [llms-view, content-negotiation, markdown, sveltekit]
timestamp: "2026-11-01T01:49:55.402Z"
---

# LLM content negotiation

## What is it?

One canonical URL (any page with `?view=llm`) serves two representations negotiated by the `Accept` header: non-browser clients (curl, LLM fetchers — anything whose `Accept` lacks `text/html`, or that passes `?raw=1`) receive the raw document as `text/markdown; charset=utf-8` straight from a SvelteKit server hook; browsers fall through to the normal page, which renders the *same markdown string* styled, with a `raw .md` link. The markdown is built server-side per route and every document opens with an instruction-bearing preamble so an LLM knows the next steps.

## Why does it matter?

LLM collaboration is first-class on this site: a URL pasted into a chat and the same URL opened by a human must each get its ideal format — without separate routes, duplicated content, or drifting copies. It makes every llms surface self-serve: fetch, digest, act.

## Key rules / properties

- Negotiation lives in `wantsRawMarkdown()` (`src/lib/server/llms.ts`): requires `view=llm`; `raw=1` forces raw; otherwise raw iff `Accept` does not include `text/html`.
- Raw responses carry `Content-Type: text/markdown; charset=utf-8` and `Cache-Control: no-store`.
- `llmMarkdown()` in `llms.ts` is the router: each llm surface (search, archive, compendium index/group) must register a builder there, or fetchers silently get the HTML page.
- Never intercept SvelteKit data requests: the hook must early-return `resolve(event)` when `event.isDataRequest` — the client router normalizes `event.url` to the route for `__data.json` fetches, so a `?view=llm` tab switch looks like the page; answering it with markdown crashes the router (prod 500, fixed 2026-11-01). See the data-request learning.
- Markdown may echo user input (search query) → builders must HTML-escape echoes; markup itself is server-owned, so no sanitizer (per the sanitizer rule).
- Preamble is instructions, not just data: shortlist → verify URLs → search deeper via API → browse archetypes → decide per candidate.

## Relationships

- [url-driven-search-state](./url-driven-search-state.md) — the view/state stays in the URL; only the representation is negotiated
- [llmdoc-component](./llmdoc-component.md) — the browser-side renderer of the same markdown
- [compendium-pages](./compendium-pages.md) — archetype pages ship both faces under this contract
- Decision: "Dual-view surfaces: humans | llms tabs with ?view=llm on every route" — this mechanism implements and extends that decision

## Source

- `src/hooks.server.ts` — the `handle` intercept performing the negotiation
- `src/lib/server/llms.ts` — `wantsRawMarkdown()`, `llmMarkdown()` router, raw `Response` builder
- `src/lib/server/llmview.ts` — markdown builders + instruction preamble
