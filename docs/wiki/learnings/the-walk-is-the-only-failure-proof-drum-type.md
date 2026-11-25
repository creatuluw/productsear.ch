---
type: Learning
title: The Walk is the only failure-proof drum type; The Floor starves silently
description: Of the drum's 10 types, The Walk is the only generator with no LLM/external dependency — it's pure pgvector nearest-neighbor SQL, so it can never 503. All 5 LLM
tags: [drum, rss-feed, pgvector]
timestamp: "2026-11-18T15:23:38.429Z"
---

# The Walk is the only failure-proof drum type; The Floor starves silently

Of the drum's 10 types, The Walk is the only generator with no LLM/external dependency — it's pure pgvector nearest-neighbor SQL, so it can never 503. All 5 LLM-drafted types (One Save, Target-User Pitch, Two Futures, Ambition Path, Impress the Boss) fail when the gateway is down, and The Floor silently returns null when `search_misses` has too few rows (only 2 at time of writing). Net effect: any gateway outage funnels every daily draw into Walk.

Also note the rotation cursor is `count(*) % 10` over published items, so deletions/rejections shift positions — repeated same-type outputs are a fall-through symptom, not a cursor bug.
