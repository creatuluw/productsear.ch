# PRODUCT.md — productsear.ch

## What it is
A semantic bookmark-search instrument: 3.7k+ curated tool/library/SaaS bookmarks, hybrid-searchable (pgvector + FTS + RRF, cross-encoder rerank), each enriched with analysis metadata (purpose, how-to-use, when-to-use, category, tags). SvelteKit 2 + Svelte 5 + Tailwind v4 on Railway; read-only corpus mirrored from Raindrop by an external sync.

## Audience
1. The owner-researcher — daily, desktop, known-goal lookups, arrives with a query. No onboarding chrome; density beats decoration.
2. Incidental search-engine visitors exploring a specific tool. Every entry must stand alone.

## Primary action
Search the corpus and get strong matches with honest counts. Secondary: scan the archive (all entries, newest first); browse the compendium by archetype.

## Brand adjectives
Instrument-grade · precise · calm · terminal-native · honest.

Never: marketing-y, decorative, gradient-sloppy, padded, dashboard-busy.

## Non-negotiables
- OKLCH instrument tokens (ink/paper/signal/amber/danger) from src/app.css; color beyond ink/paper must carry meaning
- WCAG AA (amber never carries small text)
- Reduced-motion respected; motion = rows entering as one group, nothing decorative
- Live data only — counts, sync state, results are always queried, never hardcoded
- Source tables are read-only mirrors; app owns bookmark_embeddings + the archetype table
- Every surface has a humans | llms twin (?view=llm, paste-ready markdown) and /skill.md serves the LLM usage skill
- Honest retrieval: rerank-score cutoff, 20/page pagination, true counts

## Mode (this surface)
Operate — a daily working instrument. Scan speed, state transparency, native expectations.
