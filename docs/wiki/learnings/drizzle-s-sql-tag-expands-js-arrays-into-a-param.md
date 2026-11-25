---
type: Learning
title: Drizzle's sql tag expands JS arrays into a param tuple — not an array literal
description: "**The gotcha (2026-11-06, The Drum slice C):** interpolating a JS array into a drizzle `sql` template sends it as a list of separate bind parameters (a PG tuple"
tags: [[drizzle, postgres, sql, gotcha, feed]]
timestamp: "2026-11-06T20:27:00.786Z"
---

# Drizzle's sql tag expands JS arrays into a param tuple — not an array literal

**The gotcha (2026-11-06, The Drum slice C):** interpolating a JS array into a drizzle `sql` template sends it as a list of separate bind parameters (a PG tuple), not an `int[]` value. Any context that needs a real array — `<> ALL(...)`, array operators — fails with a type error like `operator does not exist: integer <> record`.

Hit in the Walk generator: `e.bookmark_id <> ALL(${exclude})` where `exclude` is a `number[]`.

**Fix** (`src/lib/server/feed/generators/walk.ts`): build the array literal explicitly — `ARRAY[1,2,3]::int[]` interpolated via `sql.raw()` — filtering values with `Number.isInteger` first so nothing unvalidated reaches the SQL string. For plain `IN (...)` lists prefer drizzle's `inArray()` helper instead of hand-rolling.

Related: [[learnings/drizzle-s-sql-tag-has-no-json-use-explicit-json-stringify-js]] (same family: drizzle sql tag needs explicit type handling at the boundary).
