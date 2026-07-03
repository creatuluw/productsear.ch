---
type: Learning
title: postgres-js db.execute() returns rows directly, not { rows }
description: When using Drizzle's postgres-js driver, `db.execute(sql\`...\`)` returns the **row array directly**, not an object with a `.rows` property (unlike the `pg`/nod
tags: [drizzle, postgres-js, gotcha]
timestamp: "2026-07-03T14:41:28.829Z"
---

# postgres-js db.execute() returns rows directly, not { rows }

When using Drizzle's postgres-js driver, `db.execute(sql\`...\`)` returns the **row array directly**, not an object with a `.rows` property (unlike the `pg`/node-postgres driver). Destructuring `.rows` silently returns `undefined`.

Discovered while wiring `/api/search` — the hybrid RRF query came back empty until `.rows` was dropped. Fixed in `src/lib/server/search.ts`.

Applies to any `db.execute` call under the postgres-js driver.
