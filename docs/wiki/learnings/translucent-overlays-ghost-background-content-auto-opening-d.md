---
type: Learning
title: Translucent overlays ghost background content — auto-opening drawers go canvas-solid
description: Discovered 2026-11-07 while building the homepage system drawer (`src/routes/+page.svelte`, commit `9168e3d`).
tags: [frontend, css, design, gotcha]
timestamp: "2026-11-07T11:19:56.310Z"
---

# Translucent overlays ghost background content — auto-opening drawers go canvas-solid

Discovered 2026-11-07 while building the homepage system drawer (`src/routes/+page.svelte`, commit `9168e3d`).

**The gotcha:** with a translucent drawer background, the page footer (and faint decorative blobs) ghosted through the panel — visible in desktop screenshots and the phone mid-search state, with the footer bleeding under the vital-signs grid.

**The fix:** the drawer uses the opaque canvas token (`bg-canvas`), a hairline top edge (`border-t border-ink/10`), and a soft upward shadow for separation. Translucency + backdrop-blur (`bg-canvas/90 backdrop-blur`) is fine for the small floating `system ▴` chip, where nothing critical sits behind.

**Rule of thumb:** any overlay that opens above page content (drawers, bottom sheets, panels) gets an opaque `var(--canvas)` background; save translucency for small floating controls where ghosting can't hurt. Same family as the `opacity: 0` layout-space gotcha — hidden ≠ gone: alpha layers always show what's behind.
