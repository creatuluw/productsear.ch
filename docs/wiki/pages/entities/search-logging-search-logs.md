---
type: Entity
title: Search logging (search_logs)
description: What it is
tags: [search, analytics, logging, admin, search-logs]
timestamp: "2026-11-18T15:47:44.157Z"
---

# Search logging (search_logs)

## What it is

The search analytics log — **one append-only row per executed search** on productsear.ch, stored in `te9_dev.search_logs`, surfaced read-only in the admin console at `/admin/searches`. Answers "what are people (and agents) searching for?".

## Why it matters?

Before this, the only search signal was [the-drum-feed](./the-drum-feed.md)'s `search_misses` table — zero-result queries only, feeding The Floor's aggregated themes. There was no way to see *successful* searches, search volume, or what the corpus gets asked for most. The log turns search from an invisible read path into a measurable one.

## Details

- **Location**: `src/lib/server/search-logs.ts` (helper), `scripts/migration-search-logs.sql` (table)
- **Schema**: `query` (truncated to 300 chars), `source` (`web` = the site's own UI, `api` = external callers of GET /api/search, `llm` = the homepage `?view=llm` machine twin), `results` (honest total above the 0.45 relevance floor), `took_ms`, `created_at`; indexed on `created_at DESC`
- **Contract**: fire-and-forget — `logSearch()` never awaits, never throws into the search path (same contract as the [the-drum-feed](./the-drum-feed.md) misses insert). A logging failure can never slow or break a search.
- **Wiring**: `/api/search` logs every query (source `web` when the site's own homepage client tags `&src=web`, else `api`); the homepage `?view=llm&q=` branch logs source `llm`
- **Admin surface**: `/admin/searches` — last-24h / 7-day / zero-result counters, top queries and top zero-result queries over 7 days, latest 50 raw rows
- **Privacy**: raw queries are for the owner's analysis only; public surfaces keep publishing aggregated themes, never raw queries (The Floor rule, unchanged)

## Relationships

- [api-search-endpoint](./api-search-endpoint.md) — the logging hook lives in its GET handler; `&src=web` is the new UI tag
- [the-drum-feed](./the-drum-feed.md) — `search_misses` stays the Floor's raw material; `search_logs` is the superset analytics twin
- admin console — `/admin/searches` joins the console nav (overview / extensions / agents / settings / features / searches)

## Lifecycle

- First added: 2026-11-18 — owner asked to log all searches to see what people search for; migration dry-run then committed against the shared Railway DB, helper tested end-to-end before deploy.
