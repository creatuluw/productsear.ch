---
type: Rule
title: Instrument-grade design principles; avoid banned tells
description: Guideline
tags: [design, frontend, styling, ui]
timestamp: "2026-08-06T09:34:50.715Z"
---

# Instrument-grade design principles; avoid banned tells

## Guideline
When adding or restyling UI on productsear.ch, follow the **instrument-grade precision-tool** direction (brand: Trustworthy · Proficient · Fast) defined in `.impeccable.md` and the design ADR.

## The five principles
1. **Trust = legibility & consistency** — clear hierarchy, calm palette, generous space; nothing decorative for its own sake; every interactive state unambiguous.
2. **Proficiency = precision & data-forwardness** — hairline rules, strict baseline grid, mono-set data (counts / timing / IDs) communicate competence. Density without clutter.
3. **Speed = focus & momentum** — the search field is the hero; everything else recedes; snappy motion (ease-out, 120–180ms, never bounce); the rare gold/signal accent marks "active/running" only.
4. **Transparency over ornament** — prefer showing real state (corpus size, last-indexed, latency) over decorative effects. The status readout is the signature element.
5. **Restraint** — one accent family, one signal color used sparingly, solid colors never gradient text, hairlines over heavy borders.

## Banned tells (do not use)
Glassmorphism, decorative chrome borders, cyan-on-black / purple→blue gradients, gradient text, sparkline decoration, card-soup layouts, generic AI dark dashboards, side-stripe blockquote borders.

## When it applies
All user-facing UI work on this app. Neutrals are tinted toward the brand hue (green ~165); gold/signal is active-state only and must still pass contrast for any text use (see [[gold-accent-fails-wcag-aa-contrast-when-used-for]]).

## Rationale / evidence
- `.impeccable.md` — design brief (users, job-to-be-done, brand personality, principles, target tokens, signature element).
- `src/app.css` — token + prose implementation.
- Supersedes the agentos-sdk.dev warm-paper direction (see the design ADR).
