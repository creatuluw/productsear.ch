---
type: Rule
title: Sweep every render path when renaming display vocabulary
description: "**Guideline:** When renaming display vocabulary on a SvelteKit surface, sweep **every render path**, not just visible body copy: `<svelte:head><title>`, sr-only"
tags: [frontend, copy, checklist, qa]
timestamp: "2026-11-03T09:17:03.564Z"
---

# Sweep every render path when renaming display vocabulary

**Guideline:** When renaming display vocabulary on a SvelteKit surface, sweep **every render path**, not just visible body copy: `<svelte:head><title>`, sr-only headings (`.sr-only` h1), `aria-label`s, input placeholders, stat/vital-signs labels, and nav links.

**When it applies:** any copy/terminology change under `src/routes/` and shared layout components.

**Rationale:** during the "listings" rename (2026-11), the first pass covered homepage + layout but missed `/archive`'s title tag and sr-only h1 — both invisible in screenshots and browser tabs were the only give-away; a follow-up commit (`47fc5b8`) was needed. Head metadata and sr-only text don't show up in visual QA.

**Method:** don't trust your eyes — `grep -rni "<old term>" src/routes src/lib` after every rename; a clean grep is the completion signal, not a green build.
