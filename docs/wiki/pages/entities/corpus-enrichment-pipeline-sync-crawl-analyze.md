---
type: Entity
title: Corpus enrichment pipeline (sync/crawl/analyze)
description: What is it?
tags: [pipeline, entity, ingestion, scripts]
timestamp: "2026-11-06T12:40:33.855Z"
---

# Corpus enrichment pipeline (sync/crawl/analyze)

## What is it?

The live corpus enrichment chain in `productsear.ch/scripts/` — imported from `E:\te9.dev` on 2026-11-06 (see [product-search-corpus-pipeline-is-self-contained-in-products](../../decisions/product-search-corpus-pipeline-is-self-contained-in-products.md)) so the A–Z flow runs from this repo. Full pipeline order:

1. `npm run sync` — `scripts/sync-raindrop.js`: Raindrop collection 34657545 ("Digital Products") → `te9_dev.bookmarks`. Upsert-only (`ON CONFLICT (raindrop_id) DO UPDATE`), never deletes — safe for manual negative-id ingests. Needs `RAINDROP_ACCESS_TOKEN`.
2. `npm run crawl` — `scripts/crawl-bookmarks.js`: fetch + Readability + turndown → `bookmark_content` (markdown ≤ ~2000 tokens). Self-selects missing/pending/failed(>7d) rows, **LIMIT 100 per run**, newest-first. Deps: `jsdom`, `@mozilla/readability`, `turndown`.
3. `npm run analyze` — `scripts/analyze-bookmarks.js`: LLM (z.ai GLM-5 primary via `ZAI_API_KEY`, Railway Qwen fallback) → `bookmark_analysis` (relevance / purpose / how_to_use / when_to_use / tags / category). **LIMIT 100 per run**, 1s delay, idempotent upserts, safe to re-run mid-flight. **Since 2026-11-06 (metric-100% patch):** LEFT JOIN on content — rows whose crawl permanently failed (dead sites, 403s, login walls, PDFs) are analyzed from **title / excerpt / URL** instead of being skipped forever; the selector also picks up rows whose analysis row exists with all NULL fields and re-analyzes them (upsert rewrites). This copy intentionally diverges from E:\te9.dev's analyzer, which still skips un-crawlable rows — see [the analyzed-metric learning](../../learnings/analyzed-metric-100-analyzer-fallback-patch-what-the-metric-.md).
4. `npm run embed` — `scripts/embed-bookmarks.ts` (existing): Voyage embeddings + `search_tsv` → `bookmark_embeddings`. Search-usable from here.
5. `npx tsx scripts/backfill-archetypes.ts --missing` (existing): archetype slugs → `bookmark_archetypes` for the collections.

## Details

- **Location**: `scripts/sync-raindrop.js`, `scripts/crawl-bookmarks.js`, `scripts/analyze-bookmarks.js`, `scripts/embed-bookmarks.ts`, `scripts/backfill-archetypes.ts`
- All stages idempotent; crawl/analyze process ~100 rows per invocation by design (nightly cadence = catch-up rate)
- Env (productsear.ch `.env`): `DATABASE_URL` (shared), `RAINDROP_ACCESS_TOKEN`, `ZAI_API_KEY`, `ZAI_LLM_URL` (optional gateway override) — copied from te9.dev on import
- Nightly automation: `.github/workflows/embed-new-bookmarks.yml` runs crawl → analyze → archetypes → embed at 04:17 UTC. The title/excerpt fallback guarantees even un-crawlable sync arrivals reach analysis, so the homepage `analyzed` vital sign converges back to 100% nightly instead of stalling (~93% pre-patch)
- Not imported: `generate-digest.js` (te9.dev email digest) and `setup-db.js` (garden_entrance seed) — unrelated to product search

## Lifecycle

- First added: 2026-11-06 — imported verbatim from te9.dev, only env loading adapted (`dotenv/config`); first real job: crawled + analyzed the 522 ingested GitHub repos (crawl 522/522 success; analysis via background loop)
- 2026-11-06 — analyzer patched to reach 100% `analyzed` on the homepage: LEFT JOIN + title/excerpt/URL fallback for permanently-uncrawlable rows, and selector widened to all-NULL-field analysis rows. Full drain: 4,372/4,372 rows enriched across 8 analyzer batches (all z.ai GLM-5 primary, zero permanent failures)

## Relationships

- [repo-scan-pipeline](./repo-scan-pipeline.md) — the .archive one-off scanner that found the candidate repos these scripts now enrich
- [digital-products-repos-activity-split-csvs](../artifacts/digital-products-repos-activity-split-csvs.md) — the CSV that fed the 522-row insert
- [insert-missing-repos-active-30d-sql](../artifacts/insert-missing-repos-active-30d-sql.md) — the ingest this pipeline then enriched
- [bookmark-archetype-system](./bookmark-archetype-system.md) — the archetype stage that consumes analysis output
- [analyzed-metric learning](../../learnings/analyzed-metric-100-analyzer-fallback-patch-what-the-metric-.md) — documents the analyzer divergence and what the `analyzed` metric counts
