---
type: Entity
title: feed.xml RSS endpoint
description: `/feed.xml` — The Drum as RSS 2.0, letting readers subscribe to the 48h-draw feed in any feed reader.
tags: [rss, feed, the-drum, discovery]
timestamp: "2026-11-10T11:32:02.231Z"
---

# feed.xml RSS endpoint

`/feed.xml` — The Drum as RSS 2.0, letting readers subscribe to the 48h-draw feed in any feed reader.

## What it is

The syndication twin of [pages/entities/the-drum-feed](./the-drum-feed.md) and a discovery surface of the [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md). Announced site-wide via `<link rel="alternate" type="application/rss+xml">` in `src/app.html` and the HTTP `Link:` header on every HTML response.

## Details

- **Location**: `src/routes/feed.xml/+server.ts`
- **Interface**: `GET` → `application/rss+xml; charset=utf-8`, `Cache-Control: public, max-age=1800`
- **Content source**: `listPublished(50)` from `$lib/server/feed/queries` — the 50 latest published Drum items
- **Feed hygiene** (per the specification.website checklist): `atom:link rel="self"` for self-identification, stable `guid isPermaLink="false"` carrying the feed-item id, RFC-822 `pubDate` (`publishedAt ?? createdAt`), `sy:updatePeriod hourly` syndication module
- **Item shape**: title = card headline, link = `/listings/{id}` when the card references a listing (else `/feed`), description = standfirst or first paragraph
- **Channel**: "The Drum — productsear.ch", 48h-draw description, `lastBuildDate` from newest item

## Relationships

- [pages/entities/the-drum-feed](./the-drum-feed.md) — the content source it syndicates
- Implements [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md) — discovery surface for feed readers and crawlers

## Lifecycle

- First added: 2026-11-10 — SEO/LLM discovery pass, commit `76623ed`
