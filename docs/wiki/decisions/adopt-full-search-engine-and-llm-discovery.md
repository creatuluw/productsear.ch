---
type: Decision
title: Adopt full search-engine and LLM discovery infrastructure
description: Context
tags: [seo, discoverability, llm, agents, sitemap, rss, json-ld, robots-txt]
status: accepted
timestamp: "2026-11-10T11:31:20.363Z"
---

# Adopt full search-engine and LLM discovery infrastructure

## Context

A 2026-11-10 audit, driven by the seo-visibility-expert skill (`E:\skills.te9.dev\seo-visibility-expert\SKILL.md`) and the specification.website checklist, found productsear.ch with strong LLM plumbing ([pages/concepts/llm-content-negotiation](../pages/concepts/llm-content-negotiation.md), `/skill.md`, receipt-card OG images) but **zero search-engine infrastructure**: no robots.txt, no sitemap.xml, no llms.txt, no RSS, no meta descriptions, no canonical URLs, no JSON-LD — plus a static `<title>` in `src/app.html` that shadowed every page's real title in raw-HTML crawls. Search engines had nothing to index properly and AI agents had no machine-readable site map.

## Choice

Ship the full discovery layer in one pass (commit `76623ed`, 23 files, pushed to `main` → Railway):

- **Crawl/index control**: `static/robots.txt` with an explicit 17-bot AI-crawler group (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) sharing the same private-path Disallows as `*`; `X-Robots-Tag: noindex, nofollow` from `src/hooks.server.ts` on `/admin`, `/api/auth`, `/api/digest`, `/digest`.
- **Discovery surfaces**: dynamic [pages/entities/dynamic-xml-sitemap-endpoint](../pages/entities/dynamic-xml-sitemap-endpoint.md) (6 static paths + 30 collections + all ~4.4k listings with lastmod); [pages/entities/llms-txt-agent-index](../pages/entities/llms-txt-agent-index.md) (llmstxt.org index with live corpus stats); [pages/entities/feed-xml-rss-endpoint](../pages/entities/feed-xml-rss-endpoint.md) (The Drum as RSS 2.0); `/.well-known/security.txt` (RFC 9116).
- **Announcement channels (redundant by design)**: `Sitemap:` line in robots.txt; HTTP `Link:` header on every HTML response (llms.txt + sitemap + RSS) so clients that never parse HTML still find them; `<link rel="llms-txt">` + `<link rel="alternate" type="application/rss+xml">` in head.
- **Per-page metadata**: meta description + canonical + OG tags on all 7 public pages (descriptions embed live corpus counts); JSON-LD via the new [pages/entities/jsonld-svelte-component](../pages/entities/jsonld-svelte-component.md) — WebSite + SearchAction (Google sitelinks searchbox; the high-value schema for a search app) + WebApplication on `/`, CollectionPage + ItemList on collections, ItemPage on listings; static app.html title removed; branded `+error.svelte` returning real 404 status (no soft-404s); homepage OG card `/api/og/home` so root-URL shares unfurl a designed image too.

## Alternatives considered

- **Google Search Console submission alone** — necessary but insufficient: nothing on-site would tell crawlers what exists or what to skip. Rejected.
- **Rely on the existing `?view=llm` twins** — serves agents that already know the URL, but gives no discovery path for crawlers or new agents. Rejected.
- **Statically generated sitemap.xml** — would go stale as the nightly ingestion adds listings; a dynamic route with fail-soft DB access was chosen instead.

## Rationale

The site's product IS findability — a search app invisible to search engines and agents undercuts its own premise. SearchAction schema is uniquely high-leverage here (it powers the sitelinks searchbox). Announcement is deliberately redundant because different clients read different channels: crawlers read robots.txt, non-HTML-parsing agents read the HTTP Link header, share fetchers read `<link>` tags. Private paths are blocked at BOTH layers because robots.txt prevents crawling but **not indexing** — the `X-Robots-Tag` header covers indexing.

## Consequences

- **User follow-ups (cannot be done from the repo)**: (1) verify the domain in Google Search Console and submit `https://productsear.ch/sitemap.xml` — the single biggest ranking lever; (2) replace the placeholder `mailto:security@productsear.ch` in security.txt with a mailbox that is actually read; (3) apple-touch-icon still TODO — the mascot PNG is portrait (163×256), not square-croppable.
- Sitemap / llms.txt / RSS are fail-soft: DB errors degrade the file, never 500.
- Feed/sitemap/llms responses cache 30–60 min publicly; bump a `?v=N` cache-bust on og:image URLs when card copy changes ([learnings/bluesky-caches-og-image-aggressively-bump-a-v-n-cache-bust-o](../learnings/bluesky-caches-og-image-aggressively-bump-a-v-n-cache-bust-o.md)).
- See [pages/concepts/search-and-llm-discovery-layer](../pages/concepts/search-and-llm-discovery-layer.md) for the layer's invariants.
