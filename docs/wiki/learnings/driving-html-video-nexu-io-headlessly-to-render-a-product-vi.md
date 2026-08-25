---
type: Learning
title: Driving html-video (nexu-io) headlessly to render a product video
description: "When using **html-video** (https://github.com/nexu-io/html-video) to render a video about this app:"
tags: [html-video, video, rendering, tooling]
timestamp: "2026-07-07T10:53:55.654Z"
---

# Driving html-video (nexu-io) headlessly to render a product video

When using **html-video** (https://github.com/nexu-io/html-video) to render a video about this app:

- **Prereqs**: Node 20+, pnpm, ffmpeg, and Playwright Chromium (`npx playwright install chromium`). `html-video doctor` flags a missing browser even though the rest works.
- **The Studio is not worth driving headlessly.** It's a multi-turn, card-driven, Chinese-first conversational agent flow (opener→type→content→style→format→confirm→generate); each phase spawns a real `claude`/`opencode` CLI call via SSE. Skip it. Use the **CLI** instead: `node packages/cli/dist/bin.js` → `project-create` → (set frames) → `project-render --output X.mp4`.
- **The engine is the value.** The Hyperframes adapter records self-contained HTML with headless Chromium and encodes to MP4 with ffmpeg. Templates are just style references.
- **CRITICAL — the freeze/unfreeze breaks `animation-delay` sequencing.** The renderer injects `animation-play-state: paused` on `*` at document_start (so animations don't run during font load), then removes it right before recording. For animations that are *paused-from-creation then resumed*, Chromium does NOT cleanly count `animation-delay` from resume-time, so a single HTML file that sequences 6 scenes via staggered `animation-delay` renders wrong (content appears only at scene boundaries, blank in holds). Even percentage-window keyframes over one long timeline misbehave under the recording context.
- **Robust fix = multi-frame path, one static HTML per scene.** Write N self-contained scene HTML files, inject them as the project's `frames[]` (each `{graphNodeId, htmlPath, durationSec, order}`) directly into `.html-video/projects/<id>/project.json`, then `project-render`. Each frame is a separate Chromium load, so no cross-scene timing. A single short fade-in (`animation: in .7s ease both`, no delay) per frame works fine.
- **Single-frame `project-render` hardcodes `duration:'auto'`** and its duration-probe (max finite `animation-duration + animation-delay`, ignoring `infinite`) is unreliable for catching long tails — use the multi-frame path with explicit `durationSec` per frame instead.
- **The `claude` and `opencode` CLIs are auto-detected** as the agent backend; no `ANTHROPIC_API_KEY` needed for the Studio, but you don't need the Studio at all for the CLI render path.

Files for the productsear.ch promo live in the html-video checkout at `templates/productsearch-promo/` (manifest + `source/index.html` single-file version + `source/scenes/s1..s6.html` multi-frame version). Output: `e:/productsear.ch/productsearch-promo.mp4`.
