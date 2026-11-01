---
type: Artifact
title: host0.ai and clawrun.sh design references
description: "Two live sites the user endorsed ("i like") as aesthetic north stars for the upcoming site redesign: https://host0.ai/ and https://clawrun.sh/. Both were fetche"
tags: [design, frontend, reference]
timestamp: "2026-11-01T00:48:00.398Z"
---

# host0.ai and clawrun.sh design references

Two live sites the user endorsed ("i like") as aesthetic north stars for the upcoming site redesign: https://host0.ai/ and https://clawrun.sh/. Both were fetched and analyzed in-session; they agree with each other strongly and — notably — **validate and sharpen the existing [shift-visual-design-to-instrument-grade-precision-tool-syste](./shift-visual-design-to-instrument-grade-precision-tool-syste.md) rather than replacing it**. The working direction extracted from them: *lean harder into the mono/terminal register, show live state, number things like a protocol.*

## What it documents

The shared **terminal-native, agent-era aesthetic vocabulary** of both sites:

- **Mono-led type** — the mono register carries the identity, not just code snippets
- **The interface shows the machine working** — deploy transcripts, version history, live state rendered in the UI
- **Dense fact strips** — e.g. host0's `1min deploy / 100% open source / ∞ agents` — the same species as our instrument readout (corpus · indexed · latency · pipeline)
- **Protocol-style numbered steps** — e.g. clawrun's "There is no step four"
- **Calm ground with one accent** — matches our ink-green single-accent discipline
- **Wry, confident microcopy**

## Mapping to productsear.ch

Confirms the instrument-grade system was the right call and pushes it further: more mono, more visible live state, protocol numbering for flows. Keep the OKLCH tokens, Hanken Grotesk + Martian Mono, and the [instrument-grade-design-principles-avoid-banned-tells](./instrument-grade-design-principles-avoid-banned-tells.md) rule; the references guide *emphasis*, not a new palette.

## Redesign scope signal (from the design interview, Q4 of 4)

Proposed success checklist — pending user confirmation at time of writing:

- Known query returns only strong matches, honest counts, working 20/page paging
- All-entries list, newest-first
- Compendium: sensible 20–30 archetype roll-up with who/what/how/when on every entry
- All pages in the host0/clawrun terminal-instrument register
- Working `?view=llm` paste-ready twin on each page (see [dual-view-surfaces-humans-llms-tabs-with-view-llm-on-every-r](./dual-view-surfaces-humans-llms-tabs-with-view-llm-on-every-r.md))

## Details

- **Format**: live websites, fetched and read in-session (no saved HTML/CSS dumps yet — re-fetch when implementing if exact CSS is needed)
- **Predecessor**: [agentos-sdk-dev-design-system-extraction](./agentos-sdk-dev-design-system-extraction.md) — the previous reference lineage, superseded by the instrument-grade decision
