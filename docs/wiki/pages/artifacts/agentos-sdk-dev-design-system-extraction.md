---
type: Artifact
title: agentos-sdk.dev design system extraction
description: "Reference design system reverse-engineered from https://agentos-sdk.dev/, to be replicated on productsear.ch. Captures exact color tokens, typography, signature"
tags: [design, frontend, reference]
timestamp: "2026-07-03T16:10:06.899Z"
---

# agentos-sdk.dev design system extraction

Reference design system reverse-engineered from https://agentos-sdk.dev/, to be replicated on productsear.ch. Captures exact color tokens, typography, signature elements, and structural patterns so the restyle is faithful rather than approximate.

## What it documents
- [adopt-agentos-sdk-dev-visual-design-system](./adopt-agentos-sdk-dev-visual-design-system.md) — the decision to adopt this system.

## Details
- **Format**: extracted HTML + CSS, exact RGB/HSL values, Tailwind class patterns
- **Source files saved**: `/tmp/agentos.html` (189KB), `/tmp/agentos.css` (158KB) — grep these for any exact CSS rule during implementation
- **Color palette**: paper `#EFEFEF`, cream `#F4F1E7`, ink `#1B1916`, primary `#FF6A00`, olive `#5C6B4F`, sage `#93A286`, gold `#D4B483`
- **Fonts**: Manrope (sans), JetBrains Mono (code), Gloria Hallelujah (accent)
- **Signature element**: animated chrome conic-gradient border (`.btn-chrome` / `.btn-chrome-outline`)
- **Texture**: paper-grain via inline SVG `feTurbulence` (baseFrequency 0.9, opacity 0.045)

## Caution
The site's `:root` contains unused shadcn dark HSL vars — see [agentos-sdk-dev-is-a-light-warm-paper-theme-not-dark](./agentos-sdk-dev-is-a-light-warm-paper-theme-not-dark.md). The real theme is light/paper.
