---
type: Decision
title: Adopt product-search bookmark-ribbon mascot as the brand character
description: Context
tags: [brand, mascot, design, illo, illustration]
status: accepted
timestamp: "2026-11-01T13:14:28.517Z"
---

# Adopt product-search bookmark-ribbon mascot as the brand character

## Context

productsear.ch had no brand character. The illo plugin (editorial illustrations with recurring mascot character packs) was engaged to create one in the community **riso** look, named `product-search`, pressure-tested against the skill's character guardrails over two QA rounds.

## Choice

The mascot is a **bookmark ribbon**: a tall, gently-rounded vertical ribbon with a swallowtail V-notch tail, two dot eyes (house deadpan face), stubby limbs. Palette derived from the site accent `#0021FF`: electric blue accent, ink blue-black `#161c2e`, cool off-white paper `#f6f8fc`, warm gold secondary. **Accent discipline:** only the swallowtail tail-tip carries the accent color.

Installed as an illo **bundled character pack** at `E:\plugins.monster\illo\skills\illo\characters\product-search\` (locked spec + canonical `reference.png`) so it ships with the plugin on every machine that runs illo. Aliases: `bookmark`, `bookmark-ribbon`, `ribbon`, `bookmark character`.

## Alternatives considered

- **Magnifying-glass mascot** — rejected as the search cliché; a ribbon is the domain-literal object (the thing being searched does the searching) and reads at thumbnail size.
- **Accent across the body / large panels** — rejected in QA: candidate sheet 1 failed accent discipline (nearly half the body blue); sheet 2 crept the accent over the bottom quarter.
- **Unlocked extra parts** (page curl at the top, photographic desk-scene backgrounds, soft drop shadows) — rejected; every extra part is a drift liability in downstream scene renders.

## Rationale

A domain-literal object is ownable and thumbnail-readable; the house default face is the most drift-resistant across render tiers; single-point accent discipline keeps the character visually consistent with the site's `#0021FF` accent.

## Consequences

- Scene renders must condition on the pack's `reference.png` (`--ref`) and use the Nano Banana character tier (`--model banana`): the cheaper FLUX render tier drifted hard on the stubby limbs, eye count, and added unlocked dark panels; the character tier held the design. Banana only supports 1:1 — the engine's 16:9 snap (1344x768) is rejected (banana's supported landscape sizes never match the engine's 64-snap dims).
- The pack lives **outside the repo** (plugin-bundled), so it is not versioned here — the wiki entity page is the in-repo pointer.
- Full details and usage: see `pages/entities/product-search-mascot-illo-character-pack.md`.
