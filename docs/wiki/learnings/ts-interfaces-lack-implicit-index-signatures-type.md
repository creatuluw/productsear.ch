---
type: Learning
title: TS interfaces lack implicit index signatures — type aliases have them
description: "**The rule (hit 2026-11-06 in The Drum slice C):** a TypeScript `interface` is **not** assignable to `Record<string, unknown>` — `Index signature for type 'stri"
tags: [[typescript, gotcha, feed, types]]
timestamp: "2026-11-06T20:27:00.787Z"
---

# TS interfaces lack implicit index signatures — type aliases have them

**The rule (hit 2026-11-06 in The Drum slice C):** a TypeScript `interface` is **not** assignable to `Record<string, unknown>` — `Index signature for type 'string' is missing in type 'X'` — because interfaces support declaration merging, so TS refuses to invent an index signature for them. A `type` alias of the exact same object shape gets an implicit index signature and assigns fine.

**When it bites:** helper functions typed to accept generic JSON-ish payloads (`Record<string, unknown>`, `signals: Record<string, unknown>` in the feed types) fed from interface-typed objects.

**Fix:** declare the shape as a `type` alias instead of an interface (or add an explicit index signature — but that weakens the type). The feed subsystem uses type aliases for its body shapes for this reason.
