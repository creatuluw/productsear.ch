---
type: Entity
title: product-search mascot (illo character pack)
description: "The official brand mascot for productsear.ch: **product-search**, a bookmark-ribbon character in the illo plugin's **riso** look — the ribbon that has already f"
tags: [brand, mascot, illo, illustration]
timestamp: "2026-11-01T13:09:12.031Z"
---

# product-search mascot (illo character pack)

The official brand mascot for productsear.ch: **product-search**, a bookmark-ribbon character in the illo plugin's **riso** look — the ribbon that has already found the page.

## Details

- **Location**: `E:\plugins.monster\illo\skills\illo\characters\product-search\` — an illo **bundled character pack** (`character.md` locked spec + `reference.png` canonical model sheet). Lives outside the repo on purpose: it ships with the illo plugin so every machine that runs illo has it.
- **Design**: one tall, soft, gently-tapered ribbon body (smoothly rounded top, swallowtail V-notch at the bottom), two dot eyes, deadpan face, droplet-shaped stubby arms/legs. A solid electric-blue under-layer of the same ribbon shape sits offset behind the body — visible in the notch and as a sliver along the lower right edge; it is the only accent-colored area. (Sheet picked by the user 2026-11-01 from the candidate round.)
- **Brand palette** (derived from the site accent `#0021FF`): paper cool off-white `#f6f8fc`, structure ink blue-black `#161c2e`, accent electric blue `#0021ff`, secondary warm gold `#e0a62e`.
- **Aliases**: bookmark, bookmark-ribbon, ribbon, bookmark character.

## Usage

Invoke via the illo plugin: "use product-search" (or an alias) in any illo request. Scene renders must pass the pack's `reference.png` as `--ref` — that conditioning is what keeps it on-model. The **banana character tier** (`--model banana`) holds this design; the cheaper FLUX render tier drifts on the stubby limbs. Banana only supports 1:1 (the engine's 16:9 dims `1344x768` are rejected — its supported landscape sizes never match the engine's 64-snap).

## Lifecycle

- First added: 2026-11-01 — character-builder flow, riso look, palette derived from [site accent is #0021FF = oklch(0.468 0.303 264.2), 7.89:1 AA-safe](./site-accent-is-0021ff-oklch-0-468-0-303-264-2-7-89-1-aa-safe.md).
- Gallery of the build: `E:\tmp\illo\20261101-135715-e42f\index.html` (temp dir — copy finals before reuse).
- 2026-11-01: user swapped the canonical sheet to the rounder variant (blue back layer, droplet arms); `character.md` re-locked to match, proof scene re-verified on the banana tier.
