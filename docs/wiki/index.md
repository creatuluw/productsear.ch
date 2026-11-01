---
okf_version: "0.1"
---

# Project Knowledge Wiki

<!-- wiki-nav:start -->
## Navigation map

Auto-generated detailed index of every docs/wiki/ concept — the map the LLM uses to locate information. 38 concept(s). Regenerated on init and on wiki_mark_synced. Generated 2026-10-27T08:47:00.286Z. entry: `concept-id` (pass to wiki_get) — title — description.

### Core concepts

- `glossary` — Glossary — Key terms for this project.
- `overview` — Overview — What this project contains and its structure.

### Architecture

- `architecture/file-tree` — File tree — Complete project file listing with per-file descriptions.

### Pages

- `pages/artifacts/agentos-sdk-dev-design-system-extraction` — agentos-sdk.dev design system extraction — Reference design system reverse-engineered from https://agentos-sdk.dev/, to be replicated on productsear.ch. Captures exact color tokens, typography, signature
- `pages/artifacts/productsear-ch-promo-video` — productsear.ch promo video — ~6-scene animated promo MP4 introducing productsear.ch (hybrid search + streaming Ask mode), rendered via the html-video engine.
- `pages/concepts/hybrid-search-via-reciprocal-rank-fusion` — Hybrid search via Reciprocal Rank Fusion — What is it?
- `pages/concepts/url-driven-search-state` — URL-driven search state — The ?q=…&mode=ask URL contract in src/routes/+page.svelte: shareable, back/forward-navigable searches.
- `pages/entities/api-ask-endpoint` — API ask endpoint — What is it?
- `pages/entities/api-search-endpoint` — API search endpoint — What is it?
- `pages/entities/daily-embed-new-bookmarks-workflow` — Daily embed-new-bookmarks workflow — `.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that runs the [[embed-bookmarks-backfill-script]] nightly to embed only newly-
- `pages/entities/embed-bookmarks-backfill-script` — Embed-bookmarks backfill script — What is it?
- `pages/entities/rerank-service` — Rerank service — `src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.
- `pages/TEMPLATES` — Page Templates — Reference templates for Concept, Entity, and Artifact pages. Follow these when using wiki_note_page.

### Decisions

- `decisions/adopt-agentos-sdk-dev-visual-design-system` — Adopt agentos-sdk.dev visual design system — Context
- `decisions/adopt-cross-encoder-reranking-voyage-rerank-2-5-lite-on-top-` — Adopt cross-encoder reranking (Voyage rerank-2.5-lite) on top of RRF hybrid search — Context
- `decisions/embedding-provider-voyage-voyage-4-large-1024-dim` — Embedding provider: Voyage voyage-4-large (1024-dim) — Context
- `decisions/hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi` — Hybrid semantic search stack: pgvector + tsvector with RRF fusion — Context
- `decisions/shift-visual-design-to-instrument-grade-precision-tool-syste` — Shift visual design to instrument-grade precision-tool system (OKLCH) — Supersedes the agentos-sdk.dev warm-paper theme: OKLCH tokens, Hanken Grotesk + Martian Mono, live instrument readout.

### Rules
- `rules/instrument-grade-design-principles-avoid-banned-tells` — Instrument-grade design principles; avoid banned tells — The 5 principles + banned visual tells governing all productsear.ch UI work.

- `rules/pool-then-rerank-with-graceful-fallback-for-retrieval` — Pool-then-rerank with graceful fallback for retrieval — Guideline
- `rules/sanitize-text-at-the-embedding-api-boundary` — Sanitize text at the embedding API boundary — Guideline
- `rules/skip-html-sanitizer-for-server-owned-llm-output-add-one-if-u` — Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in — ask-mode answers may render raw HTML only while the markup is fully server-owned.

### Learnings

- `learnings/adapter-node-requires-origin-env-var-for-csrf-protection` — adapter-node requires ORIGIN env var for CSRF protection — When deploying SvelteKit with `@sveltejs/adapter-node`, requests with a mismatched `Host`/`Origin` header are rejected unless the `ORIGIN` environment variable
- `learnings/agentos-sdk-dev-is-a-light-warm-paper-theme-not-dark` — agentos-sdk.dev is a light warm-paper theme, not dark — When extracting the design system from https://agentos-sdk.dev/, the `:root` CSS contains leftover shadcn dark-mode HSL variables (e.g. `--background: 240 10% 3
- `learnings/bookmarks-table-is-a-read-only-mirror-the-raindrop-db-sync-l` — bookmarks table is a read-only mirror — the Raindrop→DB sync lives outside this repo — te9_dev source tables are read-only mirrors populated by an external Raindrop sync.
- `learnings/driving-html-video-nexu-io-headlessly-to-render-a-product-vi` — Driving html-video (nexu.io) headlessly to render a product video — How-to + gotchas for the html-video engine (multi-frame CLI path; freeze/unfreeze breaks animation-delay).
- `learnings/env-dynamic-private-breaks-under-plain-tsx-use-process-env-i` — $env/dynamic/private breaks under plain tsx — use process.env in shared server modules — SvelteKit's `$env/dynamic/private` is a **virtual module resolved only by the SvelteKit Vite pipeline**. Importing it from a standalone script run via `tsx` (e.
- `learnings/github-requires-workflow-scope-on-the-token-to-push-commits-` — GitHub requires `workflow` scope on the token to push commits touching `.github/workflows/` — A token with only `repo` (and `gist`, `read:org`) scopes cannot push a commit that modifies any file under `.github/workflows/`. GitHub rejects the push with a 
- `learnings/github-disables-scheduled-workflows-after-60-days-without-co` — GitHub disables scheduled workflows after 60 days without commits — cron runs don't count — A green nightly cron still gets disabled_inactivity; only commits reset the 60-day clock.
- `learnings/gold-accent-fails-wcag-aa-contrast-when-used-for-chip-tag-te` — Gold accent fails WCAG AA contrast when used for chip/tag text — Use gold only for accents, never for small text on the paper background.
- `learnings/postgres-fts-word-too-long-notice-for-2047-char-tokens-is-ha` — Postgres FTS "word too long" NOTICE for >2047-char tokens is harmless — When populating a `tsvector` / `search_tsv` column, Postgres may emit a NOTICE like:
- `learnings/postgres-js-db-execute-returns-rows-directly-not-rows` — postgres-js db.execute() returns rows directly, not { rows } — When using Drizzle's postgres-js driver, `db.execute(sql\`...\`)` returns the **row array directly**, not an object with a `.rows` property (unlike the `pg`/nod
- `learnings/railpack-railway-build-driver-requires-a-start-command` — Railpack (Railway build driver) requires a start command — Railpack is Railway's default build driver (v0.30.0 at time of writing). It infers the start command for a Node app by checking, in order:
- `learnings/raindrop-db-sync-runs-outside-this-repo-published-page-count` — Raindrop→DB sync runs outside this repo; published page counts drift — Homepage counts must be queried live, never hardcoded.
- `learnings/skill-skill-md-description-must-quote-colons-to-avoid-yaml-n` — SKILL.md description must quote colons to avoid YAML parse errors — A plain-scalar description containing colon-space breaks frontmatter parsing.
- `learnings/sveltekit-dev-server-does-not-populate-process-env-from-env-` — SvelteKit dev server does not populate process.env from .env — load dotenv yourself — SvelteKit's Vite dev server does **not** populate `process.env` from your `.env` file. That is what the `$env/*` virtual modules are for. If your server modules
- `learnings/vercel-ai-sdk-v4-streamtext-exposes-async-textstream-not-tor` — Vercel AI SDK v4 streamText exposes async textStream, not toReadableStream() — In AI SDK v4, `streamText(...)` exposes a **`textStream`** property (an async iterable of string chunks), not a `toReadableStream()` method. To stream a respons
- `learnings/voyage-free-tier-rate-limit-3-rpm-10k-tpm-blocks-bulk-backfi` — Voyage free-tier rate limit (3 RPM / 10K TPM) blocks bulk backfill without a payment method — Gotcha
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
