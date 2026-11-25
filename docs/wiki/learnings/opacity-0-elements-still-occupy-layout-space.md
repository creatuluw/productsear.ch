---
type: Learning
title: opacity-0 elements still occupy layout space — closed tipboxes caused 54px of phantom overflow
description: "Discovered 2026-11-06 while probing 54px of hidden horizontal overflow on 390px phones: the three closed tipboxes were hidden with `opacity: 0` but kept their f"
tags: [css, frontend, gotcha, mobile, layout]
timestamp: "2026-11-06T23:46:41.433Z"
---

# opacity-0 elements still occupy layout space — closed tipboxes caused 54px of phantom overflow

Discovered 2026-11-06 while probing 54px of hidden horizontal overflow on 390px phones: the three closed tipboxes were hidden with `opacity: 0` but kept their full ~300px layout width, hanging off the viewport's right edge and inflating `scrollWidth` even though nothing was visibly wrong. `opacity: 0` hides paint, not layout.

Fix pattern: `display: none` when closed, and when open clamp to the viewport with the `translate` property — it composes with the centering `transform` instead of overriding it.

Applies to any fade/tooltip/drawer positioned partially offscreen: hidden states must be verified with [[rules/probe-responsive-overflow-programmatically-don-t-eyeball-sc]], not the eye.
