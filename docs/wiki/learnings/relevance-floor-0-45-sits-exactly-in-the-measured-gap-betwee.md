---
type: Learning
title: Relevance floor 0.45 sits exactly in the measured gap between noise and matches
description: `RELEVANCE_FLOOR = 0.45` in `src/lib/server/search.ts` is not a guess — it was calibrated (2026-11-01) against real rerank-2.5-lite score distributions using `s
tags: [search, rerank, relevance-floor, calibration]
timestamp: "2026-11-01T01:12:01.418Z"
---

# Relevance floor 0.45 sits exactly in the measured gap between noise and matches

`RELEVANCE_FLOOR = 0.45` in `src/lib/server/search.ts` is not a guess — it was calibrated (2026-11-01) against real rerank-2.5-lite score distributions using `scripts/calibrate-floor.ts`:

- A **nonsense query** ("asdfqwerty"-style) had its best rerank score top out at **≈0.36**.
- **Genuine matches** start at **≈0.45** and known must-find entries score ≈0.64+.
- The floor sits exactly in the gap: nonsense yields **0 strong matches**, while everything users call "should be found" survives.

**Calibration method**: run one good-match query and one nonsense query through the reranker, compare max scores, place the floor between the two populations.

**Related**: rerank scores have run-to-run variance (±2 rank positions) — see [[voyage-rerank-2-5-lite-has-run-to-run-rank-variance-2-positi]]. Re-calibrate with `scripts/calibrate-floor.ts` if the corpus or rerank model changes.
