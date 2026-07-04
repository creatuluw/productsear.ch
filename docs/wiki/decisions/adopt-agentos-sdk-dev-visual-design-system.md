---
type: Decision
title: Adopt agentos-sdk.dev visual design system
description: Context
tags: [design, frontend, styling, design-system]
status: accepted
timestamp: "2026-07-03T16:09:45.329Z"
---

# Adopt agentos-sdk.dev visual design system

## Context
productsear.ch needs a visual identity. The user chose to restyle the app to match https://agentos-sdk.dev/ exactly. The assistant extracted the full design system by pulling the live site's HTML/CSS, capturing exact RGB/HSL color tokens, typography, signature elements, and structural patterns.

## Choice
Adopt the agentos-sdk.dev design language wholesale: a **warm light paper theme** (not dark), chrome-gradient borders, cream cards, orange primary, Manrope + JetBrains Mono typography, and SVG paper grain texture.

## Key tokens (exact values)
- **paper (bg):** `#EFEFEF` `rgb(239 239 239)` + SVG `feTurbulence` grain (opacity 0.045)
- **cream:** `#F4F1E7` `rgb(244 241 231)` — card fills, subtle surfaces
- **ink (text):** `#1B1916` `rgb(27 25 22)` — warm near-black for all text
- **primary:** `hsl(18 100% 50%)` `#FF6A00` — bright orange CTA
- **olive:** `#5C6B4F`, **sage:** `#93A286`, **gold/tan:** `#D4B483`
- **muted:** `#8A8478` / `#56524A`
- **borders:** hairline `#1B19161a` (ink @ 10%)

## Typography
- Sans: **Manrope** (400/500/600/700, base 400)
- Mono: **JetBrains Mono** (400/500/600)
- Accent/handwritten: **Gloria Hallelujah**
- Headlines use `font-medium` (NOT bold), tight negative tracking (`-0.02em` h1, `-0.015em` h2)
- Body: `line-height: 1.5`, antialiased

## Signature elements
1. **Chrome gradient border** (the trademark): animated conic-gradient silver via `:before` (`mask-composite: exclude`) + soft glow `:after`; hover advances `--chrome-hover-offset: 60deg` over 0.7s. Two variants: `.btn-chrome` (filled silver) and `.btn-chrome-outline`.
2. **Glass:** `#ffffff05` bg, `#ffffff1a` border, `backdrop-filter: blur(12px)`
3. **Primary button:** `bg-primary` orange, white text

## Structure
- Radius `0.5rem`; header height `3.5rem`
- Sticky nav: `sticky top-0 z-10 bg-paper/85 backdrop-blur-md border-b`
- Cards: `rounded-lg border border-cream/10 bg-cream/[0.03]`
- Code blocks: dark Shiki theme inside light paper cards

## Rationale
Matching an existing polished site gives an instant, coherent, professional design without designing from scratch. The warm-paper aesthetic is distinctive (vs. generic dark/neutral SaaS) and the chrome-gradient border is a memorable signature element.

## Gotcha
The site's `:root` contains leftover shadcn dark HSL vars (`--background: 240 10% 3.9%`) — these are **unused**. Do NOT copy them. The site is light; those vars are dead defaults.

## Alternatives considered
- Build an original design system — rejected: slower, needs iteration to reach this polish.
- Match a different reference site — rejected: user specified agentos-sdk.dev explicitly.

## Consequences
- `app.css @theme` tokens change from greyscale to paper/cream/ink/primary/olive/sage.
- Google Fonts load changes to Manrope + JetBrains Mono.
- All components (cards, search input, mode pills, result cards) get restyled.
- Source references saved at `/tmp/agentos.html` (189KB) and `/tmp/agentos.css` (158KB) for grepping exact rules.
