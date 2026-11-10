---
type: Rule
title: Back up and dry-run the restore before any destructive bulk delete
description: "**Guideline:** Before a destructive bulk DELETE against `te9_dev` (e.g. wiping a table like `feed_items`), run the three-step interlock — and prove the restore "
tags: [database, data-safety, rollback, bulk-mutation, te9-dev]
timestamp: "2026-11-07T12:26:23.426Z"
---

# Back up and dry-run the restore before any destructive bulk delete

**Guideline:** Before a destructive bulk DELETE against `te9_dev` (e.g. wiping a table like `feed_items`), run the three-step interlock — and prove the restore **before** deleting, because after a delete there is no derived data to regenerate:

1. **Back up the exact rows** — full JSON dump (ids, payloads, signals, timestamps) to `.work/` (e.g. `.work/feed-items-backup-<timestamp>.json`).
2. **Write a restore tool** that re-inserts from the backup, and **dry-run it inside a rolled-back transaction** against the live DB — verify inserted counts match the backup, then ROLLBACK.
3. **Only then delete**, and verify the post-state (row count 0, dependents untouched).

**Gotcha:** the intentional ROLLBACK at the end of a dry-run is usually thrown as an error — that non-zero exit breaks `&&` command chains. Make the dry-run script catch the intentional rollback and **exit cleanly (0)** so the backup → dry-run → wipe chain runs unattended.

**When it applies:** any `DELETE` (not just generated-row cleanup) committed for real. Complements [[rules/prepare-and-dry-run-the-rollback-script-before-generating-de]] (derived-row undo scripts) and [[rules/validate-generated-sql-inserts-with-a-rollback-wrapped-dry-r]] (insert dry runs) — together the te9_dev bulk-mutation safety family.

**Evidence:** 2026-11-07 Drum wipe — 10 `feed_items` rows backed up, restore dry-run verified 10/10 in a rolled-back transaction, then wiped; rotation confirmed reset and due-now afterward.
