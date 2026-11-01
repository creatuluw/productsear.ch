---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-11-01T01:27:44.102Z.

## Recent Decisions

- [Serve the LLM usage guide at /skill.md and distill it into the llms-view preamble](decisions/serve-the-llm-usage-guide-at-skill-md-and-distill-it-into-th.md) — Context (2026-11-01)
- [Remove Ask mode — productsear.ch becomes search-only](decisions/remove-ask-mode-productsear-ch-becomes-search-only.md) — Context (2026-11-01)
- [Dual-view surfaces: humans | llms tabs with ?view=llm on every route](decisions/dual-view-surfaces-humans-llms-tabs-with-view-llm-on-every-r.md) — Context (2026-11-01)
- [Store bookmark archetypes as multi-entry JSONB on an app-owned table](decisions/store-bookmark-archetypes-as-multi-entry-jsonb-on-an-app-own.md) — Context (2026-11-01)
- [Enrich reranker input with page content; show 30 results](decisions/enrich-reranker-input-with-page-content-show-30-results.md) — Context (2026-11-01)
- [Shift visual design to instrument-grade precision-tool system (OKLCH)](decisions/shift-visual-design-to-instrument-grade-precision-tool-syste.md) — Context (2026-08-06)
- [Adopt cross-encoder reranking (Voyage rerank-2.5-lite) on top of RRF hybrid search](decisions/adopt-cross-encoder-reranking-voyage-rerank-2-5-lite-on-top-.md) — Context (2026-07-04)
- [Embedding provider: Voyage voyage-4-large (1024-dim)](decisions/embedding-provider-voyage-voyage-4-large-1024-dim.md) — Context (2026-07-04)
- [Adopt agentos-sdk.dev visual design system](decisions/adopt-agentos-sdk-dev-visual-design-system.md) — Context (2026-07-03)
- [Hybrid semantic search stack: pgvector + tsvector with RRF fusion](decisions/hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi.md) — Context (2026-07-03)

## Active Rules

- [Guard min-content width on wrapping-sensitive text](rules/guard-min-content-width-on-wrapping-sensitive-text.md) — **Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_… (2026-11-01)
- [Diagnose search misses stage-by-stage before tuning](rules/diagnose-search-misses-stage-by-stage-before-tuning.md) — Guideline (2026-11-01)
- [Instrument-grade design principles; avoid banned tells](rules/instrument-grade-design-principles-avoid-banned-tells.md) — Guideline (2026-08-06)
- [Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in](rules/skip-html-sanitizer-for-server-owned-llm-output-add-one-if-u.md) — When rendering model output as HTML on the client (e.g. ask-mode answers parsed (2026-07-04)
- [Pool-then-rerank with graceful fallback for retrieval](rules/pool-then-rerank-with-graceful-fallback-for-retrieval.md) — Guideline (2026-07-04)
- [Sanitize text at the embedding API boundary](rules/sanitize-text-at-the-embedding-api-boundary.md) — Guideline (2026-07-04)

## Recent Learnings — development patterns

- [SvelteKit blocks $lib/server imports in client components — even for pure-data modules](learnings/sveltekit-blocks-lib-server-imports-in-client-components-eve.md) — SvelteKit refuses `$lib/server/*` imports from client-side code (`+page.svelte`) at dev/build time — **even when the module contains no serv… (2026-11-01)
- [Headless Chrome clamps window width (~500px) — "390px" screenshots are crops, not reflows](learnings/headless-chrome-clamps-window-width-500px-390px-screenshots-.md) — When doing responsive visual QA via headless-Chrome screenshots: (2026-11-01)
- [postgres-js double-encodes plain strings sent to jsonb — use sql.json()](learnings/postgres-js-double-encodes-plain-strings-sent-to-jsonb-use-s.md) — When writing to a `jsonb` column through Drizzle's postgres-js driver using a raw `sql` template, passing a plain JS string makes postgres-j… (2026-11-01)
- [Svelte 5: values captured in plain consts go stale across param navigation — use $derived](learnings/svelte-5-values-captured-in-plain-consts-go-stale-across-par.md) — A Svelte 5 component instance **persists across navigation** to the same route with different params (e.g. `/archive/page/2` → `/archive/pag… (2026-11-01)
- [Relevance floor 0.45 sits exactly in the measured gap between noise and matches](learnings/relevance-floor-0-45-sits-exactly-in-the-measured-gap-betwee.md) — `RELEVANCE_FLOOR = 0.45` in `src/lib/server/search.ts` is not a guess — it was calibrated (2026-11-01) against real rerank-2.5-lite score di… (2026-11-01)
- [LLM usage skill lives outside the repo (E:\skills.te9.dev\productsear.ch\SKILL.md) and must stay in sync](learnings/llm-usage-skill-lives-outside-the-repo-e-skills-te9-dev-prod.md) — The fact (2026-11-01)
- [Corpus schema facts: raindrop_created_at, analysis who/what/how/when fields, 1,320 messy categories](learnings/corpus-schema-facts-raindrop-created-at-analysis-who-what-ho.md) — Discovered 2026-11-01 during the compendium-page design (facts homework before P2 interview). (2026-11-01)
- [Voyage rerank-2.5-lite has run-to-run rank variance (±2 positions)](learnings/voyage-rerank-2-5-lite-has-run-to-run-rank-variance-2-positi.md) — The gotcha (2026-11-01)
- [Explicit outer SELECT silently drops columns carried by CTE `scored.*`](learnings/explicit-outer-select-silently-drops-columns-carried-by-cte-.md) — The gotcha (2026-11-01)
- [synced_at runs ~4 days ahead of wall clock; sync rewrites all rows every pass](learnings/synced-at-runs-4-days-ahead-of-wall-clock-sync-rewrites-all-.md) — Discovered 2026-10-31 while answering "has the repo/db been updating lately?": (2026-11-01)
- [GitHub disables scheduled workflows after 60 days without commits — cron runs don't count](learnings/github-disables-scheduled-workflows-after-60-days-without-co.md) — GitHub automatically disables scheduled workflows after **60 days with no commits** to the repository. Scheduled (cron) runs do **not** coun… (2026-10-27)
- [Gold accent fails WCAG AA contrast when used for chip/tag text](learnings/gold-accent-fails-wcag-aa-contrast-when-used-for-chip-tag-te.md) — Gotcha (2026-08-06)
- [Raindrop→DB sync runs outside this repo; published page count sums all collections](learnings/raindrop-db-sync-runs-outside-this-repo-published-page-count.md) — **Architecture:** The `te9_dev.bookmarks` table (and `bookmark_content`, `bookmark_analysis`) is a **read-only mirror populated by an EXTERN… (2026-08-06)
- [bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo](learnings/bookmarks-table-is-a-read-only-mirror-the-raindrop-db-sync-l.md) — The gotcha (2026-08-06)
- [Driving html-video (nexu-io) headlessly to render a product video](learnings/driving-html-video-nexu-io-headlessly-to-render-a-product-vi.md) — When using **html-video** (https://github.com/nexu-io/html-video) to render a video about this app: (2026-07-07)
- [Skill SKILL.md description must quote colons to avoid YAML nested-mapping errors](learnings/skill-skill-md-description-must-quote-colons-to-avoid-yaml-n.md) — In `.agents/skills/*/SKILL.md`, a plain-scalar `description:` value containing `: ` (colon-space — e.g. from embedded text like `Triggers:` … (2026-07-04)
- [Railpack (Railway build driver) requires a start command](learnings/railpack-railway-build-driver-requires-a-start-command.md) — Railpack is Railway's default build driver (v0.30.0 at time of writing). It infers the start command for a Node app by checking, in order: (2026-07-04)
- [adapter-node requires ORIGIN env var for CSRF protection](learnings/adapter-node-requires-origin-env-var-for-csrf-protection.md) — When deploying SvelteKit with `@sveltejs/adapter-node`, requests with a mismatched `Host`/`Origin` header are rejected unless the `ORIGIN` e… (2026-07-04)
- [GitHub requires `workflow` scope on the token to push commits touching `.github/workflows/`](learnings/github-requires-workflow-scope-on-the-token-to-push-commits-.md) — A token with only `repo` (and `gist`, `read:org`) scopes cannot push a commit that modifies any file under `.github/workflows/`. GitHub reje… (2026-07-04)
- [Postgres FTS "word too long" NOTICE for >2047-char tokens is harmless](learnings/postgres-fts-word-too-long-notice-for-2047-char-tokens-is-ha.md) — When populating a `tsvector` / `search_tsv` column, Postgres may emit a NOTICE like: (2026-07-04)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-07-04)

## Global Patterns

- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it? (2026-08-25)
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it? (2026-07-03)

<!-- wiki-memory:end -->
