---
type: Learning
title: Homepage "analyzed" vital sign = analyzed/total ratio — bulk inserts regress it until the external analysis pass runs
description: "Discovered 2026-11-06 while diagnosing why https://productsear.ch/ showed `analyzed` = 81% (user reported the drop)."
tags: [vital-signs, homepage, bookmark_analysis, metrics, gotcha, bulk-inserts]
timestamp: "2026-11-06T09:25:05.202Z"
---

# Homepage "analyzed" vital sign = analyzed/total ratio — bulk inserts regress it until the external analysis pass runs

Discovered 2026-11-06 while diagnosing why https://productsear.ch/ showed `analyzed` = 81% (user reported the drop).

**The metric:** the homepage vital-sign labeled "analyzed — share of entries enriched with purpose / how / when metadata by the analysis pass" is computed as:

```
count(bookmarks joined to a bookmark_analysis row) / count(bookmarks)
```

**The gotcha:** the denominator is *total bookmarks*, so ANY bulk insert regresses the percentage even when nothing got worse. Inserting the 522 synthetic repo rows (negative ids, no `bookmark_analysis`) with 0 of them analyzed dropped the ratio 92% → 81% (3,530/4,360).

**What to do when it regresses:** don't treat it as an app bug — the analysis pass is an EXTERNAL pipeline (outside this repo, same as the Raindrop sync) that enriches rows over time. The expected remediation is to run the analysis pass over the new rows (or wait for the external pipeline to pick them up); the app itself degrades gracefully via LEFT JOINs. When bulk-inserting rows, expect this vital sign to dip until analysis catches up.
