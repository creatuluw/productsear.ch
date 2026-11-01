---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-11-01T13:33:42.944Z.

## Recent Decisions

- [Use Plausible for privacy-friendly site analytics, wired in app.html](decisions/use-plausible-for-privacy-friendly-site-analytics-wired-in-a.md) — Context (2026-11-01)
- [Adopt product-search bookmark-ribbon mascot as the brand character](decisions/adopt-product-search-bookmark-ribbon-mascot-as-the-brand-cha.md) — Context (2026-11-01)
- [Content-negotiate llms views: raw text/markdown for LLM clients, rendered markdown for browsers](decisions/content-negotiate-llms-views-raw-text-markdown-for-llm-clien.md) — Context (2026-11-01)
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

- [Reverse-engineer hosted component bundles into plain CSS, never add the dependency](rules/reverse-engineer-hosted-component-bundles-into-plain-css-nev.md) — **Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the Re… (2026-11-01)
- [Every ?view=llm branch must render an LLM document — including no-parameter fallbacks](rules/every-view-llm-branch-must-render-an-llm-document-including-.md) — **Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must re… (2026-11-01)
- [Rewrite delimiter-dense code blocks wholesale via the write path](rules/rewrite-delimiter-dense-code-blocks-wholesale-via-the-write-.md) — Guideline (2026-11-01)
- [Guard min-content width on wrapping-sensitive text](rules/guard-min-content-width-on-wrapping-sensitive-text.md) — **Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_… (2026-11-01)
- [Diagnose search misses stage-by-stage before tuning](rules/diagnose-search-misses-stage-by-stage-before-tuning.md) — Guideline (2026-11-01)
- [Instrument-grade design principles; avoid banned tells](rules/instrument-grade-design-principles-avoid-banned-tells.md) — Guideline (2026-08-06)
- [Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in](rules/skip-html-sanitizer-for-server-owned-llm-output-add-one-if-u.md) — When rendering model output as HTML on the client (e.g. ask-mode answers parsed (2026-07-04)
- [Pool-then-rerank with graceful fallback for retrieval](rules/pool-then-rerank-with-graceful-fallback-for-retrieval.md) — Guideline (2026-07-04)
- [Sanitize text at the embedding API boundary](rules/sanitize-text-at-the-embedding-api-boundary.md) — Guideline (2026-07-04)

## Recent Learnings — development patterns

- [Extracted Svelte scoped CSS needs scope classes handled or standalone test harnesses match nothing](learnings/extracted-svelte-scoped-css-needs-scope-classes-handled-or-s.md) — When extracting compiled Svelte CSS into a standalone test harness (e.g. a plain HTML file to screenshot), naive selector stripping breaks e… (2026-11-01)
- [Headless-Chrome screenshots don't advance CSS animations — freeze frames with animation-play-state](learnings/headless-chrome-screenshots-don-t-advance-css-animations-fre.md) — When visually verifying CSS animations via headless-Chrome screenshots, letting the page "run" for a while (or relying on virtual time) does… (2026-11-01)
- [21st.dev CDN preview pages inline the animation CSS inside the JS bundle, not the HTML](learnings/21st-dev-cdn-preview-pages-inline-the-animation-css-inside-t.md) — When the user shares a component URL like `https://cdn.21st.dev/loading-ui/symmetric-wave/default/bundle.<id>.html`, the HTML page is just a… (2026-11-01)
- [SvelteKit normalizes event.url for data requests — always early-return on event.isDataRequest in handle hooks](learnings/sveltekit-normalizes-event-url-for-data-requests-always-earl.md) — **The gotcha (found 2026-11-01 while debugging a prod 500 on `/?view=llm`):** in a SvelteKit `handle` hook, `event.url` for a client-router … (2026-11-01)
- [Site accent is #0021FF = oklch(0.468 0.303 264.2), 7.89:1 AA-safe](learnings/site-accent-is-0021ff-oklch-0-468-0-303-264-2-7-89-1-aa-safe.md) — The site-wide accent (set 2026-11-01) is `#0021FF`, expressed in the OKLCH token system as: (2026-11-01)
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

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-07-04)

## Global Patterns

- [LLM content negotiation](pages/concepts/llm-content-negotiation.md) — What is it? (2026-11-01)
- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it? (2026-08-25)
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it? (2026-07-03)

<!-- wiki-memory:end -->
