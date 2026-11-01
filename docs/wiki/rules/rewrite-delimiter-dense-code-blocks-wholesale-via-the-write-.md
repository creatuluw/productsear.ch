---
type: Rule
title: Rewrite delimiter-dense code blocks wholesale via the write path
description: Guideline
tags: [editing, shell, template-literals, gotcha]
timestamp: "2026-11-01T01:49:55.402Z"
---

# Rewrite delimiter-dense code blocks wholesale via the write path

## Guideline

When editing code that is dense with nested delimiters — JS template literals containing backticks, `${}` interpolations, or escaped inner backticks — do **not** apply blind regex/replace passes via shell or python one-liners. Rewrite the entire block through the file write/edit path with real (non-shell-mangled) delimiters instead.

## When it applies

- Any block whose content and delimiters share characters (a markdown-in-template-literal, a regex containing backticks, nested quoting).
- Any edit where you can't see the literal bytes of the original before replacing.

## Rationale / evidence

Rewriting the instruction preamble in `src/lib/server/llmview.ts` (2026-11-01), two blind python replaces on the template literal "broke both directions" — plain-vs-escaped backtick delimiters were swapped incorrectly — corrupting the file and forcing a manual rewrite of the whole function block. The write path preserves intent; blind replaces guess at escaping context they cannot see.
