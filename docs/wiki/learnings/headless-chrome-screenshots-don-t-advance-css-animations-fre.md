---
type: Learning
title: Headless-Chrome screenshots don't advance CSS animations — freeze frames with animation-play-state
description: When visually verifying CSS animations via headless-Chrome screenshots, letting the page "run" for a while (or relying on virtual time) does not reliably advanc
tags: [testing, css, animation, headless-chrome, visual-qa]
timestamp: "2026-11-01T13:27:32.623Z"
---

# Headless-Chrome screenshots don't advance CSS animations — freeze frames with animation-play-state

When visually verifying CSS animations via headless-Chrome screenshots, letting the page "run" for a while (or relying on virtual time) does not reliably advance CSS animations — a screenshot taken "mid-cycle" captured t≈0, where every pulse cell was dark.

**The technique that works:** freeze the animation at a chosen point in the cycle:

- Set `animation-play-state: paused` on the animated elements.
- Use a negative `animation-delay` (e.g. `-1.2s` on a 2.4s cycle) to select which point of the keyframe timeline the frozen frame shows.

This turns a time-dependent animation into a deterministic single frame you can screenshot and assert on. Used successfully to verify the [[waveloader-component]] gray→blue gradient ramp at mid-cycle before pushing.
