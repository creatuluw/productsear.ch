---
type: Learning
title: "Corpus schema facts: raindrop_created_at, analysis who/what/how/when fields, 1,320 messy categories"
description: Discovered 2026-11-01 during the compendium-page design (facts homework before P2 interview).
tags: [compendium, bookmarks, bookmark_analysis, schema, categories, raindrop_created_at]
timestamp: "2026-11-01T00:41:02.927Z"
---

# Corpus schema facts: raindrop_created_at, analysis who/what/how/when fields, 1,320 messy categories

Discovered 2026-11-01 during the compendium-page design (facts homework before P2 interview).

## What the corpus actually contains

The `te9_dev.bookmarks` table has a **`raindrop_created_at`** column — the true "date of addition" for an ordered list, rather than inferring from `synced_at` (which is skewed ~4 days ahead and rewritten every sync pass; see [[synced-at-runs-4-days-ahead-of-wall-clock-sync]]).

The `bookmark_analysis` table carries explicit **who/what/how/when** fields:

- `purpose` — what the bookmark is for
- `how_to_use` — how to use it
- `when_to_use` — when to reach for it

So the compendium's "who, what, how, when" per entry is direct data, not something to synthesize.

## Category stats (the grouping problem)

- **3,469** rows have been analyzed
- **1,320 distinct categories** across those rows — top-heavy with near-duplicates:
  - "AI Development Tool" = 177
  - "AI Agent Framework" = 121
  - "Developer Tool" = 106
  - …and many semantically-near variants ("AI Development Tool" / "AI Developer Tool" / "Developer Tool")
- A compendium with 1,320 raw groups is unusable; the raw category needs normalization into a small set of canonical archetypes (proposed ~12–18, computed at render time from the raw category string, raw category still shown per entry — pending user confirmation as of this writing).

## Why it matters

- Any future "sort by date added" or chronological view should use `raindrop_created_at`, never `synced_at`.
- Any per-entry metadata UI (compendium, detail views) can pull purpose/how_to_use/when_to_use directly from `bookmark_analysis`.
- Any grouping/faceting by category must roll up the 1,320 near-duplicate labels — raw grouping doesn't work. See [[bookmarks-table-is-a-read-only-mirror-the-raindrop]] for why these tables can't be rewritten to fix it.
