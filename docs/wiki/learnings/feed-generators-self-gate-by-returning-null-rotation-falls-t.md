---
type: Learning
title: Feed generators self-gate by returning null; rotation falls through
description: "Frequency control is implemented inside each generator: `walk.ts` returns `null` when <20 days since the last *published* walk, and the rotation's existing catc"
tags: [feed, walk, generators]
timestamp: "2026-11-18T15:31:18.672Z"
---

# Feed generators self-gate by returning null; rotation falls through

Frequency control is implemented inside each generator: `walk.ts` returns `null` when <20 days since the last *published* walk, and the rotation's existing catch-and-skip semantics advance to the next type. No rotation logic changes are needed to throttle a generator — this is the established pattern for gating cadence.
