---
type: Entity
title: Collections pages
description: "`/collections` (index) and `/collections/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; ea"
tags: [frontend, routes, collections, archetypes]
timestamp: "2026-11-01T01:27:44.055Z"
---

# Collections pages

`/collections` (index) and `/collections/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; each group page shows bounded cards for its bookmarks with **WHAT / HOW / WHEN** rows plus tags and date (the "who" is implied in the wording, per the approved brief).

**Formerly the "compendium"** — renamed to "collections" on 2026-11-06 (display term AND routes; see [the decision](../../decisions/rename-compendium-to-collections-routes-moved-308-redirects.md)). Old `/compendium` and `/compendium/<slug>` URLs 308-redirect to the new paths, query string preserved (`?view=llm` included).

## Details

- **Location**: `src/routes/collections/+page.svelte`, `+page.server.ts`; `src/routes/collections/[slug]/+page.svelte`, `+page.server.ts`
- **Redirects**: `src/routes/compendium/+page.server.ts` and `src/routes/compendium/[slug]/+page.server.ts` — 308 to the new paths; these are the only legitimate remaining "compendium" references in `src/`
- **Data source**: [bookmark-archetype-system](./bookmark-archetype-system.md) — `te9_dev.bookmark_archetypes` (multi-entry jsonb, GIN-indexed, app-owned)
- **Tag rendering**: analysis tags are JSON arrays and must be flattened before render — raw arrays leaked `["local LLM"` bracket artifacts until the P5 verify-round fix
- **Shared data**: archetype tables in `src/lib/archetypes.ts`
- **LLM twin**: `?view=llm` serves the paste-ready markdown twin, per [url-driven-search-state](../concepts/url-driven-search-state.md) view contract
- P5 verify-round fixes: JSON tag normalization, scrollbar theming, mobile overflow guards (see [guard-min-content-width-on-wrapping-sensitive-text](../../rules/guard-min-content-width-on-wrapping-sensitive-text.md))

## Lifecycle

- First added: 2026-11-01 — P5 build of the impeccable-studio redesign (spec: `pages/artifacts/impeccable-design-brief-p4`), as `/compendium`
- Significant changes: 2026-11-01 — verify round: JSON-array tag artifacts fixed, responsive guards added
- Significant changes: 2026-11-06 — renamed to `/collections` (commit `75f6424`); 308 redirects added at old paths
