---
type: Decision
title: Trim sitemap.xml to hub surfaces only — no individual listing URLs
description: Context
tags: [seo, sitemap, crawl-budget, discovery]
status: accepted
timestamp: "2026-11-10T11:43:26.025Z"
---

# Trim sitemap.xml to hub surfaces only — no individual listing URLs

## Context

The 2026-11-10 discovery pass ([[decisions/adopt-full-search-engine-and-llm-discovery-infrastructure]]) shipped a dynamic sitemap with one URL per corpus listing — ~4,450 URLs total (6 surfaces + 30 collections + 4,414 listings). Minutes later the user pushed back: individual listing pages are thin, 4,414 of them dilute crawl budget, and `/archive` plus `/collections` already expose every listing to crawlers via internal links.

## Choice

Trim `/sitemap.xml` to **hub URLs only** — 36 total: the 6 static surfaces + the 30 archetype collections. No `/listings/{id}` URLs; the listings DB query was removed from the sitemap route. `llms.txt` copy updated to match (commit `e4ecd86`).

## Alternatives considered

- **Keep all ~4.4k listing URLs** — rejected: thin pages earn no crawl budget, and the sitemap at the time also advertised the 522 synthetic negative-id listings whose public rendering was still broken.
- **Sitemap index with a listings child file** — rejected: unnecessary complexity once listings are fully discoverable through `/archive` (paginated, newest-first) and `/collections` internal links.

## Rationale

A sitemap's job is URL discovery, not quality signaling — and listing URLs were already discoverable by crawling hub internal links. Dropping them concentrates crawl budget on surfaces that matter while listings remain indexable (found by crawling, not listed). It also decouples the sitemap from the synthetic-id situation on the corpus.

## Consequences

- Sitemap = 36 URLs / 0 listing URLs; listings stay indexable via `/archive` and `/collections` internal links.
- User follow-up: resubmit `sitemap.xml` in Google Search Console after the deploy — Google drops removed URLs as it recrawls, and the transient 404s it saw on `/listings/-52x` resolve to real pages.
- Amends only the sitemap scope of the discovery ADR; every other part of that decision stands.
- See [[pages/entities/dynamic-xml-sitemap-endpoint]] for the resulting URL set and [[learnings/feed-surfaces-link-synthetic-negative-id-listings-public-lis]] for the related listing-route fix shipped in the same commit.
