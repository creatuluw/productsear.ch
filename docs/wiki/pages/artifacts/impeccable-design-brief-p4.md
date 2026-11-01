---
type: Artifact
title: Impeccable design brief (P4)
description: "The **design brief** is the P4 gate deliverable of the impeccable design-studio redesign: the self-sufficient handover spec from which the approved design gets "
tags: [impeccable, design-brief, p4-gate, redesign, corpus-browser]
timestamp: "2026-11-01T00:52:28.530Z"
---

# Impeccable design brief (P4)

The **design brief** is the P4 gate deliverable of the impeccable design-studio redesign: the self-sufficient handover spec from which the approved design gets built ("an LLM that never saw the conversation can produce the approved design from this file alone"). It succeeded the approved [impeccable-pattern-one-pager-p3](./impeccable-pattern-one-pager-p3.md) and precedes execution (endpoints first, then surfaces, then a browser draft).

## What it documents

- **Impeccable mode: Operate** — a daily working instrument; primary action is search-and-find with honest state, never persuasion. Brand adjectives: instrument-grade, precise, calm, terminal-native, honest; explicit never-list (marketing-y, decorative, gradient-sloppy, padded, dashboard-busy).
- **The skeleton** — one shell, three surfaces: search home `/` (field → vital-signs strip → cutoff-filtered results with 20/page pager), `/archive` (all entries newest-first by `raindrop_created_at`, date headlines), `/compendium` (20–30 archetype groups with who/what/how/when cards). Every surface gets a `?view=llm` markdown twin; [serve-the-llm-usage-guide-at-skill-md-and-distill-it-into-th|/skill.md](./serve-the-llm-usage-guide-at-skill-md-and-distill-it-into-th.md) serves the skill. Ask mode removed per [remove-ask-mode-productsear-ch-becomes-search-only](./remove-ask-mode-productsear-ch-becomes-search-only.md).
- **Visual direction** — the existing OKLCH instrument system (see [shift-visual-design-to-instrument-grade-precision-tool-syste](./shift-visual-design-to-instrument-grade-precision-tool-syste.md)) pushed harder into the terminal register: mono-led data, protocol numbering (`01 / 02 / 03`), fact strips, live state readouts; references [host0-ai-and-clawrun-sh-design-references](./host0-ai-and-clawrun-sh-design-references.md). Zero imagery; color beyond ink/paper must carry meaning; motion = rows entering as one group (8px/180ms, stagger ≤35ms), nothing decorative.
- **Gestalt handover** — all 15 principles instantiated with concrete values (e.g. label→value ≤6px, rows hairline+20–24px, groups ≥40px), marked binding on the build.
- **Data facts** the design consumes — ordering by `raindrop_created_at` (not `synced_at`), [store-bookmark-archetypes-as-multi-entry-jsonb-on-an-app-own|archetype roll-up](./store-bookmark-archetypes-as-multi-entry-jsonb-on-an-app-own.md) from 1,320 raw categories, rerank cutoff with honest counts ("N strong matches").
- **Out of scope** — facet/filter UI, item detail pages, auth, dark mode, i18n; API changes limited to pagination + cutoff on `/api/search`, removal of `/api/ask`, new `/skill.md` route.

## Details

- **Location**: `.monster/impeccable-studio/DESIGN-BRIEF.md`
- **Format**: Markdown, 7 sections (header, product context, skeleton table with block ids, visual direction, Gestalt handover, execution plan, out of scope)
- **Generated from**: approved pattern one-pager + archetype research (`research/archetype-patterns.md`) + interview decisions (`state.json`)

## Lifecycle

- 2026-11-01: written and approved at the P4 gate; execution plan = endpoints first, then surfaces, then verify/refine passes.
