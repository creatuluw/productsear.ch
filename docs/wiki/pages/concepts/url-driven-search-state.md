---
type: Concept
title: URL-driven search state
description: What is it?
tags: [frontend, sveltekit, search, ux, routing]
timestamp: "2026-08-25T17:18:52.638Z"
---

# URL-driven search state

## What is it?

The homepage search input is not component state — it is **derived from URL params**. `src/routes/+page.svelte` reads `q` and `mode` from `page.url.searchParams` (`/?q=…&mode=ask`), and every UI action rewrites the URL, which in turn re-runs the search.

## Why does it matter?

- Searches are **shareable and bookmarkable** — loading `/?q=…&mode=ask` restores the search (or streams the ask) on mount.
- **Back/forward steps through search history**, and the URL always reflects what the user sees.
- Any future filter/sort param should follow this same pattern rather than reintroducing local state.

## Key rules / properties

- **Typing** → debounced URL `replaceState` (no history spam per keystroke); **submit / example click** → URL `push` (each search is a history entry).
- Empty query rewrites to `/`; `mode=ask` is only kept in the URL when a query exists.
- The `$effect` on `page.url` is guarded by a plain `synced` object holding the last params we wrote ourselves — so the effect only fires for **external** navigation (back/forward/shared links), not our own `goto`.
- `goto` uses `keepFocus` / `noScroll` so typing is never interrupted.
- Requires SvelteKit ≥ 2.12 for `$app/state` (project is on 2.20).
- `+page.server.ts` deliberately does NOT read these params — search/ask run client-side via fetch; no server round-trip.

## Relationships

- [api-search-endpoint](./api-search-endpoint.md) — the fetch target when `mode=search`
- [api-ask-endpoint](./api-ask-endpoint.md) — the fetch target when `mode=ask`
- [hybrid-search-via-reciprocal-rank-fusion](./hybrid-search-via-reciprocal-rank-fusion.md) — what `q` feeds underneath

## Source

- `src/routes/+page.svelte` — derives `q`/`mode` from URL, owns the sync/push logic (lines ~35–90)
