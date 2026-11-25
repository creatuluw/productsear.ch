---
type: Decision
title: "Homepage content/system-metadata split: auto-opening search drawer"
description: **Context.** The homepage carried two system-metadata blocks inline in the page flow — the retrieval-methodology line (semantic + full-text · cross-encoder rera
tags: [frontend, design, homepage, ux, drawer]
status: accepted
timestamp: "2026-11-07T11:19:56.309Z"
---

# Homepage content/system-metadata split: auto-opening search drawer

**Context.** The homepage carried two system-metadata blocks inline in the page flow — the retrieval-methodology line (semantic + full-text · cross-encoder reranked · relevance-floored InfoTips) and the vital-signs panel (listings / last 30 days / synced / analyzed / latency) — sitting between the search field and the corpus. The user asked for better grouping and scannability, with those labels moved into a bottom drawer that appears while a search executes and hides when results return.

**Choice.** The idle homepage shows only the search field, try chips, and The Drum cards. The methodology tips and vital-signs panel live in a canvas-solid bottom drawer (`#system-drawer`) that:

- **auto-opens** the moment a search executes (`runSearch` sets `drawerOpen = true` on request start) — the WaveLoader pulses in the latency cell, so the drawer doubles as the "engine room" readout mid-flight
- **auto-hides** the moment results return, also on error (closed in the `finally` block)
- closes on **Escape**; `prefers-reduced-motion` users get an instant swap (`transition:fly` with zero distance/duration)
- reopens anytime via a fixed **`system ▴` chip** bottom-right (thumb zone, safe-area-aware)

**Alternatives considered.**

- Keep both blocks in the page flow — rejected: buries the query under system metadata.
- Purely transient drawer with no reopen affordance — rejected: corpus stats and the `last 30 days` browse link would be unreachable when idle.

**Rationale.** Separates content from system metadata: the query is the first thing on the page, the drawer gives live progress feedback during search instead of a static panel, and the chip preserves always-available access to the stats.

**Consequences.** `runSearch` now drives drawer state; the vital-signs grid keeps its 2×2 + full-width mobile layout and 5-across `md+` inside the drawer. The drawer background must stay opaque (`bg-canvas`) — translucent versions let the footer ghost through. Implemented in `src/routes/+page.svelte`, shipped as commit `9168e3d` (2026-11-07).
