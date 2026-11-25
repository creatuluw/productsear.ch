---
type: Learning
title: gstatic css2 legacy-UA downloads are EOT files, not TTFs — pull real TTFs from the official repo
description: "The legacy user-agent trick against Google Fonts' css2 API returns URLs whose downloaded bytes are legacy EOT, not TTF — @resvg/resvg-js silently drops them and all text vanishes from the render. Commit TTFs pulled from the font's official GitHub repo and verify the sfnt magic (00 01 00 00) first."
tags: [fonts, self-hosting, og-images, resvg, gotcha]
timestamp: "2026-11-06T20:33:43.155Z"
---

# gstatic css2 legacy-UA downloads are EOT files, not TTFs — pull real TTFs from the official repo

**The correction (2026-11-06, found when the receipt-card OG images rendered with *all text missing*):** the old trick — request `https://fonts.googleapis.com/css2?family=...` with a legacy user-agent to get "TTF" URLs — is **unreliable**: what you actually download is **EOT** (gstatic serves the legacy Embedded OpenType format to old UAs; the sfnt header is garbage). Committed as `.ttf`, `@resvg/resvg-js` fails to load them silently and every glyph disappears from the rendered SVG.

## What actually works

- Pull genuine TTFs from the font's **official GitHub repository** (for Hanken Grotesk the good branch was `master`) and commit those under `static/fonts/` (OFL license note alongside).
- **Verify the bytes, not the extension**: a real TTF starts with the sfnt magic `00 01 00 00` (`0x00010000`). EOT garbage fails this check — catch it before committing.
- The user-agent trick remains true only for its URL-format effect (modern UAs get woff2, which resvg cannot use); never assume the legacy-UA payload is a usable TTF.

Result: `static/fonts/HankenGrotesk-{Regular,SemiBold}.ttf` (~57KB each) load deterministically in [the receipt-card OG route](../pages/entities/receipt-card-og-image-route.md) — brand-true text with no runtime CDN dependency.
