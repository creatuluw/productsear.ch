---
type: Learning
title: When LLM providers are down, the drum degenerates into consecutive Walk items
description: "**The fact (established 2026-11-18):** when the LLM drafting chain is down, The Drum's round-robin degenerates into **consecutive Walk items** — the same type d"
tags: [the-drum, feed, rotation, llm-drafting, failure-mode, walk]
timestamp: "2026-11-18T15:22:58.937Z"
---

# When LLM providers are down, the drum degenerates into consecutive Walk items

**The fact (established 2026-11-18):** when the LLM drafting chain is down, The Drum's round-robin degenerates into **consecutive Walk items** — the same type day after day. Observed live: draws of 11-14, 11-16, 11-17 were all The Walk.

**The mechanism:** the rotation cursor is `count(te9_dev.feed_items) % 10` over the fixed order [pulse, resurrections, tombola, floor, one-save, target-user-pitch, two-futures, ambition-path, walk, impress-the-boss]. Each draw walks the order from the cursor and takes the first generator that produces something. When the five LLM-drafted types (one-save, target-user-pitch, two-futures, ambition-path, impress-the-boss) all throw, and The Floor returns null (starving: needs accumulated `search_misses`, only 2 rows exist), the only generator that can succeed is **The Walk — pure pgvector SQL, zero external dependencies**. Draw cursors at positions 3, 4, 5 all fell through to position 8 → three Walks in a row. With cursor at 6 the next draw (due 2026-11-18 ~16:44 UTC) would draw a **fourth** Walk.

**The root cause of the LLM failures** (GitHub Actions run logs 43589473464 / 43867771793): `all draft providers failed — railway-gateway: railway-gateway API error 503: {"error":{"message":"Loading model","type":"unavailable_error","code":503}}`. The Railway-hosted fallback gateway model never finishes loading (cold start that never warms or service down); the z.ai (GLM-5) primary also fails before it. Same provider chain as `scripts/analyze-bookmarks.js` (src/lib/server/feed/llm.ts).

**Why the catch-and-skip safety net causes this:** the design goal was "a broken generator must never stall the drum" — which works, but because Walk is the only generator that *cannot* fail, provider outages don't stall the drum, they funnel every draw into Walk. A fix could add per-type last-drawn tracking or skip/retry logic so a draw that had to fall through N slots does not always land on Walk.

**Follow-up (2026-11-18):** Walk-specific mitigation shipped — the generator now enforces a 20-day minimum gap on published walks (see [decisions/the-walk-demoted-to-half-frequency-20-day-minimum-gap-and-it](../../decisions/the-walk-demoted-to-half-frequency-20-day-minimum-gap-and-it.md)), so an outage can no longer produce consecutive Walks. The underlying LLM-gateway outage itself remains open — the five LLM-drafted types stay dead until it is fixed or replaced.

**Follow-up (2026-11-19):** generalized — the rotation itself now never draws the same type as the last published item (see [decisions/drum-rotation-never-draws-the-same-type-twice-in-a-row](../../decisions/drum-rotation-never-draws-the-same-type-twice-in-a-row.md)). Consecutive-type streaks of any kind are structurally impossible; during a total outage the drum may skip a day instead of repeating. Proof the mitigations work: the 2026-11-18 draw (first after the Walk gate deployed) fell through cursor 6→8→0 and published **The Pulse** instead of a fourth Walk.
