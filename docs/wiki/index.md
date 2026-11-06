---
okf_version: "0.1"
---

# Project Knowledge Wiki

<!-- wiki-nav:start -->
## Navigation map

Auto-generated detailed index of every docs/wiki/ concept — the map the LLM uses to locate information. 105 concept(s). Regenerated on init and on wiki_mark_synced. Generated 2026-11-06T12:33:34.159Z.

Each entry: [title](concept-id.md) — description. Links are clickable in /wiki; pass the concept-id (link target minus .md) to wiki_get.

### Core concepts

- [Glossary](glossary.md) — Key terms for this project.
- [Overview](overview.md) — What this project contains and its structure.

### Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions.

### Pages

- [agentos-sdk.dev design system extraction](pages/artifacts/agentos-sdk-dev-design-system-extraction.md) — Reference design system reverse-engineered from https://agentos-sdk.dev/, to be replicated on productsear.ch. Captures exact color tokens, typography, signature
- [digital-products-repo index](pages/artifacts/digital-products-repo-index.md) — digital-products-repo index
- [digital-products-repos activity split CSVs](pages/artifacts/digital-products-repos-activity-split-csvs.md) — The activity-checked split of the 2,896 missing-repo candidates into 1,145 active and 1,751 inactive CSVs, with fresh GitHub metadata and days-since-last-push.
- [digital-products-repos-missing CSV](pages/artifacts/digital-products-repos-missing-csv.md) — CSV of 2,896 GitHub repos found by the repo-scan pipeline that are not yet bookmarked in te9_dev.bookmarks — ingestion candidates sorted by stars, with source Raindrop creation dates.
- [host0.ai and clawrun.sh design references](pages/artifacts/host0-ai-and-clawrun-sh-design-references.md) — Two live sites the user endorsed ("i like") as aesthetic north stars for the upcoming site redesign: https://host0.ai/ and https://clawrun.sh/. Both were fetche
- [Impeccable design brief (P4)](pages/artifacts/impeccable-design-brief-p4.md) — The **design brief** is the P4 gate deliverable of the impeccable design-studio redesign: the self-sufficient handover spec from which the approved design gets 
- [Impeccable pattern one-pager (P3)](pages/artifacts/impeccable-pattern-one-pager-p3.md) — The **pattern one-pager** is the P3 gate deliverable of the impeccable design-studio redesign: a single self-contained HTML page showing the "80% base" layout f
- [insert-missing-repos-active-30d.sql](pages/artifacts/insert-missing-repos-active-30d-sql.md) — What is it?
- [productsear.ch promo video](pages/artifacts/productsear-ch-promo-video.md) — An animated ~6-scene promo MP4 that introduces productsear.ch: semantic bookmark search via hybrid retrieval ([[hybrid-search-via-reciprocal-rank-fusion]]) plus
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it?
- [LLM content negotiation](pages/concepts/llm-content-negotiation.md) — What is it?
- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it?
- [API ask endpoint](pages/entities/api-ask-endpoint.md) — What is it?
- [API search endpoint](pages/entities/api-search-endpoint.md) — What is it?
- [Archive page](pages/entities/archive-page.md) — `/archive` — the chronological all-entries surface of productsear.ch, displayed as **"listings"** (URLs stay /archive). Newest-first by raindrop_created_at, paginated 20/page.
- [Bookmark archetype system](pages/entities/bookmark-archetype-system.md) — The bookmark archetype system classifies every bookmark in the corpus into a curated set of **30 canonical archetypes** (AI Coding Agent, RAG & Search, Open Sou
- [Collections pages](pages/entities/compendium-pages.md) — `/collections` (index) and `/collections/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; ea
- [Corpus enrichment pipeline (sync/crawl/analyze)](pages/entities/corpus-enrichment-pipeline-sync-crawl-analyze.md) — What is it?
- [Daily embed-new-bookmarks workflow](pages/entities/daily-embed-new-bookmarks-workflow.md) — `.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that keeps the corpus enriched nightly. **Since 2026-11-06 it runs the full en
- [Embed-bookmarks backfill script](pages/entities/embed-bookmarks-backfill-script.md) — What is it?
- [InfoTip component](pages/entities/infotip-component.md) — `src/lib/components/InfoTip.svelte` — a lightweight hover/focus tooltip for homepage methodology terms and vital-signs metric labels
- [LlmDoc component](pages/entities/llmdoc-component.md) — `src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as a **machine-readout
- [product-search mascot (illo character pack)](pages/entities/product-search-mascot-illo-character-pack.md) — The official brand mascot for productsear.ch: **product-search**, a bookmark-ribbon character in the illo plugin's **riso** look — the ribbon that has already f
- [repo-scan pipeline](pages/entities/repo-scan-pipeline.md) — One-off checkpointed Node pipeline (`.archive/repo-scan/`) that matched all 4,224 bookmarks against open-source GitHub repos — provenance for the digital-products repo index
- [Rerank service](pages/entities/rerank-service.md) — `src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.
- [Search diagnostics](pages/entities/search-diagnostics.md) — Search-quality diagnostic tooling shipped with the 2026-11-01 rerank fix: a trace script for the retrieval stages, a debug env flag for the rerank stage, and a 
- [WaveLoader component](pages/entities/waveloader-component.md) — A CSS-only animated loading indicator shown in the latency gauge box while a search runs; it swaps to the `{tookMs}ms` latency readout when the search completes
- [Page Templates](pages/TEMPLATES.md) — Reference templates for Concept, Entity, and Artifact pages. Follow these when using wiki_note_page.

### Decisions

- [Adopt agentos-sdk.dev visual design system](decisions/adopt-agentos-sdk-dev-visual-design-system.md) — Context
- [Adopt cross-encoder reranking (Voyage rerank-2.5-lite) on top of RRF hybrid search](decisions/adopt-cross-encoder-reranking-voyage-rerank-2-5.md) — Context
- [Adopt product-search bookmark-ribbon mascot as the brand character](decisions/adopt-product-search-bookmark-ribbon-mascot-as-the.md) — Context
- [Content-negotiate llms views: raw text/markdown for LLM clients, rendered markdown for browsers](decisions/content-negotiate-llms-views-raw-text-markdown-for.md) — Context
- [Dual-view surfaces: humans | llms tabs with ?view=llm on every route](decisions/dual-view-surfaces-humans-llms-tabs-with-view-llm.md) — Context
- [Embedding provider: Voyage voyage-4-large (1024-dim)](decisions/embedding-provider-voyage-voyage-4-large-1024-dim.md) — Context
- [Enrich reranker input with page content; show 30 results](decisions/enrich-reranker-input-with-page-content-show-30.md) — Context
- [Hybrid semantic search stack: pgvector + tsvector with RRF fusion](decisions/hybrid-semantic-search-stack-pgvector-tsvector.md) — Context
- [Machine-readout console identity for ?view=llm surfaces](decisions/machine-readout-console-identity-for-view-llm.md) — Context
- [Product-search corpus pipeline is self-contained in productsear.ch](decisions/product-search-corpus-pipeline-is-self-contained-in-products.md) — Context
- [Remove Ask mode — productsear.ch becomes search-only](decisions/remove-ask-mode-productsear-ch-becomes-search-only.md) — Context
- [Rename compendium to collections (routes moved, 308 redirects)](decisions/rename-compendium-to-collections-routes-moved-308-redirects.md) — Context
- [Repo-scan pipeline: cheapest-first phases; npm/PyPI registry lookups replace GitHub slug-guessing](decisions/repo-scan-pipeline-cheapest-first-phases-npm-pypi.md) — Context
- [Serve the LLM usage guide at /skill.md and distill it into the llms-view preamble](decisions/serve-the-llm-usage-guide-at-skill-md-and-distill.md) — Context
- [Shift visual design to instrument-grade precision-tool system (OKLCH)](decisions/shift-visual-design-to-instrument-grade-precision.md) — Context
- [Store bookmark archetypes as multi-entry JSONB on an app-owned table](decisions/store-bookmark-archetypes-as-multi-entry-jsonb-on.md) — Context
- [Use Plausible for privacy-friendly site analytics, wired in app.html](decisions/use-plausible-for-privacy-friendly-site-analytics.md) — Context
- [User-facing vocabulary is "listings" — display-terms-only rename, URLs stay /archive](decisions/user-facing-vocabulary-is-listings-display-terms.md) — Context

### Rules

- [Corroborate product→repo matches with multi-signal checks; stars never validate homepage/npm links](rules/corroborate-product-repo-matches-with-multi-signal.md) — Guideline
- [Diagnose search misses stage-by-stage before tuning](rules/diagnose-search-misses-stage-by-stage-before.md) — Guideline
- [Every ?view=llm branch must render an LLM document — including no-parameter fallbacks](rules/every-view-llm-branch-must-render-an-llm-document.md) — **Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must return the LLM markdow
- [Guard min-content width on wrapping-sensitive text](rules/guard-min-content-width-on-wrapping-sensitive-text.md) — **Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_app:`) set large **m
- [Instrument-grade design principles; avoid banned tells](rules/instrument-grade-design-principles-avoid-banned.md) — Guideline
- [Keep ?view=llm surfaces free of human UI chrome](rules/keep-view-llm-surfaces-free-of-human-ui-chrome.md) — **Guideline:** Any site-wide chrome added to `src/routes/+layout.svelte` — footers, mascots, banners, badges — must be **hidden on `?view=llm` surfaces**, so LL
- [Pool-then-rerank with graceful fallback for retrieval](rules/pool-then-rerank-with-graceful-fallback-for.md) — Guideline
- [Prepare and dry-run the rollback script before generating derived rows](rules/prepare-and-dry-run-the-rollback-script-before-generating-de.md) — **Guideline:** When a bulk data mutation against `te9_dev` is committed for real (no rollback wrapper), write and dry-run-verify the undo script **before** gene
- [Reverse-engineer hosted component bundles into plain CSS, never add the dependency](rules/reverse-engineer-hosted-component-bundles-into.md) — **Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the React dependency or po
- [Rewrite delimiter-dense code blocks wholesale via the write path](rules/rewrite-delimiter-dense-code-blocks-wholesale-via.md) — Guideline
- [Sanitize text at the embedding API boundary](rules/sanitize-text-at-the-embedding-api-boundary.md) — Guideline
- [Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in](rules/skip-html-sanitizer-for-server-owned-llm-output.md) — When rendering model output as HTML on the client (e.g. ask-mode answers parsed
- [Sweep every render path when renaming display vocabulary](rules/sweep-every-render-path-when-renaming-display.md) — **Guideline:** When renaming display vocabulary on a SvelteKit surface, sweep **every render path**, not just visible body copy: `<svelte:head><title>`, sr-only
- [Validate generated SQL inserts with a rollback-wrapped dry run against the live DB](rules/validate-generated-sql-inserts-with-a-rollback-wrapped-dry-r.md) — **Guideline:** Before declaring a generated/hand-written INSERT or migration SQL file ready to run, execute it against the real database inside a single `BEGIN;

### Learnings

- [21st.dev CDN preview pages inline the animation CSS inside the JS bundle, not the HTML](learnings/21st-dev-cdn-preview-pages-inline-the-animation.md) — When the user shares a component URL like `https://cdn.21st.dev/loading-ui/symmetric-wave/default/bundle.<id>.html`, the HTML page is just a **React bundle shel
- [adapter-node requires ORIGIN env var for CSRF protection](learnings/adapter-node-requires-origin-env-var-for-csrf.md) — When deploying SvelteKit with `@sveltejs/adapter-node`, requests with a mismatched `Host`/`Origin` header are rejected unless the `ORIGIN` environment variable
- [agentos-sdk.dev is a light warm-paper theme, not dark](learnings/agentos-sdk-dev-is-a-light-warm-paper-theme-not.md) — When extracting the design system from https://agentos-sdk.dev/, the `:root` CSS contains leftover shadcn dark-mode HSL variables (e.g. `--background: 240 10% 3
- [Await dotenv imports; anchor .env path](learnings/await-dotenv-imports-anchor-env-path.md) — Two failures when `missing-repos.js` (a plain Node script in `.archive/repo-scan/`) loaded `DATABASE_URL`, discovered 2026-11-06:
- [Bookmark ingestion chain is gap-catching; archetypes classifier lives at src/lib/archetypes.ts](learnings/bookmark-ingestion-chain-is-gap-catching-archetypes-classifi.md) — Discovered 2026-11-06 while processing the 522 synthetic repo rows end-to-end.
- [bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo](learnings/bookmarks-table-is-a-read-only-mirror-the-raindrop.md) — The gotcha
- [BrowserClaw owns IPv4 :9222; harness Chrome lands on IPv6 — discover CDP WS URL via curl, not undici fetch](learnings/browserclaw-owns-ipv4-9222-harness-chrome-lands-on.md) — Discovered 2026-11-03 while doing CDP-based visual QA of `.archive/digital-products-repos.html`:
- [check-active.js: "active" is user-defined as pushed within 30 days; --resplit re-splits cached data without API calls](learnings/check-active-js-active-is-user-defined-as-pushed-within-30-d.md) — **The fact (set 2026-11-06, user-defined):** for the digital-products-repos activity split, the user explicitly redefined **ACTIVE = last push within the last 3
- [Corpus schema facts: raindrop_created_at, analysis who/what/how/when fields, 1,320 messy categories](learnings/corpus-schema-facts-raindrop-created-at-analysis.md) — Discovered 2026-11-01 during the compendium-page design (facts homework before P2 interview).
- [Driving html-video (nexu-io) headlessly to render a product video](learnings/driving-html-video-nexu-io-headlessly-to-render-a.md) — When using **html-video** (https://github.com/nexu-io/html-video) to render a video about this app:
- [$env/dynamic/private breaks under plain tsx — use process.env in shared server modules](learnings/env-dynamic-private-breaks-under-plain-tsx-use.md) — SvelteKit's `$env/dynamic/private` is a **virtual module resolved only by the SvelteKit Vite pipeline**. Importing it from a standalone script run via `tsx` (e.
- [Explicit outer SELECT silently drops columns carried by CTE `scored.*`](learnings/explicit-outer-select-silently-drops-columns.md) — The gotcha
- [External crawler/analyzer lives at E:\te9.dev — analyzer requires crawled content, processes 100 rows/run newest-first](learnings/external-crawler-analyzer-lives-at-e-te9-dev-analyzer-requir.md) — Discovered 2026-11-06 while answering "where is the sync/analysis pipeline?" (user's best guess: `E:\te9.dev` — confirmed correct).
- [Extracted Svelte scoped CSS needs scope classes handled or standalone test harnesses match nothing](learnings/extracted-svelte-scoped-css-needs-scope-classes.md) — When extracting compiled Svelte CSS into a standalone test harness (e.g. a plain HTML file to screenshot), naive selector stripping breaks everything silently: 
- [GitHub disables scheduled workflows after 60 days without commits — cron runs don't count](learnings/github-disables-scheduled-workflows-after-60-days.md) — GitHub automatically disables scheduled workflows after **60 days with no commits** to the repository. Scheduled (cron) runs do **not** count as activity — only
- [GitHub requires `workflow` scope on the token to push commits touching `.github/workflows/`](learnings/github-requires-workflow-scope-on-the-token-to.md) — A token with only `repo` (and `gist`, `read:org`) scopes cannot push a commit that modifies any file under `.github/workflows/`. GitHub rejects the push with a 
- [Gold accent fails WCAG AA contrast when used for chip/tag text](learnings/gold-accent-fails-wcag-aa-contrast-when-used-for.md) — Gotcha
- [Headless Chrome clamps window width (~500px) — "390px" screenshots are crops, not reflows](learnings/headless-chrome-clamps-window-width-500px-390px.md) — When doing responsive visual QA via headless-Chrome screenshots:
- [Headless-Chrome screenshots don't advance CSS animations — freeze frames with animation-play-state](learnings/headless-chrome-screenshots-don-t-advance-css.md) — When visually verifying CSS animations via headless-Chrome screenshots, letting the page "run" for a while (or relying on virtual time) does not reliably advanc
- [Homepage "analyzed" vital sign = analyzed/total ratio — bulk inserts regress it until the external analysis pass runs](learnings/homepage-analyzed-vital-sign-analyzed-total-ratio-bulk-inser.md) — Discovered 2026-11-06 while diagnosing why https://productsear.ch/ showed `analyzed` = 81% (user reported the drop).
- [LLM usage skill lives outside the repo (E:\skills.te9.dev\productsear.ch\SKILL.md) and must stay in sync](learnings/llm-usage-skill-lives-outside-the-repo-e-skills.md) — The fact
- [MCP server names in .pi/mcp.json forbid dots — name them with letters/digits/_/- only](learnings/mcp-server-names-no-dots.md) — The dot gotcha (found 2026-11-05): pi rejects MCP server names containing characters outside `[A-Za-z0-9_-]`. The project's `.pi/mcp.json` named its database se
- [Negative synthetic ids for manual bookmarks-table inserts (never collide with the external sync)](learnings/negative-synthetic-ids-for-manual-bookmarks-table-inserts-ne.md) — **The convention (set 2026-11-06):** when manually inserting rows into `te9_dev.bookmarks` (normally an external-sync mirror), use **negative synthetic ids**: `
- [pi reads project MCP config from .pi/mcp.json — root .mcp.json is ignored](learnings/pi-project-mcp-config-location.md) — The gotcha (found 2026-11-06 while debugging why `/mcp` showed no servers):
- [pi loads every standalone .md in .agents/skills/ as a skill named after its parent dir; slash commands live in .pi/prompts/](learnings/pi-skill-name-fallback-and-prompts-dir.md) — Two related facts about how pi loads project-level agent config, discovered 2026-11-06 while fixing a `commands` collision warning:
- [Postgres FTS "word too long" NOTICE for >2047-char tokens is harmless](learnings/postgres-fts-word-too-long-notice-for-2047-char.md) — When populating a `tsvector` / `search_tsv` column, Postgres may emit a NOTICE like:
- [postgres-js db.execute() returns rows directly, not { rows }](learnings/postgres-js-db-execute-returns-rows-directly-not.md) — When using Drizzle's postgres-js driver, `db.execute(sql\`...\`)` returns the **row array directly**, not an object with a `.rows` property (unlike the `pg`/nod
- [postgres-js double-encodes plain strings sent to jsonb — use sql.json()](learnings/postgres-js-double-encodes-plain-strings-sent-to.md) — When writing to a `jsonb` column through Drizzle's postgres-js driver using a raw `sql` template, passing a plain JS string makes postgres-js serialize it as a
- [Railpack (Railway build driver) requires a start command](learnings/railpack-railway-build-driver-requires-a-start.md) — Railpack is Railway's default build driver (v0.30.0 at time of writing). It infers the start command for a Node app by checking, in order:
- [Raindrop→DB sync runs outside this repo; published page count sums all collections](learnings/raindrop-db-sync-runs-outside-this-repo-published.md) — **Architecture:** The `te9_dev.bookmarks` table (and `bookmark_content`, `bookmark_analysis`) is a **read-only mirror populated by an EXTERNAL Raindrop-sync pro
- [Relevance floor 0.45 sits exactly in the measured gap between noise and matches](learnings/relevance-floor-0-45-sits-exactly-in-the-measured.md) — `RELEVANCE_FLOOR = 0.45` in `src/lib/server/search.ts` is not a guess — it was calibrated (2026-11-01) against real rerank-2.5-lite score distributions using `s
- [Site accent is #0021FF = oklch(0.468 0.303 264.2), 7.89:1 AA-safe](learnings/site-accent-is-0021ff-oklch-0-468-0-303-264-2-7-89.md) — The site-wide accent (set 2026-11-01) is `#0021FF`, expressed in the OKLCH token system as:
- [Skill SKILL.md description must quote colons to avoid YAML nested-mapping errors](learnings/skill-skill-md-description-must-quote-colons-to.md) — In `.agents/skills/*/SKILL.md`, a plain-scalar `description:` value containing `: ` (colon-space — e.g. from embedded text like `Triggers:` or `Use when:`) caus
- [Svelte 5: values captured in plain consts go stale across param navigation — use $derived](learnings/svelte-5-values-captured-in-plain-consts-go-stale.md) — A Svelte 5 component instance **persists across navigation** to the same route with different params (e.g. `/archive/page/2` → `/archive/page/3`). A plain `cons
- [SvelteKit blocks $lib/server imports in client components — even for pure-data modules](learnings/sveltekit-blocks-lib-server-imports-in-client.md) — SvelteKit refuses `$lib/server/*` imports from client-side code (`+page.svelte`) at dev/build time — **even when the module contains no server dependencies at a
- [SvelteKit dev server does not populate process.env from .env — load dotenv yourself](learnings/sveltekit-dev-server-does-not-populate-process-env.md) — SvelteKit's Vite dev server does **not** populate `process.env` from your `.env` file. That is what the `$env/*` virtual modules are for. If your server modules
- [SvelteKit normalizes event.url for data requests — always early-return on event.isDataRequest in handle hooks](learnings/sveltekit-normalizes-event-url-for-data-requests.md) — **The gotcha (found 2026-11-01 while debugging a prod 500 on `/?view=llm`):** in a SvelteKit `handle` hook, `event.url` for a client-router data fetch (`/__data
- [synced_at runs ~4 days ahead of wall clock; sync rewrites all rows every pass](learnings/synced-at-runs-4-days-ahead-of-wall-clock-sync.md) — Discovered 2026-10-31 while answering "has the repo/db been updating lately?":
- [Transparent-cutout QA: previews don't honor alpha — verify the alpha channel programmatically](learnings/transparent-cutout-qa-previews-don-t-honor-alpha.md) — When producing a transparent cutout of the [[product-search-mascot-illo-character-pack]] (or any character) for web use, the cutout engine warns of possible **m
- [Vercel AI SDK v4 streamText exposes async textStream, not toReadableStream()](learnings/vercel-ai-sdk-v4-streamtext-exposes-async.md) — In AI SDK v4, `streamText(...)` exposes a **`textStream`** property (an async iterable of string chunks), not a `toReadableStream()` method. To stream a respons
- [Voyage free-tier rate limit (3 RPM / 10K TPM) blocks bulk backfill without a payment method](learnings/voyage-free-tier-rate-limit-3-rpm-10k-tpm-blocks.md) — Gotcha
- [Voyage rerank-2.5-lite has run-to-run rank variance (±2 positions)](learnings/voyage-rerank-2-5-lite-has-run-to-run-rank.md) — The gotcha
<!-- wiki-nav:end -->

An [OKF](https://github.com/earendil-works/okf) bundle documenting this project.

- [Overview](./overview.md) — What this project contains and its structure
- [File tree](./architecture/file-tree.md) — Complete project file listing
- [Glossary](./glossary.md) — Key terms for this project
- [Decisions](./decisions/) — Major decisions and direction shifts (ADRs)
- [Rules](./rules/) — Reusable heuristics, guidelines, and conventions
- [Pages](./pages/) — Concepts, entities, and artifacts of this project
- [Learnings](./learnings/) — Captured learnings and insights
- [Preferences](./preferences/) — Captured preferences and conventions
