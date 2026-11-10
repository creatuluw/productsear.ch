---
type: Learning
title: SELECT DISTINCT ... ORDER BY random() is illegal in Postgres
description: "**The rule:** with `SELECT DISTINCT`, every `ORDER BY` expression must appear in the select list. `random()` is not in the list, so Postgres rejects the query w"
tags: [[postgres, sql, gotcha, feed]]
timestamp: "2026-11-06T20:27:00.787Z"
---

# SELECT DISTINCT ... ORDER BY random() is illegal in Postgres

**The rule:** with `SELECT DISTINCT`, every `ORDER BY` expression must appear in the select list. `random()` is not in the list, so Postgres rejects the query with `for SELECT DISTINCT, ORDER BY expressions must appear in select list`.

**Fix:** wrap the DISTINCT select in a subquery and do the random ordering in the outer query:

```sql
SELECT * FROM (
  SELECT DISTINCT b.id, b.title, ... FROM ... 
) t ORDER BY random() LIMIT 5
```

Found 2026-11-06 while sampling random embedded listings for The Walk's seed query.
