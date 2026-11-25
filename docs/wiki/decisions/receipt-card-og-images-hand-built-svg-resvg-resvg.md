---
type: Decision
title: "Receipt-card OG images: hand-built SVG + @resvg/resvg-js (replaces broken-outside-Vercel @vercel/og)"
description: Context
tags: [feed, the-drum, og-images, receipt-cards, rendering, slice-d]
status: accepted
timestamp: "2026-11-06T20:33:40.064Z"
---

# Receipt-card OG images: hand-built SVG + @resvg/resvg-js (replaces broken-outside-Vercel @vercel/og)

## Context

Slice D of [the-drum](../pages/entities/the-drum-feed.md) needed **receipt cards** — 1200×630 OG PNGs so Bluesky shares of feed cards unfurl into a designed image. `@vercel/og` (satori + resvg bundled) was installed first as the obvious choice.

## The choice

**Hand-built SVG rendered to PNG by `@resvg/resvg-js`** at `/api/feed/og/listing/[id]`, with self-hosted Hanken Grotesk TTFs (OFL, license note in `static/fonts/LICENSE.txt`) for deterministic text rendering. `@vercel/og` was uninstalled.

## Alternatives considered and why they failed

- **`@vercel/og`** — broken outside Vercel's runtime: (1) its `hb.wasm` (shipped in the `harfbuzzjs` package) must sit at the process CWD, and even after copying it, (2) the bundled ESM does dynamic `require`s that fail in plain Node. Two fatal blockers on Railway's `adapter-node`.
- **sharp** — not a direct dependency; would add a heavy native dep just for this.

## Rationale

`@resvg/resvg-js` is a native (NAPI) renderer with no wasm games, accepts an SVG string plus `fontFiles`, and renders deterministically — exactly what a server OG endpoint needs on any host. SVG is hand-built (satori's element *objects*, not JSX, would be needed in plain `.mjs`; the route just builds SVG strings with an escape helper and a width-based word-wrap assuming Hanken Grotesk ~0.52em/char).

## Consequences

- The route uses **hex colors hardcoded from the site identity** (`#F9FBFA` canvas, `#0021FF` accent, etc.) — deliberate: an OG image is an asset, not app CSS, so the semantic-token rule doesn't reach into SVG (noted in the file header).
- This `@resvg/resvg-js` version wants **`fontFiles` paths, not buffers** — fonts are read from `static/fonts/` at render time.
- Fonts ship in-repo (`static/fonts/HankenGrotesk-{Regular,SemiBold}.ttf`, ~57KB each), fetched from Google Fonts via the css2 TTF trick (see [the gstatic TTF learning](../learnings/gstatic-css2-api-serves-ttf-urls-with-an-old-user-agent.md)) — no runtime CDN dependency, deterministic rendering.
- Stack pages (`/listings/[id]`, feed cards) emit the right `og:image`/`twitter:card` meta so Bluesky unfurls work.

Commit `2a72c2a`.
