---
type: Decision
title: "Repo-scan pipeline: cheapest-first phases; npm/PyPI registry lookups replace GitHub slug-guessing"
description: Context
tags: [data-pipeline, github-api, repo-discovery, rate-limits]
status: accepted
supersedes: "["slug-guess-via-github-core-api"]"
timestamp: "2026-11-03T14:23:24.019Z"
---

# Repo-scan pipeline: cheapest-first phases; npm/PyPI registry lookups replace GitHub slug-guessing

## Context

Enriching all 4,224 bookmarks (→ 4,206 unique products) in `.archive/digital-products.csv` with their open-source GitHub repos. GitHub API budget is scarce even authenticated (5,000 core/hr, **30 searches/min** on the search API), and ~2,990 entries were Product Hunt links whose pages are Cloudflare-blocked (403 for plain curl/fetch).

## Choice

A cheapest-first, checkpointed phased pipeline in `.archive/repo-scan/scan.js`:

- **A** — direct GitHub URLs in the CSV (68 units, 66 hits)
- **B** — fetch product homepages, extract `github.com/o/r` links (1,116 homepages, 248 hits)
- **N** — npm registry `/latest` + PyPI JSON `repository` fields (470 hits in ~3.5 min, **no GitHub rate limit**)
- **C2** — GitHub search API `"{name} in:name"` + relevance scoring (the long pole: ~100 min at 30/min)

State checkpoints to `state.json` after each unit, so any phase can be killed and resumed free.

## Alternatives considered

- **C1 slug-guess** (`/users/{slug}/repos`, name-validated): measured **4.7% hit rate** at ~1.9 s/handle latency-bound (~2 h projected) — cut and replaced with the npm/PyPI resolver.
- **Fetching Product Hunt pages**: blocked by Cloudflare; PH entries are resolved via search on title-derived names instead.

## Rationale

Registry `repository` fields resolve dev-tool products to repos exactly and for free; expensive, rate-limited search budget is reserved for products with no registry presence. Measuring each phase's hit rate before committing its budget prevented burning ~2 h on a 4.7% yield.

## Consequences

- `scan.js` has phases A→B→N→C2 and no C1.
- Search-phase queries must **strip the domain token** — the first C2 run wasted ~⅓ of the 30/min budget querying `producthunt in:name` for PH entries.
- Raw matches need post-hoc quality classification (see [[corroborate-product-to-repo-matches-with-multi-signal-checks]]).
