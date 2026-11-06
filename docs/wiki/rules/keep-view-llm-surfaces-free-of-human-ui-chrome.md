---
type: Rule
title: Keep ?view=llm surfaces free of human UI chrome
description: "**Guideline:** Any site-wide chrome added to `src/routes/+layout.svelte` — footers, mascots, banners, badges — must be **hidden on `?view=llm` surfaces**, so LL"
tags: [llms-view, dual-view, layout, chrome]
timestamp: "2026-11-01T15:36:40.481Z"
---

# Keep ?view=llm surfaces free of human UI chrome

**Guideline:** Any site-wide chrome added to `src/routes/+layout.svelte` — footers, mascots, banners, badges — must be **hidden on `?view=llm` surfaces**, so LLM clients receive pure markdown with no human-facing UI markup.

**When it applies:** every time you add visually-branded or interactive chrome to the shared layout. The dual-view contract (see [Dual-view surfaces: humans | llms tabs with ?view=llm on every route](../decisions/dual-view-surfaces-humans-llms-tabs-with-view-llm.md)) treats `?view=llm` as a *document* surface for LLM clients; chrome is noise there.

**Example:** the site-wide footer added 2026-11-01 (hairline top border, tagline, [[product-search-mascot-illo-character-pack]] cutout) renders only for humans; the llm branch of the layout omits the `<footer>` entirely.

**Related but distinct:** [Every ?view=llm branch must render an LLM document — including no-parameter fallbacks](./every-view-llm-branch-must-render-an-llm-document.md) covers *content* completeness per route; this rule covers *layout chrome* leakage into LLM documents.

Tags: llms-view, dual-view, layout, chrome
