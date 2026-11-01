---
type: Decision
title: "Dual-view surfaces: humans | llms tabs with ?view=llm on every route"
description: Context
tags: [design, gui, llm-collaboration, compendium, url-driven-state]
status: accepted
timestamp: "2026-11-01T00:45:34.032Z"
---

# Dual-view surfaces: humans | llms tabs with ?view=llm on every route

## Context

During the compendium-page design interview (P2), the user added a major scope requirement for the GUI: every surface should have a **humans | llms** tab pair, each tab with its own URL and content — so a page's content (or its URL) can be pasted straight into an LLM chat and used collaboratively with the human user.

## Decision

Every major surface (search, all-entries, compendium) ships two views of the same content:

- **humans** — the designed GUI (the instrument-grade visual system)
- **llms** — the same content rendered as dense, paste-ready markdown (llms.txt-style: structured headings, flat lists, URLs inline)

URL pattern: `?view=llm` query parameter on each route (composing with existing params, e.g. `?q=…&mode=ask&view=llm`). The tab switcher is a plain link — no JS state.

## Alternatives considered

- **Separate routes per view** (e.g. `/llm/search`) — rejected: a query param keeps both views of the same resource under one canonical route and composes with the existing query-param contract.
- **JS-driven tab state** — rejected: breaks shareability and back/forward navigation, contradicting [[url-driven-search-state]].

## Rationale

- LLM collaboration is a first-class use case: paste-ready markdown makes any page usable as context in a chat with the human user.
- Query-param addressing keeps views shareable, bookmarkable, and back/forward-navigable — consistent with the URL-driven search state pattern.
- Link-based tabs work without JS and the URL always reflects the active view.

## Consequences

- Every new route/page must render **both** views from the same data — plan the markdown rendering alongside the GUI, not as an afterthought.
- Extends [[url-driven-search-state]] with a `view` dimension.
