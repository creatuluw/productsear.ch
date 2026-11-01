---
type: Entity
title: Bookmark archetype system
description: The bookmark archetype system classifies every bookmark in the corpus into a curated set of **30 canonical archetypes** (AI Coding Agent, RAG & Search, Open Sou
tags: [archetypes, classification, compendium, data-model, jsonb]
timestamp: "2026-11-01T01:12:01.419Z"
---

# Bookmark archetype system

The bookmark archetype system classifies every bookmark in the corpus into a curated set of **30 canonical archetypes** (AI Coding Agent, RAG & Search, Open Source Library, …) and stores the result on an app-owned Postgres table. It powers the `/compendium` surface's archetype roll-up cards.

## Why it matters?

The raw corpus carries **1,320 messy free-form analysis categories**. Archetypes collapse that noise into a stable, human-readable roll-up the compendium can group by — without writing to the read-only Raindrop source tables.

## Details

- **Location**: `src/lib/server/archetypes.ts` (canonical set + classifier), `scripts/migration-archetypes.sql` (DDL), `scripts/backfill-archetypes.ts` (one-shot backfill)
- **Interface / Schema**: `ARCHETYPES: Archetype[]` — `slug`, `name`, ordered `patterns: RegExp[]` (**specific archetypes must be listed before general ones**); `ARCHETYPE_BY_SLUG` map; `FALLBACK_ARCHETYPES = ['utility-other']`. Multi-entry: up to **4 archetypes per bookmark**, stored as JSONB on the app-owned `te9_dev.bookmark_archetypes` table.
- **Configuration**: fully deterministic regex rules over category + purpose + tags + title + domain — no LLM call, no API key, idempotent re-runs.
- **Coverage**: all **3,764** bookmarks classified across 30 archetypes; `oss-library` leads, as expected for a github-heavy corpus.

## Relationships

- [store-bookmark-archetypes-as-multi-entry-jsonb-on-an-app-own](./store-bookmark-archetypes-as-multi-entry-jsonb-on-an-app-own.md) — the data-model decision this implements (multi-entry JSONB, app-owned table)
- [api-search-endpoint](./api-search-endpoint.md) — adjacent pipeline; archetypes are display/grouping metadata, **not** a ranking signal
- Source tables (`te9_dev.bookmarks`, `bookmark_analysis`) — read-only mirrors; this table is the one place the app owns its own data

## Lifecycle

- First added: 2026-11-01 — built as part of the impeccable redesign (the compendium surface needs an archetype roll-up).
- Backfill: full-corpus run classified 3,764/3,764 bookmarks; distribution sanity-checked.
