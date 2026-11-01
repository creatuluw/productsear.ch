---
type: Learning
title: "Site accent is #0021FF = oklch(0.468 0.303 264.2), 7.89:1 AA-safe"
description: "The site-wide accent (set 2026-11-01) is `#0021FF`, expressed in the OKLCH token system as:"
tags: [design-tokens, accessibility, oklch, contrast]
timestamp: "2026-11-01T01:49:55.401Z"
---

# Site accent is #0021FF = oklch(0.468 0.303 264.2), 7.89:1 AA-safe

The site-wide accent (set 2026-11-01) is `#0021FF`, expressed in the OKLCH token system as:

- `--color-accent: oklch(0.468 0.303 264.2)` — `#0021FF`
- `--color-accent-hover: oklch(0.411 0.264 264.2)` — `#001BD6`

Contrast on the paper background is **7.89:1** — WCAG AA ✓ even at the small mono label sizes it drives (wordmark, domain labels, links, focus ring + caret). Unlike the old gold accent (see the gold/AA learning), this blue is safe for text at any size used on the site. Tokens live in `src/app.css`.
