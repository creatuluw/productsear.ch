---
type: Learning
title: "check-active.js: "active" is user-defined as pushed within 30 days; --resplit re-splits cached data without API calls"
description: "**The fact (set 2026-11-06, user-defined):** for the digital-products-repos activity split, the user explicitly redefined **ACTIVE = last push within the last 3"
tags: [repo-scan, activity-check, threshold, csv, archive]
timestamp: "2026-11-06T09:02:30.378Z"
---

# check-active.js: "active" is user-defined as pushed within 30 days; --resplit re-splits cached data without API calls

**The fact (set 2026-11-06, user-defined):** for the digital-products-repos activity split, the user explicitly redefined **ACTIVE = last push within the last 30 days** ("active = commits in the last 30 days and that be the split"). Consequences in `.archive/repo-scan/check-active.js`:

- `THRESHOLD_DAYS` now defaults to **30** (was 12 months in the first run); `--days=N` / `--months=N` still override.
- New `--resplit` mode: skips the GitHub API entirely and re-splits from the existing CSVs' `days_since_last_push` column — useful right after a check run when data is fresh but the threshold changed. Without it, changing the threshold would otherwise require re-spending ~2,900 rate-limited API calls.

**The trap:** the wiki artifact page [[digital-products-repos-activity-split-csvs]] still documents the *old* 12-month run (1,145 active / 1,751 inactive). Those counts do NOT reflect the 30-day definition — after a `--resplit` run the active CSV shrinks sharply. Trust `activity_status` + `days_since_last_push` in the CSVs (and the script header) over the page's snapshot counts.
