---
type: Learning
title: In a FROM list, JOIN binds tighter than comma — put set-returning functions last
description: "**The gotcha (2026-11-06, Ambition Path query):** when a FROM list mixes comma joins and explicit JOINs, Postgres parses the JOIN as binding tighter than the co"
tags: [[postgres, sql, gotcha, feed, query-planner]]
timestamp: "2026-11-06T20:27:00.787Z"
---

# In a FROM list, JOIN binds tighter than comma — put set-returning functions last

**The gotcha (2026-11-06, Ambition Path query):** when a FROM list mixes comma joins and explicit JOINs, Postgres parses the JOIN as binding tighter than the comma:

```sql
FROM te9_dev.bookmark_analysis ba, generate_series(1,3) g
JOIN te9_dev.bookmarks b ON b.id = ba.bookmark_id   -- ERROR: can't see `ba`
```

parses as `ba, (generate_series(...) JOIN bookmarks ON ...)` — the JOIN is assembled before the comma-introduced `ba` exists, so its ON clause fails with `invalid reference to FROM-clause entry for table "ba"`.

**Fix:** reorder so the comma item / set-returning function comes **after** the explicit JOINs it depends on (`FROM ba JOIN b ON ... , generate_series(1,3) g`), or convert the whole FROM list to explicit JOINs. General rule: when using set-returning functions (generate_series, unnest) alongside joins, place them last in the FROM list.
