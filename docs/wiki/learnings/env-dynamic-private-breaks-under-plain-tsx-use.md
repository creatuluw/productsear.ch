---
type: Learning
title: $env/dynamic/private breaks under plain tsx — use process.env in shared server modules
description: SvelteKit's `$env/dynamic/private` is a **virtual module resolved only by the SvelteKit Vite pipeline**. Importing it from a standalone script run via `tsx` (e.
tags: [sveltekit, env, tsx, gotcha]
timestamp: "2026-07-03T14:41:28.829Z"
---

# $env/dynamic/private breaks under plain tsx — use process.env in shared server modules

SvelteKit's `$env/dynamic/private` is a **virtual module resolved only by the SvelteKit Vite pipeline**. Importing it from a standalone script run via `tsx` (e.g. a backfill script) fails to resolve.

If server modules (`db`, `embeddings`) are imported by both the SvelteKit app AND plain scripts, use `process.env.X` instead. It behaves identically under `adapter-node` at runtime (env is injected the same way) and unblocks scripts.

Discovered when running `npx tsx scripts/embed-bookmarks.ts --dry-run`; switched `src/lib/server/db/index.ts` and `embeddings.ts` to `process.env`.
