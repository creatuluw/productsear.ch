---
type: Entity
title: WaveLoader component
description: A CSS-only animated loading indicator shown in the latency gauge box while a search runs; it swaps to the `{tookMs}ms` latency readout when the search completes
tags: [frontend, component, loader, animation]
timestamp: "2026-11-01T13:27:32.623Z"
---

# WaveLoader component

A CSS-only animated loading indicator shown in the latency gauge box while a search runs; it swaps to the `{tookMs}ms` latency readout when the search completes.

Reverse-engineered from a 21st.dev "symmetric wave" preview into plain CSS per the reverse-engineering rule — no React or 21st.dev dependency added.

## What is it?

`src/lib/components/WaveLoader.svelte` renders a row of monospace block cells (`█` over a dim `░` track) whose pulses travel edge→center and back, gradient-shaded from gray at the edges into the `#0021FF` accent at the center, with a soft glow.

## Implementation notes

- The original 21st.dev component ships **five** `@keyframes`; this port uses **one** keyframe plus **mirrored negative `animation-delay` values**, so a single animation definition drives all cells symmetrically.
- Each cell is a vertical OKLCH gradient (gray edges → `#0021FF` center accent) for the bar, over a dim track.
- `prefers-reduced-motion` renders a static dim state instead of animating.
- Usage: rendered only inside the latency gauge box in `src/routes/+page.svelte` during an in-flight search; the old "searching…" status text was removed (results narration remains).

## Details

- **Location**: `src/lib/components/WaveLoader.svelte`; wired into `src/routes/+page.svelte`
- **Interface**: no props in current usage; pure presentational component
- **Configuration**: none — colors come from the OKLCH token system / `#0021FF` accent
- **Accessibility**: `sr-only` "loading" text for screen readers; reduced-motion fallback

## Lifecycle

- First added: 2026-11-01 — visual feedback for in-flight searches on the homepage.
- Verified via `svelte-check` (0 errors), clean production build, and a frozen-mid-cycle headless-Chrome screenshot of the compiled scoped CSS before push (commit `bdee294`).

## Source

- `src/lib/components/WaveLoader.svelte` — the component
- `src/routes/+page.svelte` — integration point (latency gauge box)
