---
type: Learning
title: Gold accent fails WCAG AA contrast when used for chip/tag text
description: Gotcha
tags: [design, accessibility, contrast, wcag, redesign, gold-accent]
timestamp: "2026-08-06T09:32:48.145Z"
---

# Gold accent fails WCAG AA contrast when used for chip/tag text

## Gotcha

The redesigned light theme uses a warm **gold** accent (≈ RGB 218/167/118 light, 182/110/25 deep) for the "try" example query chips on the home page and the small **mono tag chips** on each search-result row.

Pixel-level contrast measurement against the near-white canvas (248,251,249):

| Element | Stroke RGB | Contrast | WCAG |
|---|---|---|---|
| Home "try" chips | (218, 167, 118) | **2.06 : 1** | ❌ fails AA-normal (4.5) **and** AA-large (3.0) |
| Result-row tag chips | (219, 170, 120) | **2.01 : 1** | ❌ fails both |
| "// semantic…" eyebrow (gold-green mix) | (151, 130, 65) | 3.61 : 1 | ❌ fails AA-normal |

For comparison, elements that **pass**: deep ink (16,24,24) = 17.3:1, excerpt body (93,100,105) = 5.77:1, ink-green domains (63,113,92) = 5.41:1.

## Why it matters

The design language (see [[decisions/adopt-agentos-sdk-dev-visual-design-system]]) calls gold a **"rare active signal,"** not a general chip/metadata color. In practice gold got applied to all metadata chips, which (a) dilutes the "rare" intent and (b) pushes small mono text below the readability threshold.

## Fix direction

Reserve gold for one deliberate active state (active mode pill / focused-input caret) and render chips/tags in **ink or the muted green-gray (84,96,84 ≈ 5.7:1)**. If gold must stay on chips, darken it to ≥ 4.5:1 for normal text or ≥ 3.0:1 only when the text is large/bold.

## How this was measured

No vision model was available, so contrast was computed programmatically (Pillow + numpy) on `.work/shots/01-home.png` and `02-results.png`, separating true glyph strokes from antialiasing halos via HSV masking + dark-stroke adjacency (scripts in `.work/qa/`). The low readings are on real gold pixels, not AA artifacts.
