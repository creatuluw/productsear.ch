---
type: Artifact
title: digital-products-repos-missing CSV
description: CSV of 2,896 GitHub repos found by the repo-scan pipeline that are not yet bookmarked in te9_dev.bookmarks — ingestion candidates sorted by stars, with source Raindrop creation dates.
tags: [artifact, csv, data-diff, archive]
timestamp: "2026-11-06T08:25:12.015Z"
---

# digital-products-repos-missing CSV

## What is it?

`.archive/digital-products-repos-missing.csv` — the diff between the repos found by the [repo-scan pipeline](../entities/repo-scan-pipeline.md) (from `state.json` + `entries.json`) and the GitHub repo URLs already bookmarked in `te9_dev.bookmarks`. One row per repo **not yet in the DB**, sorted by stars descending.

## What it documents

- [digital-products-repo-index](./digital-products-repo-index.md) repos — the candidates for ingestion as bookmarks
- Generated 2026-11-06 by `.archive/repo-scan/missing-repos.js`: 2,937 unique scan repos → 41 already in DB → **2,896 missing** (1,242 `solid` / 1,654 `review` confidence)
- GitHub repo slugs on both sides normalized via `github.com/{owner}/{repo}` (lowercased, strips `www`, query strings, trailing `.git`, extra path segments like `/tree/main` — verified against a `.../UI-TARS-desktop/` trailing-slash row in the DB)

## Details

- **Location**: `.archive/digital-products-repos-missing.csv`
- **Format**: CSV, 17 columns: `repo_full_name, repo_url, description, stars, forks, language, topics, license, archived, repo_created_at, repo_pushed_at, match_methods, confidence, source_raindrop_ids, source_title, source_url, source_created`
- `source_created` = the Raindrop bookmark creation date (earliest across products mapping to that repo) from the digital-products source export; `repo_created_at` = GitHub repo creation date
- `confidence` reuses build-html.js `qualityOk()` buckets: `solid` (corroborated match) vs `review` (mostly `name-search` hits — filter before ingesting)
- Re-run: `node .archive/repo-scan/missing-repos.js` (needs `.env` DATABASE_URL at project root)
