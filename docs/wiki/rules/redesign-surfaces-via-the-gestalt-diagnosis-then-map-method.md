---
type: Rule
title: Redesign surfaces via the Gestalt diagnosis-then-map method
description: "**Guideline:** When a redesign request lands ("make X read/enjoy better"), run the nine Gestalt principles (common region, closure, proximity, figure-ground, co"
tags: [design, frontend, method]
timestamp: "2026-11-06T20:56:50.681Z"
---

# Redesign surfaces via the Gestalt diagnosis-then-map method

**Guideline:** When a redesign request lands ("make X read/enjoy better"), run the nine Gestalt principles (common region, closure, proximity, figure-ground, continuity, symmetry & order, Prägnanz, similarity, common fate) as a two-step method, not as a mood board:

1. **Diagnose** — audit the current surface against each principle and state the concrete violation in one line (e.g. "cards aren't regions — hairlines only; meta floats unbounded").
2. **Map** — translate each violation into a specific *structural* treatment (bounding, spines, hierarchy shifts), never a cosmetic tweak (spacing/font nudges).

**When it applies.** Any visual/UX redesign of an existing page surface in this project.

**Rationale.** Used 2026-11-06 for the `/feed` redesign ([[decisions/redesign-the-drum-feed-around-the-nine-gestalt-principles]]): the diagnosis table directly produced the treatment mapping and the result shipped in a single pass. Structural violations — no regions, no rhythm, no figure — are invisible to cosmetic tweaks; the principle audit is what surfaces them.
