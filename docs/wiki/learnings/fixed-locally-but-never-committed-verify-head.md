---
type: Learning
title: Fixed locally but never committed — verify HEAD bytes when prod diverges (OG font incident)
description: "**The incident (2026-11-07, commit `faf3818`):** production Bluesky cards rendered with **all text missing** while the local working tree rendered fine. The rea"
tags: [gotcha, fonts, og-images, git, deployment-drift, resvg]
timestamp: "2026-11-07T12:12:53.578Z"
---

# Fixed locally but never committed — verify HEAD bytes when prod diverges (OG font incident)

**The incident (2026-11-07, commit `faf3818`):** production Bluesky cards rendered with **all text missing** while the local working tree rendered fine. The real TTFs had been pulled locally by an earlier session (after the gstatic-EOT gotcha) but **never committed** — HEAD still shipped the EOT garbage fonts, so production resvg silently rendered zero text.

**The diagnostic that pinned it:** compare bytes in HEAD, not the working tree: `git show HEAD:static/fonts/<file>.ttf | head -c 4` — a real TTF starts with the sfnt magic `00 01 00 00`; the committed files started `88e0…`/`78e0…` (EOT junk).

**Martian Mono specifics** (added to the OG cards this turn): the official source is the **`evilmartians/mono`** GitHub releases — not gstatic; the resvg family name is **`Martian Mono Std Rg`** (Regular/Bold styles); name tables are UTF-16 — parse them with code, don't grep raw bytes.

**Rule of thumb:** when a render bug reproduces in production but not locally, diff **committed** assets against working-tree assets before debugging code — an uncommitted local fix masks the root cause.
