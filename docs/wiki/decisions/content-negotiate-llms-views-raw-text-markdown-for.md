---
type: Decision
title: "Content-negotiate llms views: raw text/markdown for LLM clients, rendered markdown for browsers"
description: Context
tags: [llms-view, content-negotiation, hooks, markdown, sveltekit]
status: accepted
timestamp: "2026-11-01T01:49:55.401Z"
---

# Content-negotiate llms views: raw text/markdown for LLM clients, rendered markdown for browsers

## Context

The [[dual-view-surfaces-humans-llms-tabs-with-view-llm]] decision gave every route a `humans | llms` tab at `?view=llm`, but the llms view initially rendered raw markdown in a `<pre>` for everyone. The user refined the requirement (2026-11-01): the same URL must be **fast for an LLM to digest** (raw markdown when fetched programmatically) and **perfectly formatted for a human** (rendered markdown in the browser), and each llms document must carry explicit next-step instructions.

## Decision

Content negotiation at the hook layer — one canonical URL, two faces:

- `src/hooks.server.ts` intercepts every request. If `view=llm` and the client wants raw markdown (`?raw=1`, or the `Accept` header does not include `text/html`), the hook returns the document directly as `text/markdown; charset=utf-8` from `src/lib/server/llms.ts` (`llmMarkdown()` routes per pathname: search, archive, compendium index/group).
- Browsers (`Accept: text/html`) fall through to the normal page, which renders the **same markdown string** styled via the `LlmDoc` component (marked, GFM), with a `raw .md` link that sets `raw=1`.
- Every document opens with an instruction-bearing preamble (`llmPreamble()` in `llmview.ts`): shortlist 2–4 → verify candidate URLs before adopting → search deeper via the API (`total` = honest count) → browse archetypes → decide per candidate.

## Alternatives considered

- **Separate raw routes** (e.g. `/search.llm.md`) — rejected: two URLs to paste/maintain; the whole point is one URL that works in a chat and a browser.
- **User-agent sniffing** — rejected: `Accept`-header negotiation is the standard web mechanism and trivially testable with `curl`.
- **Keep `<pre>` raw markdown for browsers** — rejected: unreadable for the human half of the dual-view contract.

## Rationale

- The URL is the interface for LLM collaboration (paste it into a chat). `Accept`-based negotiation gives each consumer its ideal representation without duplicating content or routes, and stays consistent with [[url-driven-search-state]] — state lives in the URL, representation is negotiated.
- `?raw=1` is an explicit escape hatch for browsers/tools that send `Accept: text/html` but want the raw document (e.g. copy-as-markdown).
- The instruction preamble turns the llms view from passive data into an actionable brief — the LLM knows the workflow without a separate orientation step.

## Consequences

- New llm surfaces must be added to the `llmMarkdown()` router in `llms.ts` or the hook returns null and the browser page is served to fetchers.
- Rendered output uses `{@html}`: the markdown is server-owned (see the sanitizer rule — no sanitizer needed) **but** documents may echo user input (e.g. the search query), so builders must HTML-escape echoes at construction time (self-XSS vector, fixed this round).
- Cross-check `Accept` handling in prod with `curl -H` — verified: curl gets markdown, browser fetch gets the styled page.
