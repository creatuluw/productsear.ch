---
type: Learning
title: agentos-sdk.dev is a light warm-paper theme, not dark
description: "When extracting the design system from https://agentos-sdk.dev/, the `:root` CSS contains leftover shadcn dark-mode HSL variables (e.g. `--background: 240 10% 3"
tags: [design, frontend, gotcha]
timestamp: "2026-07-03T16:09:45.329Z"
---

# agentos-sdk.dev is a light warm-paper theme, not dark

When extracting the design system from https://agentos-sdk.dev/, the `:root` CSS contains leftover shadcn dark-mode HSL variables (e.g. `--background: 240 10% 3.9%`). These are **unused dead defaults** — the site is actually a **light** warm-paper theme (`#EFEFEF` background + SVG grain).

If you copy the `:root` vars blindly you'll get a dark site that does not match the reference. The real tokens live in the component classes and Tailwind config (`bg-paper`, `text-ink`, `bg-cream`), not in those shadcn defaults.
