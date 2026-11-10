---
type: Learning
title: Standalone tsx scripts hang after success — close the postgres pool or call process.exit()
description: Discovered 2026-11-06 while seeding The Drum (`feed-draw` seed script run via tsx).
tags: [[tsx, postgres-js, scripts, gotcha]]
timestamp: "2026-11-06T20:13:46.640Z"
---

# Standalone tsx scripts hang after success — close the postgres pool or call process.exit()

Discovered 2026-11-06 while seeding The Drum (`feed-draw` seed script run via tsx).

**The gotcha:** a standalone tsx script that imports the repo's shared postgres client never exits after its work completes — the postgres-js pool stays open and the process hangs with no error, looking like a failed run even though the inserts landed.

**The fix:** end standalone tsx scripts with an explicit `process.exit(0)` (after the final verification/commit step), or explicitly close the pool if the script owns one.

**Bonus gotcha (same session):** `tsx -e "..."` cannot top-level-await when running as CJS — quick DB count checks via `-e` silently don't work; write a temp script file and run it instead.

**Related tsx gotchas in this repo:** [[learnings/await-dotenv-imports-anchor-env-path]] (dotenv import + `.env` path) and [[learnings/env-dynamic-private-breaks-under-plain-tsx-use]] (`$env/dynamic/private` unavailable under plain tsx).
