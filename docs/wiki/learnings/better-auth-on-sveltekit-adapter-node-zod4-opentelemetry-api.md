---
type: Learning
title: "better-auth on SvelteKit adapter-node: zod4 + @opentelemetry/api must be installed"
description: "Two runtime crashes when deploying better-auth 1.7.18 in a SvelteKit @sveltejs/adapter-node build (2026-11-06):"
tags: [better-auth, zod, otel, adapter-node, build]
timestamp: "2026-11-06T14:18:49.894Z"
---

# better-auth on SvelteKit adapter-node: zod4 + @opentelemetry/api must be installed

Two runtime crashes when deploying better-auth 1.7.18 in a SvelteKit @sveltejs/adapter-node build (2026-11-06):

1. **`sessionSchema.loose is not a function`** during the build's postbuild analyse — the bundle mixed the hoisted zod 3.25.76 (no `.loose()`) with better-auth's nested zod 4.6.7 (`z.looseObject` resolved from v4 while `sessionSchema`'s zod import resolved to v3). Fix: add `zod@^4` as a DIRECT dependency so the two versions settle into non-conflicting positions (top-level v4 for better-auth, nested 3.25.76 for packages pinning v3). As a bonus this surfaced that `ai`/`@ai-sdk/openai` v4 (peer zod ^3) had zero imports in the codebase since Ask mode was removed — removed them instead of fighting the peer conflict.

2. **`Cannot read properties of undefined (reading 'getTracer')` / `reading 'ERROR'`** at runtime — better-auth's instrumentation does a lazy `await import("@opentelemetry/api")` with a noop fallback, but with @opentelemetry/api absent and better-auth bundled into a server chunk, the fallback is defeated. Fix: install `@opentelemetry/api` (it's a soft peer) so the dynamic import succeeds. Alternative would be `experimental.instrumentation.enabled = false` in betterAuth options.

Also relevant: adapter-node form-action CSRF rejects POSTs when `ORIGIN` env isn't set (url.origin defaults to https).
