---
type: Entity
title: Compendium pages
description: "`/compendium` (index) and `/compendium/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; each g"
tags: [frontend, routes, compendium, archetypes]
timestamp: "2026-11-01T01:27:44.055Z"
---

# Compendium pages

`/compendium` (index) and `/compendium/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; each group page shows bounded cards for its bookmarks with **WHAT / HOW / WHEN** rows plus tags and date (the "who" is implied in the wording, per the approved brief).

## Details

- **Location**: `src/routes/compendium/+page.svelte`, `+page.server.ts`; `src/routes/compendium/[slug]/+page.svelte`, `+page.server.ts`
- **Data source**: [bookmark-archetype-system](./bookmark-archetype-system.md) — `te9_dev.bookmark_archetypes` (multi-entry jsonb, GIN-indexed, app-owned)
- **Tag rendering**: analysis tags are JSON arrays and must be flattened before render — raw arrays leaked `["local LLM"` bracket artifacts until the P5 verify-round fix
- **Shared data**: archetype tables in `src/lib/archetypes.ts`
- **LLM twin**: `?view=llm` serves the paste-ready markdown twin, per [url-driven-search-state](./url-driven-search-state.md) view contract
- P5 verify-round fixes: JSON tag normalization, scrollbar theming, mobile overflow guards (see [guard-min-content-width-on-wrapping-sensitive-text](./guard-min-content-width-on-wrapping-sensitive-text.md))

## Lifecycle

- First added: 2026-11-01 — P5 build of the impeccable-studio redesign (spec: `pages/artifacts/impeccable-design-brief-p4`)
- Significant changes: 2026-11-01 — verify round: JSON-array tag artifacts fixed, responsive guards added
