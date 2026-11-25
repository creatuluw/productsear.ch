---
type: Entity
title: Dynamic XML sitemap endpoint
description: "`/sitemap.xml` — the dynamic XML sitemap serving the **hub URLs** of productsear.ch: 6 static surfaces + all 30 archetype collections = **36 URLs**. Listing pag"
tags: [seo, sitemap, discovery]
timestamp: "2026-11-10T11:43:50.272Z"
---

# Dynamic XML sitemap endpoint

`/sitemap.xml` — the dynamic XML sitemap serving the **hub URLs** of productsear.ch: 6 static surfaces + all 30 archetype collections = **36 URLs**. Listing pages are deliberately absent — crawlers discover them through internal links from `/archive` and `/collections`. Built on request from live data, so it never goes stale as the nightly ingestion adds listings.

## What it is

The crawler entry point of the [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md). Search engines discover it via the `Sitemap:` line in `static/robots.txt` and the HTTP `Link:` header (hooks.server.ts); the user-side lever is submitting it in Google Search Console. Trimmed to hub-only on 2026-11-10 (commit `e4ecd86`) after shipping the same day with ~4,450 URLs — the user's call that 4,414 thin listing pages diluted crawl budget. See [decisions/trim-sitemap-xml-to-hub-surfaces-only](../../decisions/trim-sitemap-xml-to-hub-surfaces-only.md).

## Details

- **Location**: `src/routes/sitemap.xml/+server.ts`
- **Interface**: `GET` → `application/xml; charset=utf-8`, `Cache-Control: public, max-age=3600`
- **URL set**: static paths `['/', '/archive', '/collections', '/feed', '/feed/methodology', '/skill.md']` + `/collections/{slug}` for every `ARCHETYPES` entry — that's the whole set; no `/listings/{id}` URLs since the hub trim
- **Failure mode**: DB reads stay wrapped in try/catch — a DB error still yields a valid sitemap (fail soft)
- **Configuration**: `ORIGIN` hardcoded to `https://productsear.ch`

## Relationships

- Implements [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md) — discovery surface for crawlers
- [pages/entities/bookmark-archetype-system](./bookmark-archetype-system.md) — supplies the 30 collection slugs
- [pages/entities/archive-page](./archive-page.md) and [pages/entities/compendium-pages](./compendium-pages.md) — the hub pages whose internal links carry listing discovery instead of the sitemap
- [pages/concepts/llm-content-negotiation](../concepts/llm-content-negotiation.md) — the markdown twins that share these URLs

## Lifecycle

- First added: 2026-11-10 — SEO/LLM discovery pass, commit `76623ed`, ~4,450 URLs (6 surfaces + 30 collections + 4,414 listings with lastmod)
- 2026-11-10 — trimmed to 36 hub URLs, commit `e4ecd86`: listing URLs removed on the crawl-budget call; llms.txt copy aligned
