---
type: Learning
title: "Dark theme token architecture: @theme inline + html.dark swap, no hardcoded oklch"
description: "**The architecture (added 2026-11-06, commit c06dfe4):** theming works by swapping semantic vars on `html.dark`, not by `dark:` utilities."
tags: [theming, css, tailwind, dark-mode]
timestamp: "2026-11-06T19:15:41.918Z"
---

# Dark theme token architecture: @theme inline + html.dark swap, no hardcoded oklch

**The architecture (added 2026-11-06, commit c06dfe4):** theming works by swapping semantic vars on `html.dark`, not by `dark:` utilities.

- `src/app.css` has two blocks: a static `@theme` (fonts, radius) and a `@theme inline` block mapping `--color-canvas: var(--canvas)` etc. The `inline` is required — utilities must resolve the var at the element, otherwise the `:root`-computed value freezes the light palette.
- Light values live in `:root`, dark values in `html.dark` (green-tinted neutrals ~hue 165; accent lightened to oklch(0.72 0.15 264.2) for AA contrast on dark).
- The `.dark` class is set pre-paint by an inline script in `src/app.html` (stored `localStorage.theme` > OS preference), so there is no flash. The header toggle in `+layout.svelte` flips the class + persists + syncs the `theme-color` meta.
- `@custom-variant dark` is wired to the class, so `dark:` utilities also work if ever needed.
- **Convention: no hardcoded oklch alpha colors anymore.** Raw CSS must derive tints/hairlines from tokens via `color-mix(in oklab, var(--ink) N%, transparent)` (alpha), `color-mix(... var(--canvas))` (tint toward bg), or dedicated vars like `--pre-bg`. Raw CSS should reference the bare vars (`var(--ink)`), which are guaranteed to exist — unlike `@theme inline` emitted names.
