---
type: Learning
title: "External crawler/analyzer lives at E:\te9.dev — analyzer requires crawled content, processes 100 rows/run newest-first"
description: "Discovered 2026-11-06 while answering "where is the sync/analysis pipeline?" (user's best guess: `E:\te9.dev` — confirmed correct)."
tags: [ingestion, database, external-pipeline, analysis, te9-dev]
timestamp: "2026-11-06T09:27:14.626Z"
---

# External crawler/analyzer lives at E:\te9.dev — analyzer requires crawled content, processes 100 rows/run newest-first

Discovered 2026-11-06 while answering "where is the sync/analysis pipeline?" (user's best guess: `E:\te9.dev` — confirmed correct).

**The facts:**

- The external crawler/analyzer repo is at **`E:\te9.dev`**. The analysis script is **`E:\te9.dev\scripts\analyze-bookmarks.js`** — this is the concrete answer to "where does `bookmark_analysis` come from?", which the [[bookmarks-table-is-a-read-only-mirror-the-raindrop]] and [[bookmark-ingestion-chain-is-gap-catching-archetypes-classifi]] learnings only describe as "external".
- **Crawl-before-analyze dependency:** the analyzer JOINs `te9_dev.bookmark_content` with `status='success'` — a row must first be **crawled** (a successful `bookmark_content` row exists) before the analyzer can process it. So for manually inserted rows the external chain is: crawl → analyze, in that order, neither owned by this repo.
- **Throughput limit:** the analyzer processes only **100 rows per run, newest-first** — so older/backfilled rows (e.g. the 522 synthetic repo rows) sort last and need many consecutive runs (or the crawl step for all of them first) before `bookmark_analysis` fills in.

**Why it matters:** this explains the [[homepage-analyzed-vital-sign-analyzed-total-ratio-bulk-inser]] regression — bulk inserts drop the homepage `analyzed` % and stay low until *this* external pipeline catches up, which is slow by design (100/run). When asked to "run the analysis" for backfilled rows, the levers live in `E:\te9.dev`, not in this repo.
