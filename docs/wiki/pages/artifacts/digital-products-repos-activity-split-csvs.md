---
type: Artifact
title: digital-products-repos activity split CSVs
description: The activity-checked split of the 2,896 missing-repo candidates into 1,145 active and 1,751 inactive CSVs, with fresh GitHub metadata and days-since-last-push.
tags: [artifact, csv, activity-check, archive]
timestamp: "2026-11-06T08:40:41.086Z"
---

# digital-products-repos activity split CSVs

## What is it?

The activity-checked split of [digital-products-repos-missing-csv](./digital-products-repos-missing-csv.md): each of the 2,896 not-yet-bookmarked repos got a fresh `GET /repos/{owner}/{repo}` GitHub API check (2026-11-06, concurrency 20, classic token from `.ghtoken`) and landed in exactly one of two files:

- `.archive/digital-products-repos-missing-active.csv` — **1,145 rows** (exists, not archived, pushed within 12 months — the original check threshold)
- `.archive/digital-products-repos-missing-inactive.csv` — **1,751 rows**: 1,590 `stale` (no push in 12+ months), 159 `archived`, 2 `gone` (404: `pretia-ai/pretia`, `yuuslokrobjakkroval/sendfame-landing-page`)
- `.archive/digital-products-repos-missing-active-last-30-days.csv` — **522 rows**: the user-defined ACTIVE subset (last push ≤ 30 days), filtered from the active CSV, stars-desc order preserved. **This is the canonical "still active" definition going forward** — `check-active.js` now defaults to `--days=30`

## What it documents

- Activity status of the repo candidates before DB ingestion — dead repos are poor bookmark candidates
- Fresh GitHub metadata folded into the original 17 columns (`stars`, `repo_pushed_at`, `archived` updated on API 200) plus 3 new columns: `activity_status` (active/stale/archived/gone), `days_since_last_push`, `activity_note` (e.g. rename detection)
- The 30-day threshold is the default: re-run `node .archive/repo-scan/check-active.js` (override with `--days=N` or `--months=N`; months × 30.44). To refresh just the 30-day subset without re-hitting the API, filter the active CSV on `days_since_last_push <= 30`

## Details

- **Location**: `.archive/digital-products-repos-missing-active.csv`, `.archive/digital-products-repos-missing-inactive.csv`
- **Format**: CSV, 20 columns (17 original + 3 activity), RFC4180-quoted descriptions, sorted by fresh stars desc
- **Rate limit**: ~2,896 core requests vs 5,000/hr authenticated — fits in one window; script aborts upfront if remaining < needed, and waits out `x-ratelimit-reset` on 403/429 mid-run
- Re-run: `node .archive/repo-scan/check-active.js` (regenerates both files from the missing CSV)
