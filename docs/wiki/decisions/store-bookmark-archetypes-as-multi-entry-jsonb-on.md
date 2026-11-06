---
type: Decision
title: Store bookmark archetypes as multi-entry JSONB on an app-owned table
description: Context
tags: [compendium, archetypes, data-model, jsonb, design-interview]
status: accepted
timestamp: "2026-11-01T00:43:27.921Z"
---

# Store bookmark archetypes as multi-entry JSONB on an app-owned table

## Context

During the compendium-page design interview (Q1), we settled how bookmark archetypes — modern categories suited to our workforce, business domains, and tool types — are modeled. An earlier sketch proposed ~12–18 archetypes computed at render time from the messy raw categories (~1,320 distinct values). The user asked for **20–30 relevant, modern archetypes** and a **flexible JSON field supporting multi entries and combinations**.

## Choice

- **20–30 modern archetypes** (workforce/business-domain/tool-type oriented, more granular than the earlier ~12–18 sketch).
- **Stored as a multi-entry JSON array** — `archetypes jsonb` — on an **app-owned table** that lives beside `bookmark_embeddings`, keyed by `bookmark_id`. A bookmark can carry **several archetypes** (multi-entry, combinable).
- **Backfilled by a deterministic classifier** over `category` / purpose / tags from the corpus — deterministic so re-runs are stable.

## Alternatives considered

- **Compute archetypes at render time** (the earlier sketch) — rejected: adds per-request work and hides the taxonomy from queries; a materialized field is queryable and groupable.
- **Write archetypes onto the source tables** (`te9_dev.bookmarks` etc.) — impossible: they are **read-only mirrors** that the external Raindrop→DB sync rewrites every pass (see [the mirror learning](../learnings/bookmarks-table-is-a-read-only-mirror-the-raindrop.md)). The app owns only `bookmark_embeddings`; derived data must live in app-owned tables beside it.
- **A fixed enum / single-value column** — rejected in favor of JSONB: the user explicitly wants multi-entry and combinations, and the taxonomy may evolve.

## Consequences

- New app-owned table/column to create and backfill (a deterministic classifier script over category/purpose/tags, akin to the embed backfill).
- The compendium page **groups bookmarks by archetype**; entries can appear in multiple groups.
- Archetype taxonomy is now versioned data, not code — updating the classifier means re-running the backfill.
- Related schema homework: [corpus schema facts](../learnings/corpus-schema-facts-raindrop-created-at-analysis.md).
