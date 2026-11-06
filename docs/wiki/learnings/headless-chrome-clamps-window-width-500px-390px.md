---
type: Learning
title: Headless Chrome clamps window width (~500px) — "390px" screenshots are crops, not reflows
description: "When doing responsive visual QA via headless-Chrome screenshots:"
tags: [testing, visual-qa, headless-chrome, responsive, gotcha]
timestamp: "2026-11-01T01:27:44.054Z"
---

# Headless Chrome clamps window width (~500px) — "390px" screenshots are crops, not reflows

When doing responsive visual QA via headless-Chrome screenshots:

- **Chrome enforces a minimum window width (~500px).** Requesting a 390px-wide capture silently produces a **500px layout cropped to 390px**. This masquerades as a mobile horizontal-overflow bug that does not exist on real devices — the P5 verify round nearly shipped "fixes" for a phantom 390px overflow because of it.
- **CDP `Emulation.setDeviceMetricsOverride` was ignored** in this setup (innerWidth stayed at 980, the no-viewport-meta default). Sizing the actual window works, but only down to the ~500px clamp.
- **Decisive crop-vs-reflow test**: capture the same page at two widths (e.g. 390 and 640). Identical element positions = crop artifact; different positions = real responsive reflow. Only trust overflow findings from the reflow case.
- **Zombie processes**: agent-launched headless Chrome accumulates. Before killing anything, identify ONLY your own instances via `Get-CimInstance Win32_Process -Filter "Name='chrome.exe'"` and inspect `CommandLine`, then kill those exact PIDs — never kill by name (same principle as the global "never kill node by name" rule; the user's real browser must not be touched).

Related: the viewport meta tag in `app.html` was fine — the 980 innerWidth was a headless quirk, not an app bug.
