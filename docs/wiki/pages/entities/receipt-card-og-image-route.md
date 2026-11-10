---
type: Entity
title: Receipt-card OG image route
description: Receipt-card OG image route
tags: [feed, og-images, receipt-cards, api, the-drum, share-cards]
timestamp: "2026-11-07T12:12:53.578Z"
---

# Receipt-card OG image route

# Receipt-card OG image route

## What it is

The server endpoints that render designed 1200×630 OG `image/png` cards so social shares (Bluesky et al.) unfurl into an image carrying the argument, not just the title — now **two routes sharing one card builder** (redesigned 2026-11-07):

- `src/routes/api/feed/og/listing/[id]/+server.ts` — receipt-card shares from listings and feed cards (slice D, commit `2a72c2a`)
- `src/routes/api/feed/og/drum/+server.ts` — `/feed` shares: corpus-readout Drum items share the `/feed` URL, which previously had **no og:image at all** ("The corpus drafts. The drum keeps time." card)
- `src/lib/server/og` — the shared card builder both routes render from

## Details

- **Location**: routes above + shared builder `src/lib/server/og`
- **Renderer**: hand-built SVG string → PNG via `@resvg/resvg-js` (native NAPI, no wasm) — per [the renderer ADR](../../decisions/receipt-card-og-images-hand-built-svg-resvg-resvg-js-replace.md); this resvg version takes `fontFiles` paths, not buffers.
- **Card anatomy (2026-11-07 redesign)**: hairline type chip → one accent tick in #0021FF → 60px Hanken Grotesk SemiBold headline (tight tracking) → ink-soft standfirst (width-based word wrap) → hairline footer (`domain` left, `productsear.ch · the drum` in accent, right). The heavy full-height blue stripe was dropped; the mascot anchors the right band (~220px, RGBA-verified).
- **Fonts**: self-hosted `static/fonts/HankenGrotesk-{Regular,SemiBold}.ttf` + `MartianMono-Std{Rg,Bd}.ttf` (OFL, license note at `static/fonts/LICENSE.txt`). Martian Mono comes from **`evilmartians/mono`** releases (not gstatic); resvg family name is `Martian Mono Std Rg`.
- **Chip text**: display names via the `FEED_TYPE_BY_SLUG` registry, never the raw `f.type` slug (raw slugs render as `IMPRESS-THE-BOSS`).
- **Colors**: hex constants matching the site identity (`#F9FBFA` canvas, `#0021FF` accent) — deliberately hardcoded in SVG: an OG image is an asset, not app CSS.
- **Consumers**: `/listings/[id]` and feed-card surfaces emit `og:image` / `twitter:card` meta; the `/feed` page now carries full `og:`/`twitter:` meta; the Bluesky share button composes with the stack URL.

## Relationships

- [the-drum-feed](./the-drum-feed.md) — the feed surface whose items these cards preview; receipt-cards item type and `/feed` shares both unfurl through this system
- [product-search-mascot-illo-character-pack](./product-search-mascot-illo-character-pack.md) — anchors the right band of every card
- [admin-feed-console-admin-feed](./admin-feed-console-admin-feed.md) — the queue items whose share flow leads here

## Lifecycle

- First added: 2026-11-06 — slice D, commit `2a72c2a`, after the `@vercel/og` → resvg pivot.
- **2026-11-07 redesigned** (commit `faf3818`): shared builder module extracted, drum OG route added (coverage gap closed), card redesigned to the two-voice elegant composition, and the real TTFs committed after the committed-fonts-were-EOT-garbage incident (root cause of the blank first unfurl).
