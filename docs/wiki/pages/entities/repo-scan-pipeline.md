---
type: Entity
title: repo-scan pipeline
description: One-off checkpointed Node pipeline (`.archive/repo-scan/`) that matched all 4,224 bookmarks against open-source GitHub repos — provenance for the digital-products repo index
tags: [pipeline, data-enrichment, github-api, archive]
timestamp: "2026-11-03T14:23:59.864Z"
---

# repo-scan pipeline

## What is it?

`.archive/repo-scan/` — a checkpointed, resumable Node pipeline that checked all 4,224 bookmarks (→ 4,206 unique products) in `../digital-products.csv` for an open-source GitHub repo, and fed the result to the [digital-products-repo-index](../artifacts/digital-products-repo-index.md) builder. Built 2026-11-03; strategy per [the ADR](../../decisions/repo-scan-pipeline-cheapest-first-phases-npm-pypi.md).

## Why it matters?

It is the provenance for every repo match in the index: each match carries the method that found it (direct / homepage / npm / PyPI / search), which the builder uses for method-specific quality classification.

## Details

- **Location**: `.archive/repo-scan/`
- **Phases (cheapest-first)**: A direct GitHub URLs (66 hits) → B homepage scans (248) → N npm/PyPI registry `repository` fields (470, no GitHub rate limit) → C2 GitHub search API `"{name} in:name"` (2,265; 30 searches/min → ~100 min)
- **Files**: `scan.js` (pipeline), `repair.js` (metadata backfill for search-resolved repos), `build-html.js` (state → HTML), `missing-repos.js` (state.json + entries.json vs live DB → CSV of repos not yet bookmarked, see [[digital-products-repos-missing-csv]]), `check-active.js` (fresh GitHub API activity check → splits the missing CSV into active/inactive), `gen-insert-sql.js` (30-day active CSV → [[insert-missing-repos-active-30d-sql]] ingestion SQL), `state.json` (checkpoint, ~93 MB), `entries.json` (parsed CSV), `.ghtoken` (token, gitignored), `qa-cdp*.mjs` (headless-Chrome QA)
- **Configuration**: GitHub token for authenticated rate limits (5,000 core/hr, 30 search/min); concurrency 20 for homepage scans
- **Re-running**: `node scan.js` resumes from checkpoint; `node build-html.js [out.html]` rebuilds the HTML

## Lifecycle

- First added: 2026-11-03 — one-off enrichment of the digital-products Raindrop export
- Significant changes: same day — C1 slug-guess phase cut (4.7% hit rate) and replaced by the npm/PyPI resolver; `qualityOk()` re-classification added to the builder; C2 query fixed to stop wasting budget on `producthunt in:name`

## Relationships

- [digital-products-repo-index](../artifacts/digital-products-repo-index.md) — its output artifact
- [corroborate-product-to-repo-matches-with-multi-signal-checks](../../rules/corroborate-product-repo-matches-with-multi-signal.md) — the quality rule its builder implements
- [repo-scan-pipeline-cheapest-first-phases-npm-pypi](../../decisions/repo-scan-pipeline-cheapest-first-phases-npm-pypi.md) — the ADR explaining its shape
