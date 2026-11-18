---
type: Entity
title: llms.txt agent index
description: `/llms.txt` — the curated, llmstxt.org-convention index of productsear.ch for LLMs and AI agents, generated at request time with live corpus stats so agents alw
tags: [llm, agents, llms-txt, discovery]
timestamp: "2026-11-10T11:32:02.231Z"
---

# llms.txt agent index

`/llms.txt` — the curated, llmstxt.org-convention index of productsear.ch for LLMs and AI agents, generated at request time with live corpus stats so agents always see real numbers.

## What it is

The agent-facing front door of the [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md): one markdown file that tells an agent what the site is, how to search it, what surfaces exist, and how the data behaves. Announced site-wide via `<link rel="llms-txt">` in the head and the HTTP `Link:` header on every HTML response (`</llms.txt>; rel="llms-txt"`).

## Details

- **Location**: `src/routes/llms.txt/+server.ts`
- **Interface**: `GET` → `text/markdown; charset=utf-8`, `Cache-Control: public, max-age=3600`
- **Live stats**: three parallel DB queries — total bookmark count, entries added in the last 30 days, `max(synced_at)` date — embedded in the doc so the numbers agents see are real
- **Sections**: Search (the primary use — links to the agent usage guide `/skill.md`, the JSON API `GET /api/search?q={problem-shape}&page=N` with `&format=md`, and the `?view=llm` markdown twins), Surfaces (home, archive, collections, The Drum, methodology, RSS, sitemap), Collections (all 30 archetypes with one-line descriptions), Data notes (retrieval stack summary, robots.txt stance, cookieless Plausible)
- **Convention details**: all links are absolute URLs (agents fetch from arbitrary contexts), per the llmstxt.org convention
- Companion: the discovery mentions added to `src/lib/server/llms.ts` and `skill-doc.ts` keep the `?view=llm` preamble pointing at the same surfaces

## Relationships

- Implements [pages/concepts/search-and-llm-discovery-layer](../concepts/search-and-llm-discovery-layer.md) — discovery surface for agents
- [pages/concepts/llm-content-negotiation](../concepts/llm-content-negotiation.md) — the twins it advertises
- [pages/entities/bookmark-archetype-system](./bookmark-archetype-system.md) — supplies the collection list
- [decisions/serve-the-llm-usage-guide-at-skill-md-and-distill](../../decisions/serve-the-llm-usage-guide-at-skill-md-and-distill.md) — the `/skill.md` guide it links first

## Lifecycle

- First added: 2026-11-10 — SEO/LLM discovery pass, commit `76623ed`
