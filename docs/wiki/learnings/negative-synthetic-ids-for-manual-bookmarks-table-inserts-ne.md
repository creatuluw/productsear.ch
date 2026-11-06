---
type: Learning
title: Negative synthetic ids for manual bookmarks-table inserts (never collide with the external sync)
description: "**The convention (set 2026-11-06):** when manually inserting rows into `te9_dev.bookmarks` (normally an external-sync mirror), use **negative synthetic ids**: `"
tags: [database, bookmarks, synthetic-ids, convention, sync]
timestamp: "2026-11-06T09:09:39.959Z"
---

# Negative synthetic ids for manual bookmarks-table inserts (never collide with the external sync)

**The convention (set 2026-11-06):** when manually inserting rows into `te9_dev.bookmarks` (normally an external-sync mirror), use **negative synthetic ids**: `id = raindrop_id = -1, -2, …`.

Why this works:

- The external sync's sequences are strictly positive: internal `id` runs 1–2,413,234 (≠ `raindrop_id` — they are separate sequences, never equal in real rows), `raindrop_id` runs 363M–1.9B. A snowflake-style growth of Raindrop ids means any *positive* synthetic raindrop_id in a "plausible" range can eventually collide; negatives never can.
- Fixed synthetic ids + `ON CONFLICT (id) DO NOTHING` make the insert file idempotent.
- Keep `synced_at = now()`, `type = 'link'`, and copy `raindrop_created_at` from the source export so chronological ordering stays truthful.

Caveat: if the external sync is ever switched to full DELETE+reload (instead of upsert-by-raindrop_id), mirror rows vanish — keep the generating SQL re-runnable. First applied by `scripts/insert-missing-repos-active-30d.sql` (see [[insert-missing-repos-active-30d-sql]]).
