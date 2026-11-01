---
type: Decision
title: Serve the LLM usage guide at /skill.md and distill it into the llms-view preamble
description: Context
tags: [llms-view, agents, skill-md, redesign]
status: accepted
timestamp: "2026-11-01T00:50:46.877Z"
---

# Serve the LLM usage guide at /skill.md and distill it into the llms-view preamble

## Context

The dual-view decision gives every route a `humans | llms` tab twin at `?view=llm`. Separately, the LLM-facing usage guide for the search API lives in a skill file **outside the repo** (`E:\skills.te9.dev\productsear.ch\SKILL.md` — query patterns, triage/verify workflow, limits). In the P2 interview (2026-11-01) the user asked that the LLM be made aware of this skill, and liked the host0.ai pattern of a self-servable usage guide.

## Choice

1. Every `llms` view opens with a compact **"using this site as an LLM" preamble** distilled from SKILL.md.
2. The skill itself is served publicly at **`productsear.ch/skill.md`** so any agent can self-serve the usage guide.

## Alternatives considered

- **Link out to the external skill file** — agents can't assume filesystem access to `E:\skills.te9.dev`, and an external file drifts from the deployed site.
- **No preamble, no route** — LLM visitors land on llms views without API orientation, defeating the purpose of dual-view.

## Rationale

Agents increasingly fetch a well-known `/skill.md` (host0.ai pattern). Serving it from the deployed site guarantees the guide matches the live API, and the preamble gives inline orientation on every llms surface.

## Consequences

- `/skill.md` becomes a public route mirroring the SKILL.md content.
- SKILL.md is now dual-homed: source of truth stays in `skills.te9.dev`, but it must be updated whenever shipped behavior changes — e.g. its "20 results per page; there is no pagination" line goes stale once the redesign ships pagination. Updating SKILL.md is part of the shipping checklist.
