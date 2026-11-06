---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-11-06T12:33:34.254Z.

## Recent Decisions

- [Rename compendium to collections (routes moved, 308 redirects)](decisions/rename-compendium-to-collections-routes-moved-308-redirects.md) — Context (2026-11-06)
- [Product-search corpus pipeline is self-contained in productsear.ch](decisions/product-search-corpus-pipeline-is-self-contained-in-products.md) — Context (2026-11-06)
- [Repo-scan pipeline: cheapest-first phases; npm/PyPI registry lookups replace GitHub slug-guessing](decisions/repo-scan-pipeline-cheapest-first-phases-npm-pypi.md) — Context (2026-11-03)
- [Machine-readout console identity for ?view=llm surfaces](decisions/machine-readout-console-identity-for-view-llm.md) — Context (2026-11-03)
- [User-facing vocabulary is "listings" — display-terms-only rename, URLs stay /archive](decisions/user-facing-vocabulary-is-listings-display-terms.md) — Context (2026-11-03)
- [Use Plausible for privacy-friendly site analytics, wired in app.html](decisions/use-plausible-for-privacy-friendly-site-analytics.md) — Context (2026-11-01)
- [Adopt product-search bookmark-ribbon mascot as the brand character](decisions/adopt-product-search-bookmark-ribbon-mascot-as-the.md) — Context (2026-11-01)
- [Content-negotiate llms views: raw text/markdown for LLM clients, rendered markdown for browsers](decisions/content-negotiate-llms-views-raw-text-markdown-for.md) — Context (2026-11-01)
- [Serve the LLM usage guide at /skill.md and distill it into the llms-view preamble](decisions/serve-the-llm-usage-guide-at-skill-md-and-distill.md) — Context (2026-11-01)
- [Remove Ask mode — productsear.ch becomes search-only](decisions/remove-ask-mode-productsear-ch-becomes-search-only.md) — Context (2026-11-01)
- [Dual-view surfaces: humans | llms tabs with ?view=llm on every route](decisions/dual-view-surfaces-humans-llms-tabs-with-view-llm.md) — Context (2026-11-01)
- [Store bookmark archetypes as multi-entry JSONB on an app-owned table](decisions/store-bookmark-archetypes-as-multi-entry-jsonb-on.md) — Context (2026-11-01)
- [Enrich reranker input with page content; show 30 results](decisions/enrich-reranker-input-with-page-content-show-30.md) — Context (2026-11-01)
- [Shift visual design to instrument-grade precision-tool system (OKLCH)](decisions/shift-visual-design-to-instrument-grade-precision.md) — Context (2026-08-06)
- [Adopt cross-encoder reranking (Voyage rerank-2.5-lite) on top of RRF hybrid search](decisions/adopt-cross-encoder-reranking-voyage-rerank-2-5.md) — Context (2026-07-04)

## Active Rules

- [Prepare and dry-run the rollback script before generating derived rows](rules/prepare-and-dry-run-the-rollback-script-before-generating-de.md) — **Guideline:** When a bulk data mutation against `te9_dev` is committed for real (no rollback wrapper), write and dry-run-verify the undo sc… (2026-11-06)
- [Validate generated SQL inserts with a rollback-wrapped dry run against the live DB](rules/validate-generated-sql-inserts-with-a-rollback-wrapped-dry-r.md) — **Guideline:** Before declaring a generated/hand-written INSERT or migration SQL file ready to run, execute it against the real database ins… (2026-11-06)
- [Corroborate product→repo matches with multi-signal checks; stars never validate homepage/npm links](rules/corroborate-product-repo-matches-with-multi-signal.md) — Guideline (2026-11-03)
- [Sweep every render path when renaming display vocabulary](rules/sweep-every-render-path-when-renaming-display.md) — **Guideline:** When renaming display vocabulary on a SvelteKit surface, sweep **every render path**, not just visible body copy: `<svelte:he… (2026-11-03)
- [Keep ?view=llm surfaces free of human UI chrome](rules/keep-view-llm-surfaces-free-of-human-ui-chrome.md) — **Guideline:** Any site-wide chrome added to `src/routes/+layout.svelte` — footers, mascots, banners, badges — must be **hidden on `?view=ll… (2026-11-01)
- [Reverse-engineer hosted component bundles into plain CSS, never add the dependency](rules/reverse-engineer-hosted-component-bundles-into.md) — **Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the Re… (2026-11-01)
- [Every ?view=llm branch must render an LLM document — including no-parameter fallbacks](rules/every-view-llm-branch-must-render-an-llm-document.md) — **Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must re… (2026-11-01)
- [Rewrite delimiter-dense code blocks wholesale via the write path](rules/rewrite-delimiter-dense-code-blocks-wholesale-via.md) — Guideline (2026-11-01)
- [Guard min-content width on wrapping-sensitive text](rules/guard-min-content-width-on-wrapping-sensitive-text.md) — **Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_… (2026-11-01)
- [Diagnose search misses stage-by-stage before tuning](rules/diagnose-search-misses-stage-by-stage-before.md) — Guideline (2026-11-01)
- [Instrument-grade design principles; avoid banned tells](rules/instrument-grade-design-principles-avoid-banned.md) — Guideline (2026-08-06)
- [Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in](rules/skip-html-sanitizer-for-server-owned-llm-output.md) — When rendering model output as HTML on the client (e.g. ask-mode answers parsed (2026-07-04)
- [Pool-then-rerank with graceful fallback for retrieval](rules/pool-then-rerank-with-graceful-fallback-for.md) — Guideline (2026-07-04)
- [Sanitize text at the embedding API boundary](rules/sanitize-text-at-the-embedding-api-boundary.md) — Guideline (2026-07-04)

## Recent Learnings — development patterns

- [External crawler/analyzer lives at E:\te9.dev — analyzer requires crawled content, processes 100 rows/run newest-first](learnings/external-crawler-analyzer-lives-at-e-te9-dev-analyzer-requir.md) — Discovered 2026-11-06 while answering "where is the sync/analysis pipeline?" (user's best guess: `E:\te9.dev` — confirmed correct). (2026-11-06)
- [Homepage "analyzed" vital sign = analyzed/total ratio — bulk inserts regress it until the external analysis pass runs](learnings/homepage-analyzed-vital-sign-analyzed-total-ratio-bulk-inser.md) — Discovered 2026-11-06 while diagnosing why https://productsear.ch/ showed `analyzed` = 81% (user reported the drop). (2026-11-06)
- [Bookmark ingestion chain is gap-catching; archetypes classifier lives at src/lib/archetypes.ts](learnings/bookmark-ingestion-chain-is-gap-catching-archetypes-classifi.md) — Discovered 2026-11-06 while processing the 522 synthetic repo rows end-to-end. (2026-11-06)
- [Negative synthetic ids for manual bookmarks-table inserts (never collide with the external sync)](learnings/negative-synthetic-ids-for-manual-bookmarks-table-inserts-ne.md) — **The convention (set 2026-11-06):** when manually inserting rows into `te9_dev.bookmarks` (normally an external-sync mirror), use **negativ… (2026-11-06)
- [check-active.js: "active" is user-defined as pushed within 30 days; --resplit re-splits cached data without API calls](learnings/check-active-js-active-is-user-defined-as-pushed-within-30-d.md) — **The fact (set 2026-11-06, user-defined):** for the digital-products-repos activity split, the user explicitly redefined **ACTIVE = last pu… (2026-11-06)
- [Await dotenv imports; anchor .env path](learnings/await-dotenv-imports-anchor-env-path.md) — Two failures when `missing-repos.js` (a plain Node script in `.archive/repo-scan/`) loaded `DATABASE_URL`, discovered 2026-11-06: (2026-11-06)
- [pi loads every standalone .md in .agents/skills/ as a skill named after its parent dir; slash commands live in .pi/prompts/](learnings/pi-skill-name-fallback-and-prompts-dir.md) — Two related facts about how pi loads project-level agent config, discovered 2026-11-06 while fixing a `commands` collision warning: (2026-11-06)
- [MCP server names in .pi/mcp.json forbid dots — name them with letters/digits/_/- only](learnings/mcp-server-names-no-dots.md) — The dot gotcha (found 2026-11-05): pi rejects MCP server names containing characters outside `[A-Za-z0-9_-]`. The project's `.pi/mcp.json` n… (2026-11-06)
- [pi reads project MCP config from .pi/mcp.json — root .mcp.json is ignored](learnings/pi-project-mcp-config-location.md) — The gotcha (found 2026-11-06 while debugging why `/mcp` showed no servers): (2026-11-06)
- [BrowserClaw owns IPv4 :9222; harness Chrome lands on IPv6 — discover CDP WS URL via curl, not undici fetch](learnings/browserclaw-owns-ipv4-9222-harness-chrome-lands-on.md) — Discovered 2026-11-03 while doing CDP-based visual QA of `.archive/digital-products-repos.html`: (2026-11-03)
- [Transparent-cutout QA: previews don't honor alpha — verify the alpha channel programmatically](learnings/transparent-cutout-qa-previews-don-t-honor-alpha.md) — When producing a transparent cutout of the [[product-search-mascot-illo-character-pack]] (or any character) for web use, the cutout engine w… (2026-11-01)
- [Extracted Svelte scoped CSS needs scope classes handled or standalone test harnesses match nothing](learnings/extracted-svelte-scoped-css-needs-scope-classes.md) — When extracting compiled Svelte CSS into a standalone test harness (e.g. a plain HTML file to screenshot), naive selector stripping breaks e… (2026-11-01)
- [Headless-Chrome screenshots don't advance CSS animations — freeze frames with animation-play-state](learnings/headless-chrome-screenshots-don-t-advance-css.md) — When visually verifying CSS animations via headless-Chrome screenshots, letting the page "run" for a while (or relying on virtual time) does… (2026-11-01)
- [21st.dev CDN preview pages inline the animation CSS inside the JS bundle, not the HTML](learnings/21st-dev-cdn-preview-pages-inline-the-animation.md) — When the user shares a component URL like `https://cdn.21st.dev/loading-ui/symmetric-wave/default/bundle.<id>.html`, the HTML page is just a… (2026-11-01)
- [SvelteKit normalizes event.url for data requests — always early-return on event.isDataRequest in handle hooks](learnings/sveltekit-normalizes-event-url-for-data-requests.md) — **The gotcha (found 2026-11-01 while debugging a prod 500 on `/?view=llm`):** in a SvelteKit `handle` hook, `event.url` for a client-router … (2026-11-01)
- [Site accent is #0021FF = oklch(0.468 0.303 264.2), 7.89:1 AA-safe](learnings/site-accent-is-0021ff-oklch-0-468-0-303-264-2-7-89.md) — The site-wide accent (set 2026-11-01) is `#0021FF`, expressed in the OKLCH token system as: (2026-11-01)
- [SvelteKit blocks $lib/server imports in client components — even for pure-data modules](learnings/sveltekit-blocks-lib-server-imports-in-client.md) — SvelteKit refuses `$lib/server/*` imports from client-side code (`+page.svelte`) at dev/build time — **even when the module contains no serv… (2026-11-01)
- [Headless Chrome clamps window width (~500px) — "390px" screenshots are crops, not reflows](learnings/headless-chrome-clamps-window-width-500px-390px.md) — When doing responsive visual QA via headless-Chrome screenshots: (2026-11-01)
- [postgres-js double-encodes plain strings sent to jsonb — use sql.json()](learnings/postgres-js-double-encodes-plain-strings-sent-to.md) — When writing to a `jsonb` column through Drizzle's postgres-js driver using a raw `sql` template, passing a plain JS string makes postgres-j… (2026-11-01)
- [Svelte 5: values captured in plain consts go stale across param navigation — use $derived](learnings/svelte-5-values-captured-in-plain-consts-go-stale.md) — A Svelte 5 component instance **persists across navigation** to the same route with different params (e.g. `/archive/page/2` → `/archive/pag… (2026-11-01)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-07-04)

## Global Patterns

- [LLM content negotiation](pages/concepts/llm-content-negotiation.md) — What is it? (2026-11-01)
- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it? (2026-08-25)
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it? (2026-07-03)

<!-- wiki-memory:end -->
