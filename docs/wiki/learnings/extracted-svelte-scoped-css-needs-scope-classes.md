---
type: Learning
title: Extracted Svelte scoped CSS needs scope classes handled or standalone test harnesses match nothing
description: "When extracting compiled Svelte CSS into a standalone test harness (e.g. a plain HTML file to screenshot), naive selector stripping breaks everything silently: "
tags: [svelte, testing, css, gotcha, visual-qa]
timestamp: "2026-11-01T13:27:32.623Z"
---

# Extracted Svelte scoped CSS needs scope classes handled or standalone test harnesses match nothing

When extracting compiled Svelte CSS into a standalone test harness (e.g. a plain HTML file to screenshot), naive selector stripping breaks everything silently: Svelte compiles scoped rules with scope classes baked in, e.g.

```css
.wave-loader.izzyoe i:where(.svelte-izzyoe):nth-child(1) { … }
```

A crude strip of the hash (`.izzyoe`) leaves `:where(.svelte-izzyoe)` behind, so **no rule matches the test markup** and the component appears not to render — which was misread as a compositor/animation bug for several debug iterations.

**Correct approaches:**

- Best: strip the scope hash **everywhere it appears**, including inside `:where(...)` / `:is(...)` pseudo-classes, in one pass.
- Or replicate the scope class on the test markup (add `class="svelte-izzyoe"` to each element).

The real app is unaffected — its markup carries the scope classes; only extracted-CSS test harnesses hit this. Related QA technique: freeze animations with `animation-play-state: paused` before screenshotting.
