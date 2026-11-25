---
type: Learning
title: "Drizzle's sql tag has no .json() — use explicit JSON.stringify(...)::jsonb casts"
description: Discovered 2026-11-06 during The Drum slice A seed (`scripts/` feeding `feed_items` jsonb payloads).
tags: [[drizzle, postgres-js, jsonb, gotcha]]
timestamp: "2026-11-06T20:13:46.640Z"
---

# Drizzle's sql tag has no .json() — use explicit JSON.stringify(...)::jsonb casts

Discovered 2026-11-06 during The Drum slice A seed (`scripts/` feeding `feed_items` jsonb payloads).

**The gotcha:** drizzle-orm's `sql` template tag exposes **no `.json()` helper**. That helper belongs to the **postgres-js client** (`sql.json(...)`), which is the subject of [[learnings/postgres-js-double-encodes-plain-strings-sent-to]] — easy to mix up because both are imported as `sql`.

**The fix:** in a drizzle raw `sql` template, write jsonb with an explicit stringify + cast:

```ts
sql`insert into feed_items (payload) values (${JSON.stringify(payload)}::jsonb)`
```

Passing a plain JS string instead re-triggers the postgres-js double-encoding problem the earlier learning describes.

**Applies to:** any seed/backfill script or server module writing `jsonb` columns through drizzle raw `sql` templates in this repo.
