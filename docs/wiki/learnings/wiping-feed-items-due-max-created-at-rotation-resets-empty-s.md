---
type: Learning
title: "Wiping feed_items: due = max(created_at), rotation resets, empty state degrades gracefully"
description: Discovered 2026-11-07 while wiping all Drum items and handing the surface back to the normal draw flow.
tags: [the-drum, feed-draw, rotation, wipe, empty-state, operations]
timestamp: "2026-11-07T12:26:23.427Z"
---

# Wiping feed_items: due = max(created_at), rotation resets, empty state degrades gracefully

Discovered 2026-11-07 while wiping all Drum items and handing the surface back to the normal draw flow.

**The draw-due mechanics (from `src/lib/server/feed/rotation`):**

- `due` is computed from **`max(created_at)` over `feed_items`** vs the configured cadence — not from a separate scheduler state. After a full wipe there is no `created_at`, so `last draw=never` and the drum is **DUE immediately**.
- The round-robin **type cursor resets to 0** on an empty table — the next draw restarts from the **top of the configured order** (The Pulse as of the 2026-11-07 wipe).
- Repopulation is fully owned by the normal flow: the nightly `feed-draw` cron (`.github/workflows/feed-draw.yml`, 09:07 UTC) or a forced `POST /api/feed/draw?force=1` from the admin gate. `feed_settings` (cadence/order/flags) survives the wipe; `search_misses` (The Floor's data) is independent of `feed_items` and untouched.

**Empty-state degradation is graceful by design:** with zero `feed_items`, `/feed` shows its empty state ("The drum hasn't drawn yet — the first items arrive with the next due draw"), the homepage drum section hides entirely, and OG endpoints for wiped listings (`/api/feed/og/listing/[id]`) return 404. No dangling links or broken cards anywhere.

**Restore proven before the wipe:** 10 rows backed up to `.work/feed-items-backup-2026-11-07T12-25-03-519Z.json`; `.work/feed-items-tool.ts restore <backup-file>` re-inserts them (dry-run verified 10/10 in a rolled-back transaction). `.work/` is local scratch — the tool/backup may not persist; the procedure (see the destructive-bulk-delete rule) is what carries over.
