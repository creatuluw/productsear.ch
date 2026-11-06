---
type: Learning
title: SvelteKit blocks $lib/server imports in client components — even for pure-data modules
description: SvelteKit refuses `$lib/server/*` imports from client-side code (`+page.svelte`) at dev/build time — **even when the module contains no server dependencies at a
tags: [sveltekit, gotcha, module-organization]
timestamp: "2026-11-01T01:27:44.055Z"
---

# SvelteKit blocks $lib/server imports in client components — even for pure-data modules

SvelteKit refuses `$lib/server/*` imports from client-side code (`+page.svelte`) at dev/build time — **even when the module contains no server dependencies at all** (pure data/regex tables). `archive/+page.svelte` imported `$lib/server/archetypes` and was blocked, because the `server` folder is a hard server-only boundary, not a dependency analysis.

**Convention**: only put a module under `$lib/server/` if it must stay server-only (secrets, DB access). Shared pure-data modules belong in plain `$lib/`. The archetype roll-up tables were moved to `src/lib/archetypes.ts` accordingly.
