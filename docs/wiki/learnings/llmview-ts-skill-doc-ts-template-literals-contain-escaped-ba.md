---
type: Learning
title: llmview.ts / skill-doc.ts template literals contain escaped backticks; multi-hunk edit calls are atomic
description: Discovered 2026-11-06 while renaming compendium → collections across the LLM-view surfaces.
tags: [llm-view, editing, gotcha, template-literals]
timestamp: "2026-11-06T12:36:26.218Z"
---

# llmview.ts / skill-doc.ts template literals contain escaped backticks; multi-hunk edit calls are atomic

Discovered 2026-11-06 while renaming compendium → collections across the LLM-view surfaces.

**Fact 1 — escaped backticks:** `src/lib/server/llmview.ts` (and `src/lib/server/skill-doc.ts`) build the LLM-view markdown in TS template literals whose content contains **escaped backticks** (`` \` ``). The literal source text includes the escape characters, so a naive plain-text match on the intended substring (e.g. searching for `` `collections` `` inside the template) fails and the edit errors out. When editing these files, match the escaped form or rewrite the whole block via the write path (see the delimiter-dense rule).

**Fact 2 — edit calls are atomic:** a multi-hunk edit call is all-or-nothing — when one hunk fails to match, **none** of the hunks in that call apply. The first rename call (8 hunks, one hitting `llmview.ts`) failed wholesale and had to be redone after fixing the escaping. Verify with grep after redoing, don't assume partial application.
