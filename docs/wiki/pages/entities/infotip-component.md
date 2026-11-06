---
type: Entity
title: InfoTip component
description: `src/lib/components/InfoTip.svelte` — a lightweight hover/focus tooltip for homepage methodology terms and vital-signs metric labels
tags: [frontend, component, tooltip, accessibility]
timestamp: "2026-11-05T13:20:22.291Z"
---

# InfoTip component

`src/lib/components/InfoTip.svelte` — a lightweight hover/focus tooltip used on the homepage to explain instrument-panel terminology without cluttering the interface. Introduced 2026-11-05 alongside the machine-readout identity work.

## What is it?

An inline wrapper that renders its children as usual and reveals an explanatory tooltip on hover/focus. `align` prop (`left` / `right`) keeps edge tooltips (first/last vital-signs cell) inside the viewport.

## Details

- **Location**: `src/lib/components/InfoTip.svelte`; used in `src/routes/+page.svelte`
- **Interface**: `text` (tooltip copy), `align` (optional, `left`/`right`)
- **Where it appears**:
  - The search-methodology line under the search box — three tooltips decode `semantic + full-text` ([[hybrid-search-via-reciprocal-rank-fusion]]), `cross-encoder reranked` ([[rerank-service]]), and `relevance-floored` (the calibrated [[relevance-floor-0-45-sits-exactly-in-the-measured]]).
  - The vital-signs panel labels — `listings`, `synced`, `analyzed`, `latency` each get a one-line explanation.
- **Accessibility**: tooltip content is reachable via keyboard focus, not hover-only
