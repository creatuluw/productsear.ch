---
type: Decision
title: "Elegant shared OG cards: one card builder in $lib/server/og plus a dedicated Drum OG endpoint"
description: Context
tags: [og-images, the-drum, frontend, resvg, share-cards]
status: accepted
timestamp: "2026-11-07T12:12:53.577Z"
---

# Elegant shared OG cards: one card builder in $lib/server/og plus a dedicated Drum OG endpoint

## Context

The first real Bluesky unfurl of a receipt card showed a nearly blank image — a pill, a hairline, and a blue sliver. Root cause: the committed `static/fonts/*.ttf` were EOT garbage from the gstatic legacy-UA trick (the known gotcha), and the real TTFs an earlier session pulled locally were never committed — production rendered shapes but zero text. Separately, corpus-readout Drum items share the `/feed` URL, which had **no og:image at all**, so those shares unfurled with nothing.

## Choice

- Redesign the card and ship it as a **shared builder** `src/lib/server/og`, used by both OG routes. The listing route (`/api/feed/og/listing/[id]`) renders from it, and a new **`/api/feed/og/drum`** endpoint gives `/feed` shares their own card ("The corpus drafts. The drum keeps time."), with full `og:`/`twitter:` meta added to the feed page.
- **Two-voice typography**, mirroring the site: Hanken Grotesk (60px SemiBold headline, tight tracking, standfirst) + Martian Mono (StdRg + StdBd, OFL, pulled from Evil Martians' official repo) carries the type chip, domain, and brand footer.
- **Composition**: hairline type chip → one precise accent tick in #0021FF → big headline → ink-soft standfirst → hairline footer (domain left, `productsear.ch · the drum` in accent, right). The heavy full-height blue stripe is gone; the mascot (~220px, RGBA-verified) anchors the right band.
- Chip text maps slugs through the `FEED_TYPE_BY_SLUG` display-name registry — the OG query's raw `f.type` slug produced `IMPRESS-THE-BOSS`; the feed page's display name reads **IMPRESS THE BOSS**.

## Alternatives considered

- Duplicate per-route renderers — rejected: the two card designs would drift apart.
- Leave `/feed` without og:image — rejected: every corpus-readout drum share unfurled bare.

## Consequences

- The real TTFs are committed (root cause closed) — commit `faf3818`. Bluesky/its CDN may cache the old broken image per URL for a while.
- Future card changes happen in one place; both cards stay typographically consistent.
- Extends the renderer ADR [[decisions/receipt-card-og-images-hand-built-svg-resvg-resvg-js-replace]] — resvg stays; this decision covers the card design, shared module, and route coverage.
