---
type: Rule
title: Every ?view=llm branch must render an LLM document — including no-parameter fallbacks
description: "**Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must return the LLM markdow"
tags: [llms-view, dual-view, content-negotiation, fallbacks]
timestamp: "2026-11-01T02:02:19.384Z"
---

# Every ?view=llm branch must render an LLM document — including no-parameter fallbacks

**Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must return the LLM markdown document. Never fall through to the human UI with the llms tab active.

**How:** Build llm markdown via the shared builders in `src/lib/server/llms.ts` (e.g. `corpusOverviewMd()`, `mdResponse()`), not inline in page loads. When a route adds a new llm branch, check the "no query / default case" explicitly — that is exactly where the bug hides.

**Evidence:** 2026-11-01 — `/?view=llm` with no `q` on `/` rendered the humans home with the llms tab active, because the load only built llm markdown when `q` was present, even though the overview markdown existed in `llms.ts` for raw clients. Fixed (commit f3521ab) by extracting `corpusOverviewMd()` and calling it from `routes/+page.server.ts` for the no-query case.
