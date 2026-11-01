---
type: Entity
title: LlmDoc component
description: `src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as styled GFM, replaci
tags: [svelte, component, llms-view, markdown]
timestamp: "2026-11-01T01:49:55.401Z"
---

# LlmDoc component

`src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as styled GFM, replacing the old raw `<pre>` branches on the search, archive, and compendium pages.

## Details

- **Location**: `src/lib/components/LlmDoc.svelte`
- **Interface / Schema**: `let { md }: { md: string }` — parses with `marked` (GFM + breaks on) inside a `$derived`, renders via `{@html}` inside `article.md`; header bar shows the current path ("llms view · rendered") and a `raw .md` link that sets `raw=1` on the current URL (via `$app/state` page).
- **Configuration**: none — styling comes from the `.md` article styles in `app.css`; raw link inherits the accent token.

## Relationships

- [llm-content-negotiation](./llm-content-negotiation.md) — this component is the browser face of the negotiation
- [url-driven-search-state](./url-driven-search-state.md) — the raw link is URL-derived (`raw=1` appended), not app state

## Lifecycle

- First added: 2026-11-01 — llms views switched from `<pre>` raw text to content negotiation (rendered for browsers, raw markdown for LLM fetchers).
- Security note: `{@html}` is safe only because the markdown is server-owned; query echoes inside it must be HTML-escaped by the builders (self-XSS vector addressed at creation).
