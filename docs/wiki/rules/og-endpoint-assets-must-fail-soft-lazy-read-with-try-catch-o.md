---
type: Rule
title: "OG endpoint assets must fail soft: lazy-read with try/catch, omit gracefully"
description: "**Guideline:** Any binary asset an OG/social-card renderer depends on (mascot PNG, fonts, future images) must be loaded **tolerantly**: a lazy (memoized) read w"
tags: [[og-images, robustness, convention, resvg]]
timestamp: "2026-11-07T12:16:44.524Z"
---

# OG endpoint assets must fail soft: lazy-read with try/catch, omit gracefully

**Guideline:** Any binary asset an OG/social-card renderer depends on (mascot PNG, fonts, future images) must be loaded **tolerantly**: a lazy (memoized) read wrapped in try/catch that returns `null`/empty on failure, with the SVG template omitting that element rather than throwing.

**Applies to:** `src/lib/server/og.ts` and any future OG endpoint under `src/routes/api/feed/og/`. Never `readFileSync` an OG asset at module scope — an eager top-level read crashes server boot when the asset is missing.

**Pattern in code:** `mascotDataUri()` in `og.ts` — memoized on first card render, `try/catch` → `null`, and `cardSvg()` renders the `<image>` element only when non-null. Comment in code: "an OG asset must never take the server down at boot."

**Rationale:** OG rendering is a nicety layered on the search product; asset fragility has already bitten once (the OG font incident — garbage EOT bytes shipped to production, cards rendered with no text). Fail soft so a missing/broken asset degrades one card, never the server.
