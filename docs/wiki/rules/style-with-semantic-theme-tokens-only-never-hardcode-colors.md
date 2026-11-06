---
type: Rule
title: Style with semantic theme tokens only — never hardcode colors
description: "**Guideline:** Every color in components and raw CSS must reference the semantic theme tokens (`var(--canvas)`, `var(--ink)`, `var(--accent)`, …) — never hardco"
tags: [css, theming, dark-mode, design-system, svelte]
timestamp: "2026-11-06T19:17:28.285Z"
---

# Style with semantic theme tokens only — never hardcode colors

**Guideline:** Every color in components and raw CSS must reference the semantic theme tokens (`var(--canvas)`, `var(--ink)`, `var(--accent)`, …) — never hardcode `oklch(...)`, `#hex`, `text-white`, `bg-white`, or literal alpha colors.

**When it applies:** all styling work in `src/` — Tailwind utility classes, `<style>` blocks in Svelte components, and raw CSS in `src/app.css`. Since commit `c06dfe4` (2026-11-06) the site supports light and dark themes simultaneously.

**Derivations:**

- Alpha/tints of a token → `color-mix(in oklab, var(--ink) 12%, transparent)` (alpha) or `color-mix(..., var(--canvas))` (tint toward background).
- Text that must sit on the accent color → `text-canvas` (theme-aware), **not** `text-white` — white fails AA contrast on the lightened dark-theme accent `oklch(0.72 0.15 264.2)`.
- Raw CSS may reference the bare vars (`var(--ink)`), which always exist; do not rely on `@theme inline`-emitted utility names from raw CSS.

**Rationale/evidence:** the dark theme (2026-11-06) is a single class swap on `html.dark`; any hardcoded color silently breaks one theme. Sweep found hardcoded colors in InfoTip shadow, WaveLoader accent ramp, homepage pulse/mark, and `text-white` on admin/auth accent buttons — all fixed this way. See the dark-theme ADR and the token-architecture learning.
