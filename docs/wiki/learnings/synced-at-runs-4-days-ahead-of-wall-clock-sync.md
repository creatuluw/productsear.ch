---
type: Learning
title: synced_at runs ~4 days ahead of wall clock; sync rewrites all rows every pass
description: "Discovered 2026-10-31 while answering "has the repo/db been updating lately?":"
tags: [synced_at, clock-skew, raindrop, sync, bookmarks, gotcha, freshness]
timestamp: "2026-11-01T00:12:49.153Z"
---

# synced_at runs ~4 days ahead of wall clock; sync rewrites all rows every pass

Discovered 2026-10-31 while answering "has the repo/db been updating lately?":

**1. `bookmarks.synced_at` runs ~4 days AHEAD of wall-clock time.** On 2026-10-31 (actual date), `max(synced_at)` was already 2026-10-31+skew — timestamps landed ~4 days in the future. The external Raindrop sync's source clock is skewed, but updates are monotonic, so the mirror is still current. **Implication:** never judge sync staleness by comparing `synced_at` against `now()` — a naive check would falsely conclude the sync is "syncing from the future" or mis-handle deltas. Use `max(synced_at)` trends / monotonicity, or the embedding gap, instead.

**2. The sync touches ALL rows on every pass.** Each sync run rewrites `synced_at` for the whole table, so queries like `count(*) WHERE synced_at > now() - interval '30 days'` match ~100% of rows and are useless for finding new bookmarks. The right signal for "freshly added, not yet processed" is **missing embeddings**: e.g. 2026-10-31 check showed 3,764 bookmarks vs 3,760 embeddings → 4 new bookmarks awaiting the (re-enabled) daily embed cron.

Related: [[raindrop-db-sync-runs-outside-this-repo-published]], [[bookmarks-table-is-a-read-only-mirror-the-raindrop]], [[daily-embed-new-bookmarks-workflow]], [[github-disables-scheduled-workflows-after-60-days]].
