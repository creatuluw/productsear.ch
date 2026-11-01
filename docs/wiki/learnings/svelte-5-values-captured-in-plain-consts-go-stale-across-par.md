---
type: Learning
title: "Svelte 5: values captured in plain consts go stale across param navigation — use $derived"
description: A Svelte 5 component instance **persists across navigation** to the same route with different params (e.g. `/archive/page/2` → `/archive/page/3`). A plain `cons
tags: [svelte-5, sveltekit, stale-capture, derived, gotcha]
timestamp: "2026-11-01T01:12:01.419Z"
---

# Svelte 5: values captured in plain consts go stale across param navigation — use $derived

A Svelte 5 component instance **persists across navigation** to the same route with different params (e.g. `/archive/page/2` → `/archive/page/3`). A plain `const x = params…` (or `const x = page.url.searchParams…`) captures the value **once** and silently goes stale on param-only navigation.

Svelte 5 flags this as *stale-capture* warnings at compile time — when you see them, convert the captured values to `$derived(...)`:

```svelte
<script lang="ts">
  // BAD: stale when params change without remount
  // const pageNum = data.page;

  // GOOD: recomputes on param navigation
  let { data } = $props();
  const pageNum = $derived(data.page);
</script>
```

**Evidence**: hit in the 2026-11-01 redesign on the paginated archive surface; `svelte-check` surfaced it, the fix was mechanical ($derived).
