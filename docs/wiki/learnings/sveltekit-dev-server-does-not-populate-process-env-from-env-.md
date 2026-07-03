---
type: Learning
title: SvelteKit dev server does not populate process.env from .env — load dotenv yourself
description: SvelteKit's Vite dev server does **not** populate `process.env` from your `.env` file. That is what the `$env/*` virtual modules are for. If your server modules
tags: [sveltekit, env, dotenv, postgres, gotcha]
timestamp: "2026-07-03T15:56:27.887Z"
---

# SvelteKit dev server does not populate process.env from .env — load dotenv yourself

SvelteKit's Vite dev server does **not** populate `process.env` from your `.env` file. That is what the `$env/*` virtual modules are for. If your server modules (`src/lib/server/*`) read `process.env.DATABASE_URL` directly, the value is **undefined under `vite dev`**, even though the file exists and `.env.example` documents it.

This is the converse of [[env-dynamic-private-breaks-under-plain-tsx-use-process-env-i]] — you can't use `$env/dynamic/private` (breaks under plain `tsx` scripts) *or* bare `process.env` (empty under Vite dev) without help.

## Symptom
With `postgres()` and no connection string passed, the driver falls back to `localhost:5432`. `localhost` resolves to both `127.0.0.1` and `::1`; with nothing listening, both are refused. Node surfaces this as:

```
AggregateError [ECONNREFUSED]
    at internalConnectMultiple (node:net:...)
    at afterConnectMultiple (node:net:...)
```

That `AggregateError` + `internalConnectMultiple`/`afterConnectMultiple` signature is the tell: it connected to **localhost**, i.e. the env var was undefined — not a transient network blip or a wrong Railway proxy.

## Why standalone scripts worked
`npx tsx scripts/embed-bookmarks.ts` worked because the script calls `dotenv.config()` itself. A one-off `node -e "...postgres()..."` probe worked for the same reason. The dev server path has no such call.

## Fix
Add one line to the shared db module — `dotenv/config` only **adds** missing vars, it never overrides ones already set, so scripts/CI/`adapter-node` runtime (where env is injected) are unaffected:

```ts
// src/lib/server/db/index.ts
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
// ...
```

## Source
- `src/lib/server/db/index.ts` — `import 'dotenv/config'` added at top
