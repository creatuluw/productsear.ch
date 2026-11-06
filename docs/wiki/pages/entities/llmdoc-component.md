---
type: Entity
title: LlmDoc component
description: `src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as a **machine-readout
tags: [svelte, component, llms-view, markdown, machine-view]
timestamp: "2026-11-03T09:30:39.301Z"
---

# LlmDoc component

`src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as a **machine-readout console** (2026-11-03 redesign), replacing the earlier human-prose styling on the home, search, archive, and compendium llm surfaces.

## Details

- **Location**: `src/lib/components/LlmDoc.svelte`
- **Interface / Schema**: `let { md }: { md: string }` — parses with `marked` (GFM + breaks on) inside a `$derived`, renders via `{@html}` inside `article.md.md-machine`. Wrapping panel: `section` with hairline border, rounded corners, `aria-label="machine-readable document"`. Mono status-bar header shows a green status dot, `machine view · text/markdown · {page.url.pathname}`, and a `raw .md ↗` link that appends `raw=1` to the current URL (via `$app/state`) and opens in a **new tab** (`target="_blank" rel="noopener"`).
- **Configuration**: none — styling comes from the `.md-machine` layer in `app.css` (composed over `.md`); uses the `--color-success` and `--color-accent` tokens. See the decision "Machine-readout console identity for ?view=llm surfaces" (2026-11-03, commit `0500b2d`).

## Relationships

- [llm-content-negotiation](../concepts/llm-content-negotiation.md) — this component is the browser face of the negotiation
- [url-driven-search-state](../concepts/url-driven-search-state.md) — the raw link is URL-derived (`raw=1` appended), not app state

## Lifecycle

- First added: 2026-11-01 — llms views switched from `<pre>` raw text to content negotiation (rendered for browsers, raw markdown for LLM fetchers).
- 2026-11-03 — redesigned as a machine-readout console (commit `0500b2d`): dedicated `.md-machine` CSS layer, status bar with content-type + path, full Martian Mono body, green heading/list markers, wrap-safe long URLs, scrollable tables; raw `.md` link fixed to open in a new tab.
- Security note: `{@html}` is safe only because the markdown is server-owned; query echoes inside it must be HTML-escaped by the builders (self-XSS vector addressed at creation).
