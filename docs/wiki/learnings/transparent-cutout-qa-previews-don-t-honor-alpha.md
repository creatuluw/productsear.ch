---
type: Learning
title: "Transparent-cutout QA: previews don't honor alpha — verify the alpha channel programmatically"
description: "When producing a transparent cutout of the [[product-search-mascot-illo-character-pack]] (or any character) for web use, the cutout engine warns of possible **m"
tags: [mascot, image-processing, qa, asset-pipeline]
timestamp: "2026-11-01T15:36:40.481Z"
---

# Transparent-cutout QA: previews don't honor alpha — verify the alpha channel programmatically

When producing a transparent cutout of the [[product-search-mascot-illo-character-pack]] (or any character) for web use, the cutout engine warns of possible **magenta fringe** at the silhouette — and the image preview then appears to show a magenta background, suggesting the keying failed.

**Gotcha:** the preview simply doesn't honor transparency. The alpha channel can be perfectly keyed while the preview still renders the (transparent) magenta pixels as visible.

**Verify programmatically, not visually:** check that corner pixels have `alpha = 0` and that there are **zero fully-opaque magenta pixels** anywhere in the image. If both hold, the cutout is clean — a properly despilled cutout with a die-cut cream edge sits invisibly on the paper-colored page canvas.

**Workflow that worked (2026-11-01, mascot footer deployment):** render cutout with alpha → programmatic alpha/magenta check → trim flush to silhouette feet (so the character *stands* on the page's bottom edge) → downscale to >2× display density (footer shows it at ~half size; 163×256 @ 68 KB) → drop in `static/`.

Tags: mascot, image-processing, qa, asset-pipeline
