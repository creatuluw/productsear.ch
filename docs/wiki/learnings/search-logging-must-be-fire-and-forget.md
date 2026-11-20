---
type: Learning
title: Search logging must be fire-and-forget
description: "Logging inserts into the search path follow the same contract as the existing `search_misses` insert: never awaited, never thrown into the caller — a logging fa"
tags: [convention, telemetry]
timestamp: "2026-11-18T15:50:53.934Z"
---

# Search logging must be fire-and-forget

Logging inserts into the search path follow the same contract as the existing `search_misses` insert: never awaited, never thrown into the caller — a logging failure cannot slow or break a search. Extend this pattern for any future telemetry.
