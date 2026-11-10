---
type: Entity
title: Admin feed console (/admin/feed)
description: What it is
tags: [[admin, feed, the-drum, editorial-workflow, crud]]
timestamp: "2026-11-06T20:27:00.787Z"
---

# Admin feed console (/admin/feed)

## What it is

`/admin/feed` — the editorial console for [pages/entities/the-drum-feed](./the-drum-feed.md), inside the admin platform console. This is the **human gate** of the machine-drafted feed: admins draw cards on demand, edit any card inline before or after publication, work the per-item approval dial, publish / retract / delete, and configure the drum's cadence, round-robin order, and Digest toggle.

## Why it matters

The Drum is machine-drafted but human-gated (spec Q12): a curator can edit, gate, retract, or delete any card. This console is that gate — and the escape hatch when a generator draws something off-brand (the first live example: an Impress-the-Boss card drawn on a saved Google Maps link during rotation wrap-around; the retract button exists precisely for that call).

## Details

- **Location**: `src/routes/(admin)/admin/feed/+page.server.ts` + `+page.svelte` — inside the `(admin)` guard layout; every action re-guards itself via `requireAdmin()` (`src/lib/server/admin-guard.ts`) because actions can be POSTed without a load
- **Load**: last 200 items (typeName resolved server-side — the Svelte component must not import `$lib/server`, per [rules/sveltekit-blocks-lib-server-imports-in-client](../../learnings/sveltekit-blocks-lib-server-imports-in-client.md)), current feed settings, due info, the type roster and default round-robin order
- **Form actions** (SvelteKit actions, all admin-gated):
  - `?/save` — inline-editor patch of body fields (headline / standfirst / question / paragraphs split on blank lines); untouched jsonb keys survive; headline required
  - `?/toggleApproval` — the per-item approval dial (`requires_approval`)
  - `?/publish` / `?/retract` — status `published` ⇄ `draft`
  - `?/delete` — remove the row
  - `?/drawNow` — run the drum immediately, bypassing the cadence clock (`drawNext(true)`); fails with a clear message when every generator comes up empty
  - `?/settings` — cadence hours (integer 1–720), Digest on/off, round-robin type order (slug per line, validated against `FEED_TYPES`, deduped)
- **Mutations**: all item/settings queries live in `src/lib/server/feed/queries.ts` (`listAllItems`, `patchItemBody`, `setItemApproval`, `setItemStatus`, `deleteItem`, `updateFeedSettings`, `getFeedSettings`)

## Relationships

- [pages/entities/admin-console-admin](./admin-console-admin.md) — the platform console this section lives in (same allowlist gate, better-auth session)
- [pages/entities/the-drum-feed](./the-drum-feed.md) — the feed this console curates
- [pages/artifacts/the-drum-feed-spec](../artifacts/the-drum-feed-spec.md) — spec Q12 (approval dial) and Q8 (cadence config) this implements

## Lifecycle

- First added: 2026-11-06 — The Drum slice B (commit `a12812e`), implementing the editorial workflow converged in the spec at `docs/specs/the-drum.md`.
