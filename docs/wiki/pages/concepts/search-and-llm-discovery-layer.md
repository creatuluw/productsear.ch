---
type: Concept
title: Search and LLM discovery layer
description: The site-wide layer that makes productsear.ch findable and legible to three machine audiences — search-engine crawlers, AI answer-engine crawlers/agents, and so
tags: [seo, discoverability, llm, agents, sitemap, rss, json-ld]
timestamp: "2026-11-10T11:43:50.273Z"
---

# Search and LLM discovery layer

The site-wide layer that makes productsear.ch findable and legible to three machine audiences — search-engine crawlers, AI answer-engine crawlers/agents, and social-share unfurlers. It combines crawl control (`static/robots.txt` + `X-Robots-Tag` headers from `src/hooks.server.ts`), dynamic discovery surfaces ([pages/entities/dynamic-xml-sitemap-endpoint](../entities/dynamic-xml-sitemap-endpoint.md), [pages/entities/llms-txt-agent-index](../entities/llms-txt-agent-index.md), [pages/entities/feed-xml-rss-endpoint](../entities/feed-xml-rss-endpoint.md), `/.well-known/security.txt`), per-page metadata (meta description, canonical, OG tags, JSON-LD via [pages/entities/jsonld-svelte-component](../entities/jsonld-svelte-component.md)), and three redundant announcement channels. Shipped 2026-11-10 in one pass (commit `76623ed`) — see [decisions/adopt-full-search-engine-and-llm-discovery](../../decisions/adopt-full-search-engine-and-llm-discovery.md); the sitemap was trimmed to hub URLs only later the same day — see [decisions/trim-sitemap-xml-to-hub-surfaces-only](../../decisions/trim-sitemap-xml-to-hub-surfaces-only.md).

## Why does it matter?

A search app that search engines and AI agents cannot discover undercuts its own premise. Before this layer the site had zero crawler infrastructure — no sitemap, no robots.txt, no structured data, no RSS — and a static `<title>` in `app.html` shadowed every page's real title in raw-HTML crawls. [pages/concepts/llm-content-negotiation](./llm-content-negotiation.md) already gave agents markdown twins, but nothing told them (or crawlers) the site or its surfaces existed.

## Key rules / properties

- **Block private paths at both layers**: robots.txt `Disallow` prevents crawling but NOT indexing — `X-Robots-Tag: noindex, nofollow` (prefixes `/admin`, `/api/auth`, `/api/digest`, `/digest` in hooks.server.ts) covers indexing. `/api` is deliberately NOT disallowed wholesale so the `/api/feed/og` image endpoints stay unfurlable.
- **AI crawlers are explicitly welcomed**: a dedicated 17-bot group in robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) keeps the `?view=llm` markdown twins crawlable — they are FOR those agents.
- **Discovery surfaces fail soft**: sitemap/llms.txt wrap DB reads in try/catch — a DB error yields a valid (shorter) file, never a 500.
- **Announcement is redundant on purpose**: different clients read different channels — crawlers → robots.txt `Sitemap:`, non-HTML-parsing agents → HTTP `Link:` header on every HTML response, share fetchers → `<link>` tags in head.
- **JSON-LD carries server-owned data only**: the component escapes `<` to `\u003c` so no script-close breakout is possible through titles or copy.
- **Dynamic, never stale; sitemap is hub-only**: the sitemap carries the 36 hub URLs (6 surfaces + 30 collections) — listing pages are intentionally excluded and discovered via internal links from `/archive` and `/collections`; llms.txt embeds live corpus stats (total, 30-day adds, sync date). Responses cache 30–60 min publicly.

## Relationships

- [pages/entities/dynamic-xml-sitemap-endpoint](../entities/dynamic-xml-sitemap-endpoint.md) — the crawler URL map (hub URLs only)
- [pages/entities/llms-txt-agent-index](../entities/llms-txt-agent-index.md) — the agent-facing site index (llmstxt.org convention)
- [pages/entities/feed-xml-rss-endpoint](../entities/feed-xml-rss-endpoint.md) — [pages/entities/the-drum-feed](../entities/the-drum-feed.md) as RSS 2.0
- [pages/entities/jsonld-svelte-component](../entities/jsonld-svelte-component.md) — schema.org structured-data renderer
- [pages/concepts/llm-content-negotiation](./llm-content-negotiation.md) — the `?view=llm` twins this layer advertises
- [pages/concepts/url-driven-search-state](./url-driven-search-state.md) — the `?q=` param the SearchAction urlTemplate targets
- [pages/entities/waveloader-component](../entities/waveloader-component.md), [pages/entities/llmdoc-component](../entities/llmdoc-component.md) — existing head/UI machinery the layer coexists with

## Source

- `static/robots.txt`, `src/hooks.server.ts`, `src/app.html` — crawl control + announcement channels
- `src/routes/sitemap.xml/+server.ts`, `src/routes/llms.txt/+server.ts`, `src/routes/feed.xml/+server.ts`, `src/routes/.well-known/security.txt/+server.ts` — discovery surfaces
- `src/routes/+page.svelte` et al. — per-page meta/JSON-LD
