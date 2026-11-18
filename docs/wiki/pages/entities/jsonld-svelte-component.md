---
type: Entity
title: JsonLd.svelte component
description: `src/lib/components/JsonLd.svelte` — a head component that renders a schema.org JSON-LD `<script type="application/ld+json">` block from server-owned data.
tags: [json-ld, seo, svelte, structured-data]
timestamp: "2026-11-10T11:32:02.231Z"
---

# JsonLd.svelte component

`src/lib/components/JsonLd.svelte` — a head component that renders a schema.org JSON-LD `<script type="application/ld+json">` block from server-owned data.

## What it is

The structured-data renderer of the [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md). Each public page builds its own schema graph and hands it to this component so search engines and AI agents get machine-readable facts about the site and its pages.

## Details

- **Location**: `src/lib/components/JsonLd.svelte`
- **Interface**: one prop — `data: Record<string, unknown> | Record<string, unknown>[]` (a schema.org `@graph` or single node); serializes with `JSON.stringify(...).replace(/</g, '\\u003c')` in a `$derived`, rendered via `{@html}` so the payload can never close its own script tag (no `</script>` breakout through titles or copy)
- **Usage**:
  - `/` — `WebSite` + `SearchAction` (EntryPoint urlTemplate `https://productsear.ch/?q={search_term_string}` → Google sitelinks searchbox) + `WebApplication`
  - collections pages — `CollectionPage` + `ItemList` (the group page builds a `groupJsonLd` const)
  - `/listings/[id]` — `ItemPage`
- **Gotcha baked into its history**: a literal `</script>` anywhere in this file — including inside a comment — terminates Svelte's script block and breaks the component; see [learnings/svelte-script-blocks-terminate-at-a-literal-script-even-in-c](../../learnings/svelte-script-blocks-terminate-at-a-literal-script-even-in-c.md)

## Relationships

- Implements [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md) — the structured-data leg
- [pages/concepts/url-driven-search-state](../concepts/url-driven-search-state.md) — the `?q=` param the SearchAction template targets

## Lifecycle

- First added: 2026-11-10 — SEO/LLM discovery pass, commit `76623ed`
