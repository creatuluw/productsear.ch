---
type: Artifact
title: Spotlight write-up examples (16 formats)
description: What it is
tags: [spotlight, write-ups, examples, editorial, design-system]
timestamp: "2026-11-19T10:26:43.255Z"
---

# Spotlight write-up examples (16 formats)

## What it is

Sixteen fully-drafted example write-ups — one per Spotlight format — each built from **live te9_dev corpus data** and styled with the **exact productsear.ch design system**, stored at `docs/write-up-examples/` (16 pages + `index.html` gallery + `_spotlight.css` master stylesheet, pages self-contained with inlined CSS).

## What it documents

- The editorial core of the [the-drum-feed](./the-drum-feed.md)'s planned sibling surface: the **Spotlight feature** (admin search → promote listing(s) → pick format → draft → email approval → `/spotlight/[slug]`)
- Format families: **A** single-listing (Teardown, First-Run Guide, Curator's Note, Comeback Review, Underdog vs Default) · **B** clusters (Head-to-Head, Listicle, Alternatives, Toolkit/Stack, Collection Tour) · **C** data research (State-of Report, Trend Brief, Search Demand Memo, Graveyard Report) · **D** explainer/narrative (Field Guide, Workflow Story)
- Real data used per example: Hindsight (#978), Better Fullstack (#583), HMML (#508766), n8n (#-2, saved 2023), Perplexica (#1343/#711), Paseo/Shannon/AgentOS, GuppyLM/Dot/Doberman/Openship, Fabric & pluto, archetype stats (ai-coding-agent 538 with the 2022:3→2026:492 curve; agent-framework 792; rag-search 120), 30-day intake (458 saves/148 domains), and day-one [search-logging-search-logs](./search-logging-search-logs.md) rows
- **Format**: standalone HTML, exact site tokens (Hanken Grotesk + Martian Mono, OKLCH warm-paper palette, #0021FF accent, light/dark) — generated 2026-11-19 in the planning session for the Spotlight feature
- Generated from: live DB queries (archetype counts, per-year saves, domain concentration, recent saves, search logs, dead-repo scan)

## Decisions embedded

- All 16 formats enter the Spotlight workflow (user: "add me all types to the workflow")
- Every example carries the site's trust pattern: corpus-evidence boxes with real listing ids, question-style closer, "not published" disclaimer
- The Search Demand Memo (13) is positioned as the format **only productsear.ch can run** (search_logs + corpus in one place)

## Lifecycle

- First created: 2026-11-19 — user asked for every format demonstrated with real data before building the admin feature. Next: pick none/all already settled (all 16) → build the Spotlight admin + publishing surface.
- 2026-11-19 — `HANDOFF.md` added to this folder: the pickup document for the Spotlight build (goal, existing assets, proposed shape, dependencies incl. the open Railway LLM-gateway blocker, and the acceptance-criteria checklist).
