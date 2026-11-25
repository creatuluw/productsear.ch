---
type: Decision
title: Product-search corpus pipeline is self-contained in productsear.ch
description: Context
tags: [pipeline, architecture, self-containment, ingestion]
status: accepted
timestamp: "2026-11-06T10:17:03.275Z"
---

# Product-search corpus pipeline is self-contained in productsear.ch

## Context

The corpus enrichment chain lived in `E:\te9.dev` (the older site): `sync-raindrop.js` (Raindrop → `te9_dev.bookmarks` mirror), `crawl-bookmarks.js` (→ `bookmark_content`), `analyze-bookmarks.js` (LLM → `bookmark_analysis`). productsear.ch only owned embedding + archetypes, so it depended on the other repo for the crawl/analyze steps — and manual ingests (like the 522 repo insert) left rows without enrichment (homepage `analyzed` vital sign fell 92% → 81%).

## Choice

Import the three scripts into `productsear.ch/scripts/` (adapted only to `dotenv/config` env loading) with npm aliases `sync` / `crawl` / `analyze`, and extend the nightly workflow to run the full chain: crawl → analyze → archetypes → embed. `generate-digest.js` and `setup-db.js` stay te9.dev-only (email digest / garden_entrance — unrelated to product search).

## Alternatives considered

- Keep depending on te9.dev's scripts — rejected: cross-repo coupling, enrichment lag for manual ingests, no single place describing the A–Z flow.
- Rewrite the scripts in TypeScript to match repo style — rejected for now: verbatim JS keeps the diff auditable against the source scripts; both repos are `"type": "module"` so plain ESM JS works with `node`.

## Rationale

productsear.ch owns the search product and the app-owned tables (`bookmark_embeddings`, `bookmark_archetypes`); the source tables (`bookmarks`, `bookmark_content`, `bookmark_analysis`) are shared mirrors — whoever enriches them serves both consumers. Self-containment means any future ingest is fully processed without leaving this repo.

## Consequences

- **Duplication is acceptable**: te9.dev keeps running its copies (upserts are idempotent; both target the same tables). No coordination needed, but a behavior change in one copy won't propagate to the other.
- **sync-raindrop.js is upsert-only** (`ON CONFLICT (raindrop_id) DO UPDATE`) — verified it never deletes, so synthetic negative-id rows (manual ingests) survive syncs.
- Workflow needs an optional `ZAI_API_KEY` secret in GitHub (analyze falls back to the Railway LLM gateway without it). Pushing `.github/workflows/` changes requires the `workflow` scope on the git token.
- Pipeline scripts need `jsdom`, `@mozilla/readability`, `turndown` (added to package.json).
