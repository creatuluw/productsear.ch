---
type: Artifact
title: productsear.ch promo video
description: "An animated ~6-scene promo MP4 that introduces productsear.ch: semantic bookmark search via hybrid retrieval ([[hybrid-search-via-reciprocal-rank-fusion]]) plus"
tags: [video, promo, artifact, html-video]
timestamp: "2026-07-07T10:56:35.608Z"
---

# productsear.ch promo video

An animated ~6-scene promo MP4 that introduces productsear.ch: semantic bookmark search via hybrid retrieval ([hybrid-search-via-reciprocal-rank-fusion](../concepts/hybrid-search-via-reciprocal-rank-fusion.md)) plus a streaming RAG "Ask" mode. The primary visual deliverable used to explain the app at a glance.

## What it documents

- The app itself — what productsear.ch does (search + ask), shown in the on-brand visual language.
- [api-search-endpoint](../entities/api-search-endpoint.md) and [api-ask-endpoint](../entities/api-ask-endpoint.md) — the two core flows the video dramatizes.
- [adopt-agentos-sdk-dev-visual-design-system](../../decisions/adopt-agentos-sdk-dev-visual-design-system.md) — the video is built from productsear.ch's real design tokens (paper `#EFEFEF`, cream, ink `#1B1916`, orange `#FF6A00`, Manrope / JetBrains Mono / Gloria Hallelujah), so it is visually consistent with the site, not a generic mockup.

## Details

- **Format**: MP4 (H.264), ~1.8 MB, single self-contained file.
- **Location**: `productsearch-promo.mp4` (repo root).
- **Generated with**: the [html-video](https://github.com/nexu-io/html-video) Hyperframes engine (headless Chromium records HTML → ffmpeg encodes MP4). Rendered via the **multi-frame CLI path** — one static HTML file per scene — because the renderer's freeze/unfreeze breaks `animation-delay` sequencing.
- **Source template**: lives in the html-video checkout at `templates/productsearch-promo/` (manifest + per-scene HTML), not in this repo.
- **Animation**: pure CSS `@keyframes` (finite durations so the engine's duration probe detects them; `infinite` for ambient effects), Tailwind via CDN, Google Fonts. No JS.

## Source

- [driving-html-video-nexu-io-headlessly-to-render-a](../../learnings/driving-html-video-nexu-io-headlessly-to-render-a.md) — the full how-to and the gotchas (prereqs, why the Studio was skipped, the freeze/unfreeze breakage, the multi-frame fix).
