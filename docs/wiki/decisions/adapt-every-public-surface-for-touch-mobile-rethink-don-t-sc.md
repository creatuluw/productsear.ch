---
type: Decision
title: Adapt every public surface for touch/mobile — rethink, don't scale
description: "**Context.** The site was desktop-first. A diagnosis pass (impeccable adapt skill, run through the [[rules/redesign-surfaces-via-the-gestalt-diagnosis-then-map-"
tags: [frontend, mobile, responsive, touch, gestalt, design]
status: accepted
timestamp: "2026-11-06T23:46:41.433Z"
---

# Adapt every public surface for touch/mobile — rethink, don't scale

**Context.** The site was desktop-first. A diagnosis pass (impeccable adapt skill, run through the [[rules/redesign-surfaces-via-the-gestalt-diagnosis-then-map-method]] lens) found 11 structural mobile problems across every surface: nav hidden behind invisible horizontal scroll; touch targets ≪44px (icon buttons, pills, tabs, pager, chips, toggles); 12px digest input triggering iOS focus zoom; no `viewport-fit=cover` / safe-area insets; `100vh` root breaking under dynamic mobile toolbars; vital-signs panel orphaning a half-width latency cell (a symmetry & order violation); Drum cards 3-across at 768px (~230px each); feed readout truncating values on phones; footer credit + mascot colliding and toast overflowing 320px; InfoTips hover-only (unreachable on touch); `px-7` plates eating narrow screens.

**Choice.** One adaptation pass across every public surface (home, archive, collections, feed, listings, layout shell): two-deck mobile header; ≥44px touch targets everywhere; 16px+ inputs; `min-h-dvh` + safe-area insets + `viewport-fit=cover`; structural vital-panel grid rework (2×2 + latency on phones, `md:grid-cols-5` on tablets); 2-col Drum cards on tablet; stacked feed readout; stacked footer + 320px-safe toast; tap-toggle InfoTips; slimmer plate padding below `lg`.

**Alternatives considered.** (1) Incremental media-query patches — rejected: leaves desktop-first assumptions in place and produces the orphan-cell / cramped-card class of bugs. (2) Separate mobile site — rejected: dual maintenance for one corpus.

**Rationale.** The adapt skill's "rethink, don't scale": the problems were structural (Gestalt violations), not spacing nudges, so fixes were grid/layout reworks. Verified with [[rules/probe-responsive-overflow-programmatically-don-t-eyeball-sc]]: 0px horizontal overflow at 320/390/768/1280 on all surfaces, desktop unchanged.

**Consequences.** Touch parity everywhere; the header wraps gracefully below `lg` on tablets (intended fallback, everything visible); the InfoTip trigger surface now includes tap; closed tipboxes use `display:none` (see [[learnings/opacity-0-elements-still-occupy-layout-space-closed-ti]]).
