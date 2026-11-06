---
type: Learning
title: postgres-js double-encodes plain strings sent to jsonb — use sql.json()
description: When writing to a `jsonb` column through Drizzle's postgres-js driver using a raw `sql` template, passing a plain JS string makes postgres-js serialize it as a 
tags: [postgres, postgres-js, drizzle, jsonb, gotcha]
timestamp: "2026-11-01T01:12:01.420Z"
---

# postgres-js double-encodes plain strings sent to jsonb — use sql.json()

When writing to a `jsonb` column through Drizzle's postgres-js driver using a raw `sql` template, passing a plain JS string makes postgres-js serialize it as a JSON *scalar* — the column ends up double-encoded (a JSON document wrapping a string, e.g. `"[\"a\",\"b\"]"` as a string, not an array).

**Fix**: wrap the value in `sql.json(value)` so it is sent as structured JSON:

```ts
await db.execute(sql`INSERT INTO te9_dev.bookmark_archetypes (...) VALUES (${id}, ${sql.json(archetypes)})`);
```

**Evidence**: the archetype backfill (2026-11-01) hit exactly this when passing JSON-stringified arrays; `sql.json()` fixed it.

**Applies to**: any raw-SQL `jsonb` write in this repo (backfills, migrations run via tsx).
