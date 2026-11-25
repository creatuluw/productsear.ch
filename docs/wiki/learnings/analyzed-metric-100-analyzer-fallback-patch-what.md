---
type: Learning
title: "Analyzed metric 100%: analyzer fallback patch + what the metric actually counts"
description: Discovered 2026-11-06 while driving the homepage `analyzed` vital sign to 100%.
tags: [metric, analysis, pipeline, gotcha]
timestamp: "2026-11-06T12:37:22.840Z"
---

# Analyzed metric 100%: analyzer fallback patch + what the metric actually counts

Discovered 2026-11-06 while driving the homepage `analyzed` vital sign to 100%.

**Metric semantics:** `analyzedCount` on the homepage is just `count(*)` of `te9_dev.bookmark_analysis` rows (+page.server.ts) — a row with ALL NULL fields still counts. We enriched every row anyway (purpose/how/when), so the label's promise holds.

**The two gaps that kept it below 100%:**
1. **The analyzer skipped crawl-failed rows forever.** Its original selector INNER-JOINed `bookmark_content` with `status='success'` — 290 rows with dead sites / 403s / PDFs / "Could not extract content" could never be analyzed. Fix (productsear.ch copy only): LEFT JOIN + analyze from title/excerpt/URL when markdown is missing.
2. **Rows with analysis rows but all-NULL purpose/how/when were also skipped** (`ba.id IS NULL` selector). Fix: selector now includes rows where purpose AND how_to_use AND when_to_use are all NULL (upsert rewrites them).

**Divergence note:** `scripts/analyze-bookmarks.js` in productsear.ch now differs from E:\te9.dev's copy (fallback input + widened selector). te9.dev's copy still skips un-crawlable rows — its own digest metrics will differ. Accepted per [[product-search-corpus-pipeline-is-self-contained-in-products]].

**Steady-state behavior:** the external Raindrop sync adds rows continuously (4,360 → 4,372 during this run) — they arrive unanalyzed and briefly dip the metric until the nightly crawl → analyze → archetypes → embed chain catches up (~100 rows/run). The title/excerpt fallback guarantees even un-crawlable arrivals reach analysis, so the metric converges back to 100% daily instead of stalling at ~93%.
