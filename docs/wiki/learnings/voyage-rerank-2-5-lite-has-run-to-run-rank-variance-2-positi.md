---
type: Learning
title: Voyage rerank-2.5-lite has run-to-run rank variance (±2 positions)
description: The gotcha
tags: [voyage, rerank, search, evaluation]
timestamp: "2026-11-01T00:34:51.553Z"
---

# Voyage rerank-2.5-lite has run-to-run rank variance (±2 positions)

## The gotcha

Voyage `rerank-2.5-lite` scores cluster tightly, so the **same query + same documents can rank a target ±2 positions differently between runs**. During the MotionClone fix (2026-11-01), isolated calls put it at #20, a full-pipeline run dropped it past #30 — initially misread as a systematic bug; reruns showed it was variance.

Also: run-to-run shuffles also mean "minor top-5 reordering" on control queries is usually noise, not regression — check the #1 result and the target's band, not exact positions.

## Rule of thumb

- Never conclude ranking changed (or regressed) from a **single** rerank run — run 3–4× and look at the stable band.
- When a fix lands a target *exactly at the cut* (e.g. #20 with limit 20), that's a coin-flip result — widen the visible band or improve the signal rather than shipping.

Related: the fix context in [[enrich-reranker-input-with-page-content-show-30-results]]; methodology in [[diagnose-search-misses-stage-by-step-before-tuning]].
