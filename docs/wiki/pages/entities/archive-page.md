---
type: Entity
title: Archive page
description: `/archive` — the chronological all-entries surface of productsear.ch, displayed as **"listings"** (URLs stay /archive). Newest-first by raindrop_created_at, paginated 20/page.
tags: [frontend, routes, archive]
timestamp: "2026-11-01T01:27:44.055Z"
---

# Archive page

`/archive` — the chronological all-entries surface of productsear.ch. **Display name is "listings"** (2026-11 rename): the nav link, `<title>` tag, sr-only h1, and page heading all say "listings", while the URL stays `/archive` — see [the decision](../../decisions/user-facing-vocabulary-is-listings-display-terms.md). Lists the full corpus (**3,764** entries at P5 delivery) newest-first by `raindrop_created_at`, paginated 20/page → **189 pages**, with an honest pager ("1 / 189"). Month headlines sit on a continuous left rule connecting to the entry rows.

## Details

- **Location**: `src/routes/archive/+page.svelte` (client), `src/routes/archive/+page.server.ts` (data load)
- **Data source**: `te9_dev.bookmarks` mirror (read-only; the Raindrop sync lives outside this repo)
- **Shared data**: imports the archetype tables from `src/lib/archetypes.ts` (moved out of `$lib/server/` — see [sveltekit-blocks-lib-server-imports-in-clientn-for-pure-data](../../learnings/sveltekit-blocks-lib-server-imports-in-client.md))
- **Navigation**: pager is URL-driven (`/archive/page/2`), per [url-driven-search-state](../concepts/url-driven-search-state.md)
- [bookmark-archetype-system](./bookmark-archetype-system.md) — the classification data archetype tags come from
- P5 defect fixes applied here: themed scrollbar, snippet/title dedup, min-content-width guards (see [guard-min-content-width-on-wrapping-sensitive-text](../../rules/guard-min-content-width-on-wrapping-sensitive-text.md))

## Lifecycle

- First added: 2026-11-01 — P5 build of the impeccable-studio redesign (spec: `pages/artifacts/impeccable-design-brief-p4`)
- Significant changes: 2026-11-01 — verify round: themed scrollbar, shell-bar overflow fix, stats-panel grid fix
- Significant changes: 2026-11 — "listings" display rename: nav label, title tag, sr-only h1, and page heading now say "listings" (URL unchanged; see [sweep-every-render-path-when-renaming-display](../../rules/sweep-every-render-path-when-renaming-display.md))
