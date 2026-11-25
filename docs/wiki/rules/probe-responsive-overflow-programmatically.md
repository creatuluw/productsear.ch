---
type: Rule
title: Probe responsive overflow programmatically; don't eyeball screenshots
description: "**Guideline:** For any responsive change, verify overflow by measurement, not by looking at screenshots. Build (`npm run build`), serve `node build` on a known "
tags: [qa, responsive, frontend, testing, playwright]
timestamp: "2026-11-06T23:46:41.434Z"
---

# Probe responsive overflow programmatically; don't eyeball screenshots

**Guideline:** For any responsive change, verify overflow by measurement, not by looking at screenshots. Build (`npm run build`), serve `node build` on a known port, then drive `playwright-core` (install with `--no-save` so package.json stays untouched; browser binaries already on this machine) to load each surface at real viewports (320 / 390 / 768 / 1280) and evaluate:

- total overflow: `document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth`
- culprits: scan `document.querySelectorAll('*')` bounding rects and list elements whose right edge exceeds the viewport width

Screenshots judge looks; the probe judges truth.

**When it applies:** any responsive/layout change, before declaring done. Pair with the headless-Chrome width-clamp learning when interpreting screenshot widths.

**Rationale:** in the 2026-11-06 mobile adaptation pass, screenshots at all three viewports looked beautiful while a 54px phone overflow (three closed 300px tipboxes) and an 11px tablet overflow (header `shrink-0` cluster) hid underneath; the probe pinpointed both culprits in one pass and verified 0px after the fixes.
