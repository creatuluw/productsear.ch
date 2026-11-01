---
type: Rule
title: Reverse-engineer hosted component bundles into plain CSS, never add the dependency
description: "**Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the React dependency or po"
tags: [frontend, design, dependencies, animation]
timestamp: "2026-11-01T13:20:24.961Z"
---

# Reverse-engineer hosted component bundles into plain CSS, never add the dependency

**Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the React dependency or port React code. Extract the `@keyframes` and animation structure from the bundle and re-implement as plain CSS + Svelte markup.

**When it applies:** any "make it look like this component" request that points at a component URL.

**Rationale:**

- productsear.ch is Svelte 5 — React bundles can't be dropped in, and porting React for a CSS animation is pure overhead.
- These loaders are pure CSS keyframes; the React wrapper adds nothing.
- Owning the CSS lets the animation be restyled with site tokens (accent `#0021FF` / OKLCH, gray ramp) to match the instrument-grade design system — e.g. the symmetric-wave loading indicator was extracted from its bundle and restyled with accent gradients + shades of gray.

**Evidence:** 2026-11-01 — symmetric-wave loader (cdn.21st.dev) reverse-engineered into plain CSS in one pass, no new dependencies.
