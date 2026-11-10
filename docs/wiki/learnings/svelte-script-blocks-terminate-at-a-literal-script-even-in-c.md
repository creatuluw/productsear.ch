---
type: Learning
title: Svelte script blocks terminate at a literal </script> — even in comments
description: "**The gotcha (found 2026-11-10 while adding JSON-LD via a `JsonLd.svelte` head component):**"
tags: [svelte, sveltekit, gotcha, seo, json-ld]
timestamp: "2026-11-10T11:26:57.748Z"
---

# Svelte script blocks terminate at a literal </script> — even in comments

**The gotcha (found 2026-11-10 while adding JSON-LD via a `JsonLd.svelte` head component):**

Svelte's template parser scans `<script lang="ts">` blocks for the literal character sequence `</script>` to find the block end — **even inside a TS comment**. A comment like `// prevents a </script> breakout` silently terminates the script block at that point; the rest of the script leaks out and gets parsed as markup, producing confusing cascade errors like:

- `Expected a valid element or component name` pointing at innocuous code (e.g. `Record<string, unknown>` — the `<string,` looks like a tag start)
- `Module '...svelte' has no default export` on every importer of the component

**Rule:** never write the literal closing-tag sequence `</script>` (or an opening `<script`) anywhere inside a Svelte script block — including comments, string literals shown in copy, and regexes. Write "script-close breakout" in prose instead.

Related: the same hazard exists for the RUNTIME payload — `JSON.stringify` of arbitrary data can emit `</script>` and break out of a real JSON-LD script tag. Escape `<` as `\u003c` before injection (JsonLd.svelte does `.replace(/</g, '\u003c')`).
