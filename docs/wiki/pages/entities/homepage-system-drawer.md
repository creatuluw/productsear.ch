---
type: Entity
title: Homepage system drawer
description: The bottom-sheet drawer on the productsear.ch homepage that holds the system-metadata blocks — the vital-signs panel (listings / last 30 days / synced / analyze
tags: [frontend, homepage, component, ux]
timestamp: "2026-11-07T11:20:03.695Z"
---

# Homepage system drawer

The bottom-sheet drawer on the productsear.ch homepage that holds the system-metadata blocks — the vital-signs panel (listings / last 30 days / synced / analyzed / latency) and the retrieval-methodology tips (semantic + full-text · cross-encoder reranked · relevance-floored). It auto-opens the moment a search executes and auto-hides when results return, so the idle homepage shows only the search field, try chips, and The Drum cards — nothing sits between the query and the corpus.

Role: doubles as the "engine room" readout during flight (the latency cell pulses a WaveLoader while waiting, then swaps to the `tookMs` ms readout) and as the always-reachable home of corpus stats via the fixed `system ▴` chip (bottom-right thumb zone) that reopens it when idle.

## Details

- **Location**: `src/routes/+page.svelte` — inline markup (`<aside id="system-drawer">` + corner chip), rendered in the human-view branch only (hidden on `?view=llm`)
- **Behavior**: opens on search start (`runSearch` sets `drawerOpen = true`, non-empty queries only); closes on results or error (in the `finally`); Escape closes via `<svelte:window onkeydown>`; `prefers-reduced-motion` gets an instant swap (fly transition with zero distance/duration)
- **Styling**: opaque `bg-canvas` panel, hairline `border-t border-ink/10` top edge, upward soft shadow, safe-area-aware bottom padding; `role="region"` + `aria-label="system readout"`; close/reopen buttons carry `aria-controls`/`aria-expanded`
- **Layout**: vital-signs `<dl>` keeps its 2×2 + full-width mobile grid and 5-across `md+`; methodology tips sit as a second grouped region below
- [waveloader-component](./waveloader-component.md) — pulses in the drawer's latency cell while a search runs
- [infotip-component](./infotip-component.md) — every vital-signs label and methodology term is an InfoTip hover/focus tooltip
- [the-drum-feed](./the-drum-feed.md) — its 3 latest cards are the only content besides the search field on the idle homepage
- Decision: [homepage content/system-metadata split](../../decisions/homepage-content-system-metadata-split-auto-opening-search-d.md)

## Lifecycle

- **First added**: 2026-11-07 (commit `9168e3d`) — homepage restructure moving the methodology line + vital-signs panel out of the page flow
- **Significant changes**: same day — drawer made canvas-solid to stop the footer ghosting through the translucent version
