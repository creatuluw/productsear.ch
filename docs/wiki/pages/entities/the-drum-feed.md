---
type: Entity
title: The Drum feed
description: The Drum feed
tags: [feed, the-drum, listings, editorial-workflow, slices-a-b-c-live, cron]
timestamp: "2026-11-09T15:22:41.806Z"
---

# The Drum feed

# The Drum feed

**The Drum** is productsear.ch's corpus-narrated magazine feed — a machine-drafted, human-gated stream of 11 item types — 10 drawing today — published on a 2-day draw cadence. The mechanic is the masthead: the drum opens every 2 days, the tombola draws from it, and [pages/entities/product-search-mascot-illo-character-pack](./product-search-mascot-illo-character-pack.md) turns the handle; the countdown ("next draw in 31:22:08") is the appointment mechanic.

## What it is

- Lives at `/feed`, linked in the site nav; the homepage center space shows the 3 latest cards (slice E, gated by [pages/entities/feed-feature-flags](./feed-feature-flags.md)), which vanish the moment a search starts.
- Every item is machine-drafted from the [pages/concepts/hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md) corpus and human-gated: draft → inline editor → per-item approval toggle → publish (gate-off items publish automatically).
- Every card links to its listing's stack — the stacks are the depth surface (`/listings/[id]`); the stream is the appointment surface.

## The 11 item types — 10 drawing (fixed round-robin order)

1. **One Save** — daily anchor — **live, LLM-drafted** (why-it-mattered paragraph + reader question)
2. **Target-User Pitch** — motivation via synthetic persona voices — **live, LLM-drafted**
3. **Two Futures** — real-life before/after — **live, LLM-drafted** (the two Tuesday scenes)
4. **Ambition Path** — multi-listing route to an ambition — **live** (corpus picks the cluster + 5 listings; LLM names the ambition and orders the steps, id-validated)
5. **The Pulse** — 20% content: archetype drift, repo obituaries — **live since slice A**
6. **Receipt cards** — share primitive: claim + proof — **live since slice D** ([pages/entities/receipt-card-og-image-route](./receipt-card-og-image-route.md) renders the OG PNG; Bluesky share button on every card)
7. **Resurrections** — forgotten saves, second life — **live since slice A**
8. **The Walk** — embedding-hop serendipity trail — **live since slice C** (pure pgvector: random seed → 4 nearest-neighbor hops; the Keep Walking mechanic on listing stacks is live since slice A)
9. **The Tombola** — draw from the last 10, corpus-derived scoring — **live since slice A**
10. **The Floor** — 20% content: aggregated search misses, themes only — **live since slice A**
11. **Impress the Boss** — real artifact output — **live, LLM-drafted**, origin-tagged `described-from-analysis`

## Why it matters

The Drum turns a static search corpus into a narrated, cadenced surface that gives people a reason to return without an account — serving novelty, emotion, real-life improvement, ambition, tech insight, and a 20% unexpected-data quotient. The Digest (email via [pages/entities/utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md)) extends it off-site, dark by default and admin-activated.

## Details

- **Status**: **slices A–E implemented and live** — slice A `682ab37` (data core, `/feed`, listing stacks, 4 data generators), slices B+C `a12812e` (admin feed console, all 10 generators, LLM drafting, `/feed/methodology`), D+E `2a72c2a` (receipt-card OG images via [pages/entities/receipt-card-og-image-route](./receipt-card-og-image-route.md), Bluesky share buttons, homepage latest-3 cards, [pages/entities/feed-feature-flags](./feed-feature-flags.md)). Migration + seed ran against the shared Railway DB, so production picks it up immediately. Slice E `29fa3a8` then shipped the Digest end-to-end — opt-in subscribers, token unsubscribe, windowed send cursor, admin send-now, weekly cron (see [the-digest-email-digest-pipeline](./the-digest-email-digest-pipeline.md)) — and commits `b75116c`/`746f2a2` redesigned `/feed` and the stack pages around the nine Gestalt principles ([decisions/redesign-the-drum-feed-around-the-nine-gestalt-principles](../../decisions/redesign-the-drum-feed-around-the-nine-gestalt-principles.md)). Remaining: a visual pass on the OG card after a real unfurl.
- **Data core**: `te9_dev.feed_items`, `feed_settings`, `search_misses` tables — dry-run'd then committed via the house `run-sql.ts`.
- **Server core**: `src/lib/server/feed/` — types, queries, rotation (catch-and-skip: a failing generator skips its slot instead of blocking the draw), stack queries.
- **LLM drafting**: `src/lib/server/feed/llm.ts` — `draftText`/`draftJson` over the analyzer's provider chain (z.ai GLM-5 primary → Railway gateway fallback), temperature 0.8, JSON mode with code-fence repair. Throws on total provider failure so the rotation's catch-and-skip moves on.
- **Generators**: all 10 implemented (registry `src/lib/server/feed/generators/index.ts`). Data-driven since slice A: Resurrections (300–900-day-old saves), The Tombola (last-10 saves scored by archetype drift), The Pulse (drift movers + rising domains), The Floor (aggregated zero-result search themes; waits until `search_misses` accumulate). Slice C: LLM-drafted One Save / Target-User Pitch / Two Futures / Impress the Boss / Ambition Path, plus the LLM-free Walk (pgvector hops).
- **Surfaces**: `/feed` (drum header with cadence/next-draw/next-type + methodology link, type-tagged stream, LlmDoc twin), `/feed/methodology` (the trust surface — "how this drum works", synthetic-personas disclosure; same markdown for human + raw views), `/listings/[id]` (listing context, its feed items, **Keep Walking** into embedding neighbors), and `/admin/feed` (the editorial console) — all with raw-markdown `?view=llm` branches in `llms.ts`, per [rules/keep-view-llm-surfaces-free-of-human-ui-chrome](../../rules/keep-view-llm-surfaces-free-of-human-ui-chrome.md) and [rules/every-view-llm-branch-must-render-an-llm-document](../../rules/every-view-llm-branch-must-render-an-llm-document.md).
- **The drum's hands**: `scripts/feed-draw.ts` (cadence-gated runner, `--force`/`--status`), `.github/workflows/feed-draw.yml` (daily 09:07 UTC cron — **fixed 2026-11-09** after being dead since creation, see lifecycle), `POST /api/feed/draw` (admin-allowlist gated, `?force=1` supported, 403 verified), nav label **`feed · the drum`** (commit `f5945f4`).
- **Configuration**: owned by [pages/entities/admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) — cadence (1 item / 2 days default, 1–720h range), per-item approval dial, Digest toggle (off by default), round-robin type order, the queue with inline editor and publish/retract/delete.
- **Type roster history**: pitched types killed along the way include Ribbon's Diary, Origin card, Same Day Last Year — the roster is closed at 11.

## Relationships

- [pages/entities/admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) — the human gate: draw-now, inline editor, approval dial, publish/retract/delete, settings (slice B)
- [pages/entities/admin-console-admin](./admin-console-admin.md) — the platform console the feed console lives in
- [pages/entities/utobo-email-transactional-email-service](./utobo-email-transactional-email-service.md) — powers The Digest distribution
- [pages/entities/product-search-mascot-illo-character-pack](./product-search-mascot-illo-character-pack.md) — turns the drum handle; visual identity
- [pages/entities/bookmark-archetype-system](./bookmark-archetype-system.md) — source of archetype-drift signals for The Pulse and Tombola scoring
- [pages/entities/collections-pages](./compendium-pages.md) — listing stacks that cards deep-link into
- [pages/artifacts/the-drum-feed-spec](../artifacts/the-drum-feed-spec.md) — the formal converged spec this implementation follows

## Lifecycle

- First added: 2026-11-06 — corpus-feed brainstorm rounds 1–14 ([decisions/add-a-corpus-narrated-magazine-feed-to-productsear-ch-propos](../../decisions/add-a-corpus-narrated-magazine-feed-to-productsear-ch-propos.md) onward)
- Named: 2026-11-06 — round 14, user chose "The Drum"
- Converged: 2026-11-06 — Q15-A closed the pending verdict; formal spec written at `docs/specs/the-drum.md`
- **Slice A implemented: 2026-11-06** — data core (`feed_items`/`feed_settings`/`search_misses`), 4 working generators (Pulse, Resurrections, Tombola, Floor), `/feed` + `/listings/[id]` with `?view=llm` twins, draw runner + cron + admin API. First seed produced 4 draws (transient generator failures were skipped by the rotation's catch-and-skip; duplicate Pulse rows cleaned up afterward).
- **Slices B+C implemented: 2026-11-06** (commit `a12812e`) — admin feed console (`/admin/feed`: queue, inline editor, approval dial, publish/retract/delete, draw-now, cadence/order/Digest settings), all 10 generators drawing (LLM-drafted One Save / Pitch / Two Futures / Impress the Boss / Ambition Path + pgvector Walk), shared drafting helper `feed/llm.ts`, and the `/feed/methodology` trust page. First live LLM-drawn path: "Build a Local AI Companion with Memory and Voice".
- **Slices D+E implemented: 2026-11-06** (commit `2a72c2a`) — receipt-card OG images (hand-built SVG → `@resvg/resvg-js` PNG after the `@vercel/og`-outside-Vercel pivot; self-hosted Hanken Grotesk TTFs), Bluesky share button on every card, homepage latest-3 drum cards (vanish on query), and admin feature flags for the nav link + homepage cards (both default on; visibility flags, `/feed` stays reachable).
- **feed_items wiped, drum reset to the normal flow: 2026-11-07** — all 10 rows backed up to `.work/` and deleted after a dry-run-proven restore (see [rules/back-up-and-dry-run-the-restore-before-any-destructive-bulk-](../../rules/back-up-and-dry-run-the-restore-before-any-destructive-bulk-.md)). `last draw=never` → drum DUE immediately, rotation cursor reset to 0 (next type = The Pulse, top of order); the nightly `feed-draw` cron (09:07 UTC) repopulates. Empty state degrades gracefully everywhere — see [learnings/wiping-feed-items-due-max-created-at-rotation-resets-empty-s](../../learnings/wiping-feed-items-due-max-created-at-rotation-resets-empty-s.md).
- **Draw cron fixed: 2026-11-09** — `.github/workflows/feed-draw.yml` had been invalid YAML since creation (`Drum draw:` — a colon+space inside a plain scalar in the Summary step) → every run a startup failure with **zero jobs**; the 09:07 UTC schedule never fired once (all 14 attempts since 11-06 died), so after the wipe the drum had nothing to draw with. Fixed in commit `5169320` (the same bug was fixed in [the-digest-email-digest-pipeline](./the-digest-email-digest-pipeline.md)'s `digest-send.yml`; failure signature + diagnosis in [learnings/github-actions-invalid-yaml-startup-failure-with-zero-jobs-t](../../learnings/github-actions-invalid-yaml-startup-failure-with-zero-jobs-t.md)). The drum's first real draw ran manually via the cadence-gated script (no force — the clock said DUE): **"The Pulse — what the saves say (November 2026)"** went live ~15:19 UTC; a manual `workflow_dispatch` then proved the fixed workflow green (it correctly skipped — cadence satisfied). Next draw: **2026-11-12 09:07 UTC** (The Resurrections, round-robin advances).
