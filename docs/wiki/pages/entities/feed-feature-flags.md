---
type: Entity
title: Feed feature flags
description: Two admin-toggled visibility flags on te9_dev.feed_settings (nav_enabled, homepage_cards_enabled) that show/hide The Drum's nav link and homepage latest-3 block — /feed itself stays reachable.
tags: [feed, feature-flags, admin, the-drum]
timestamp: "2026-11-06T20:33:47.622Z"
---

# Feed feature flags

## What it is

Two admin-controlled **visibility feature flags** for The Drum's public surfaces, shipped in slice E (commit `2a72c2a`) when the user asked to be able to turn the feed off without deleting it:

- **`nav_enabled`** — whether the `feed` link appears in the site nav (`src/routes/+layout.server.ts` exposes it; `+layout.svelte` hides the link when off).
- **`homepage_cards_enabled`** — whether the homepage shows the 3 latest feed cards in the center space below the TRY chips (`src/routes/+page.server.ts` skips the feed query when off; `+page.svelte` hides the block).

## Key properties

- **Visibility flags, not kill switches** — `/feed` itself stays reachable when both are off; only the nav entry and homepage block hide.
- Both default **on** (`row?.x ?? true` in `src/lib/server/feed/queries.ts`), so existing deployments/DB rows behave as before.
- Toggled from the `/admin/feed` settings form as `nav_enabled` / `homepage_cards_enabled` checkboxes, persisted via the existing settings `patch` path.

## Details

- **Location**: columns on `te9_dev.feed_settings` (`scripts/migration-feed-flags.sql`); read/write helpers in `src/lib/server/feed/queries.ts`; UI in `src/routes/(admin)/admin/feed/+page.svelte`.
- **Configuration**: admin toggles at `/admin/feed` (see [admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md)).
- Smoke-tested both directions on the production build (off → verify hidden → back on → verify restored) per the house gates.

## Relationships

- [the-drum-feed](./the-drum-feed.md) — the feature these flags show/hide
- [admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) — the console where the toggles live
- [admin-console-admin](./admin-console-admin.md) — the platform console the feed console sits in

## Lifecycle

- First added: 2026-11-06 — user request "turn the feed nav and cards on the homepage to inactive so then they are hidden"; shipped with slices D+E in commit `2a72c2a`.
