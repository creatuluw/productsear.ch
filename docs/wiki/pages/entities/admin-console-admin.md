---
type: Entity
title: Admin console (/admin)
description: What it is
tags: [admin, auth, better-auth, console]
timestamp: "2026-11-06T14:18:37.245Z"
---

# Admin console (/admin)

## What it is

`/admin` — the authenticated platform console of productsear.ch ("platform console" in the UI), for managing extensions, agents, settings, and feature flags. Entry point is the `ShieldCogCorner` icon in the site header (auth required to get in).

## Details

- **Location**: `src/routes/(admin)/admin/*` (guarded pages) and `src/routes/(auth)/admin/login/` (sign-in/sign-up, outside the guard so it can't loop)
- **Auth**: better-auth 1.7.18 email+password. Server instance `src/lib/server/auth.ts`; catch-all handler `src/routes/api/auth/[...all]/+server.ts` (GET/POST `/api/auth/*`); browser client `src/lib/auth-client.ts` (better-auth/svelte)
- **Admin gate**: `ADMIN_EMAILS` env (comma-separated allowlist). Sign-up is rejected server-side via a better-auth `before` hook for non-allowlisted emails; page loads are guarded by `(admin)/admin/+layout.server.ts`, and every form action re-guards itself via `requireAdmin()` in `src/lib/server/admin-guard.ts` (actions can be POSTed without a load)
- **DB tables** ([corpus-enrichment-pipeline-sync-crawl-analyze](./corpus-enrichment-pipeline-sync-crawl-analyze.md) schema te9_dev): `auth_user`, `auth_account`, `auth_session`, `auth_verification` (better-auth, prefix `auth_`, model-name mapping via drizzleAdapter) + app-owned `admin_extensions`, `admin_agents`, `admin_settings`, `admin_features` (multi-entry in `src/lib/server/db/admin-schema.ts`, re-exported from `db/index.ts`)
- **Migration**: `scripts/migration-admin.sql` (idempotent, seeds 3 flags + 2 settings), applied via the reusable `scripts/run-sql.ts` runner (dry-run = transaction rollback, `--commit` to persist). Undo: `scripts/rollback-migration-admin.sql`
- **Section routes**: `/admin` (dashboard: corpus vitals + counts), `/admin/extensions`, `/admin/agents`, `/admin/settings`, `/admin/features` — all SvelteKit form actions (`?/create`, `?/toggle|update|upsert`, `?/delete`) with `use:enhance`
- **Read helpers**: `src/lib/server/admin-settings.ts` — `getSetting(key)` and `getFlag(key)` with a 30s in-memory cache + `clearSettingsCache()` (called after every admin write) for production code that wants to consume console-managed values
- **Icon**: `src/lib/components/icons/ShieldCogCorner.svelte` — NOT an upstream lucide icon (absent in lucide-svelte 1.0.1); composed from lucide's own shield + cog path data so it matches the lucide stroke style
- **Env**: `BETTER_AUTH_SECRET` (required), `ADMIN_EMAILS`, `BETTER_AUTH_URL` (optional), `TRUSTED_ORIGINS` (extra, comma-separated). Local ports (localhost 3000/5173) are auto-allowed outside production

## Gotchas that shaped this

- adapter-node CSRF: production needs `ORIGIN` env set, else http-form POSTs are rejected as cross-site (url.origin defaults to https)
- The shared postgres client now pins `search_path: te9_dev,public` (`src/lib/server/db/index.ts`) — required for drizzle's unqualified table names to hit the te9_dev schema
- better-auth needs `zod` v4 (top-level) and `@opentelemetry/api` installed, or the built server chunk breaks at runtime

## Related

- [hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md) — the search pipeline whose flags/settings the console manages
- [remove-ask-mode-productsear-ch-becomes-search-only](../../decisions/remove-ask-mode-productsear-ch-becomes-search-only.md) — why the ai SDK deps could be dropped
