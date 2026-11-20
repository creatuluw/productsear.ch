---
okf_version: "0.2"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-11-20T13:38:51.488Z.

## Recent Decisions

- [Drum rotation never draws the same type twice in a row](decisions/drum-rotation-never-draws-the-same-type-twice-in-a-row.md) — Context (2026-11-20)
- [The Walk demoted to half frequency (20-day minimum gap) and its trail items made clickable](decisions/the-walk-demoted-to-half-frequency-20-day-minimum-gap-and-it.md) — Context (2026-11-18)
- [Drum draw schedule made miss-proof (cron redundancy)](decisions/drum-draw-schedule-made-miss-proof-cron-redundancy.md) — Context (2026-11-13)
- [Drum draw retimed to 06:00 Amsterdam (cron 05:03 UTC, DST drift accepted)](decisions/drum-draw-retimed-to-06-00-amsterdam-cron-05-03-utc-dst-drif.md) — Context (2026-11-12)
- [Drum draw cadence: once daily at 07:00 Amsterdam time](decisions/drum-draw-cadence-once-daily-at-07-00-amsterdam-time.md) — Context (2026-11-12)
- [Drum items gate on email approval — preview + Approve / Generate new / Skip mailed to the owner before anything publishes](decisions/drum-items-gate-on-email-approval-preview-approve-generate-n.md) — Context (2026-11-12)
- [Trim sitemap.xml to hub surfaces only — no individual listing URLs](decisions/trim-sitemap-xml-to-hub-surfaces-only-no-individual-listing-.md) — Context (2026-11-10)
- [Adopt full search-engine and LLM discovery infrastructure](decisions/adopt-full-search-engine-and-llm-discovery-infrastructure.md) — Context (2026-11-10)
- [Elegant shared OG cards: one card builder in $lib/server/og plus a dedicated Drum OG endpoint](decisions/elegant-shared-og-cards-one-card-builder-in-lib-server-og-pl.md) — Context (2026-11-07)
- [Homepage content/system-metadata split: auto-opening search drawer](decisions/homepage-content-system-metadata-split-auto-opening-search-d.md) — **Context.** The homepage carried two system-metadata blocks inline in the page flow — the retrieval-methodology line (semantic + full-text … (2026-11-07)
- [Adapt every public surface for touch/mobile — rethink, don't scale](decisions/adapt-every-public-surface-for-touch-mobile-rethink-don-t-sc.md) — **Context.** The site was desktop-first. A diagnosis pass (impeccable adapt skill, run through the [[rules/redesign-surfaces-via-the-gestalt… (2026-11-06)
- [Redesign The Drum /feed around the nine Gestalt principles](decisions/redesign-the-drum-feed-around-the-nine-gestalt-principles.md) — **Context.** The `/feed` page (The Drum, [[pages/entities/the-drum-feed]]) had shipped as a functional column of hairline-separated rows: un… (2026-11-06)
- [Receipt-card OG images: hand-built SVG + @resvg/resvg-js (replaces broken-outside-Vercel @vercel/og)](decisions/receipt-card-og-images-hand-built-svg-resvg-resvg-js-replace.md) — Context (2026-11-06)
- [The Drum converged (Q15-A) — formal spec written at docs/specs/the-drum.md](decisions/the-drum-converged-q15-a-formal-spec-written-at-docs-specs-t.md) — Context (2026-11-06)
- [Feed round 14: Same Day Last Year out; the feed is named The Drum; convergence slate locked pending final verdict (Q15)](decisions/feed-round-14-same-day-last-year-out-the-feed-is-named-the-d.md) — Context (2026-11-06)

## Active Rules

- [Verify production runtime env vars before declaring a send pipeline armed](rules/verify-production-runtime-env-vars-before-declaring-a-send-p.md) — **Guideline:** Before declaring any external-send or API-integration pipeline operational (utobo email, Drum approval mails, The Digest send… (2026-11-12)
- [Back up and dry-run the restore before any destructive bulk delete](rules/back-up-and-dry-run-the-restore-before-any-destructive-bulk-.md) — **Guideline:** Before a destructive bulk DELETE against `te9_dev` (e.g. wiping a table like `feed_items`), run the three-step interlock — an… (2026-11-07)
- [OG endpoint assets must fail soft: lazy-read with try/catch, omit gracefully](rules/og-endpoint-assets-must-fail-soft-lazy-read-with-try-catch-o.md) — **Guideline:** Any binary asset an OG/social-card renderer depends on (mascot PNG, fonts, future images) must be loaded **tolerantly**: a la… (2026-11-07)
- [Probe responsive overflow programmatically; don't eyeball screenshots](rules/probe-responsive-overflow-programmatically-don-t-eyeball-scr.md) — **Guideline:** For any responsive change, verify overflow by measurement, not by looking at screenshots. Build (`npm run build`), serve `nod… (2026-11-06)
- [Redesign surfaces via the Gestalt diagnosis-then-map method](rules/redesign-surfaces-via-the-gestalt-diagnosis-then-map-method.md) — **Guideline:** When a redesign request lands ("make X read/enjoy better"), run the nine Gestalt principles (common region, closure, proximit… (2026-11-06)
- [Style with semantic theme tokens only — never hardcode colors](rules/style-with-semantic-theme-tokens-only-never-hardcode-colors.md) — **Guideline:** Every color in components and raw CSS must reference the semantic theme tokens (`var(--canvas)`, `var(--ink)`, `var(--accent)… (2026-11-06)
- [Brainstorm pacing: one idea + one grill question per turn, branch ledger](rules/brainstorm-pacing-one-idea-one-grill-question-per-turn-branc.md) — **Guideline:** In ideation/brainstorm sessions with this user, do **not** batch multiple questions or a big idea menu into one turn. Each tu… (2026-11-06)
- [Interview questions ship with lettered options plus a proceed/notes/add-your-own round](rules/interview-questions-ship-with-lettered-options-plus-a-procee.md) — **Guideline:** In any planning/design interview with this user (grill-docs-style P2 rounds, feature scoping, content-brainstorm triage), nev… (2026-11-06)
- [Verify the serving process on a test port before trusting smoke tests](rules/verify-the-serving-process-on-a-test-port-before-trusting-sm.md) — **Guideline:** After any restart of a local `node build` preview server, verify what actually serves the test port `netstat -ano | findstr :… (2026-11-06)
- [Attribute build failures before fixing; never touch a concurrent session's in-progress work](rules/attribute-build-failures-before-fixing-never-touch-a-concurr.md) — **Guideline:** When a whole-project check (`npm run build`, typecheck) fails in this repo, attribute the errors **before** treating your own… (2026-11-06)
- [Check the index before committing; use pathspec-scoped commits in repos with pre-staged changes](rules/check-the-index-before-committing-use-pathspec-scoped-commit.md) — **Guideline:** Before running `git commit` in any repo — especially auxiliary/external repos like `E:\skills.te9.dev` whose indexes accumula… (2026-11-06)
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

## Preferences & Conventions

- [Suggested v1 spotlight starting five](preferences/suggested-v1-spotlight-starting-five.md) — Starting set: Teardown, Head-to-Head Comparison, Ranked Listicle, State-of-the-Archetype Report, Search Demand Memo — chosen so no two overl… (2026-11-19)

## Recent Learnings — development patterns

- [docs/write-up-examples/ folder structure and standalone rendering](learnings/docs-write-up-examples-folder-structure-and-standalone-rende.md) — The `docs/write-up-examples/` folder contains 18 files: `index.html` (directory of all 16 format examples grouped into families A single-lis… (2026-11-19)
- [Write-up example corpus data](learnings/write-up-example-corpus-data.md) — Real database data grounds the 16 format examples: n8n saved July 2023 (comeback), Perplexica saved twice, ai-coding-agent saves grew 3 (202… (2026-11-19)
- [Site styling tokens live in src/app.css](learnings/site-styling-tokens-live-in-src-app-css.md) — The canonical design system for productsear.ch pages is extracted from `src/app.css`: Hanken Grotesk + Martian Mono fonts, OKLCH warm-paper … (2026-11-19)
- [Spotlight pipeline maps to existing stored fields](learnings/spotlight-pipeline-maps-to-existing-stored-fields.md) — Every spotlight structure can be drafted by an LLM from fields the corpus already stores (purpose/howToUse/whenToUse/analysis, embeddings, f… (2026-11-19)
- [Search Demand Memo is the unique differentiator](learnings/search-demand-memo-is-the-unique-differentiator.md) — Of the 16 spotlight formats, only the Search Demand Memo (C3) can't be replicated by competitors — it's built from the `search_logs` table, … (2026-11-19)
- [Search logging must be fire-and-forget](learnings/search-logging-must-be-fire-and-forget.md) — Logging inserts into the search path follow the same contract as the existing `search_misses` insert: never awaited, never thrown into the c… (2026-11-18)
- [All human searches flow through /api/search](learnings/all-human-searches-flow-through-api-search.md) — The homepage search is a client-side fetch to `GET /api/search` (not a server load), so instrumenting that one endpoint covers all human sea… (2026-11-18)
- [Feed generators self-gate by returning null; rotation falls through](learnings/feed-generators-self-gate-by-returning-null-rotation-falls-t.md) — Frequency control is implemented inside each generator: `walk.ts` returns `null` when <20 days since the last *published* walk, and the rota… (2026-11-18)
- [Walk item URLs were already stored, only human renderer ignored them](learnings/walk-item-urls-were-already-stored-only-human-renderer-ignor.md) — Walk body items have carried `body.items[].url` in the DB all along (including the three live rows), but `+page.svelte` rendered `li.label` … (2026-11-18)
- [The Walk is the only failure-proof drum type; The Floor starves silently](learnings/the-walk-is-the-only-failure-proof-drum-type-the-floor-starv.md) — Of the drum's 10 types, The Walk is the only generator with no LLM/external dependency — it's pure pgvector nearest-neighbor SQL, so it can … (2026-11-18)
- [When LLM providers are down, the drum degenerates into consecutive Walk items](learnings/when-llm-providers-are-down-the-drum-degenerates-into-consec.md) — **The fact (established 2026-11-18):** when the LLM drafting chain is down, The Drum's round-robin degenerates into **consecutive Walk items… (2026-11-18)
- [Drum 24h cadence clock runs from the last draw — a manual redraw legitimately skips the next morning email](learnings/drum-24h-cadence-clock-runs-from-the-last-draw-a-manual-redr.md) — **The fact (established 2026-11-13 while answering "should I have gotten an email already?"):** the Drum approval-email cadence is a **24h c… (2026-11-13)
- [UTOBO_EMAIL_API_KEY was missing from the Railway runtime — local-send success masked the prod gap](learnings/utobo-email-api-key-was-missing-from-the-railway-runtime-loc.md) — **The incident (2026-11-12, "Generate new produced no new approval email"):** The Drum approval send failed silently in production — Railway… (2026-11-12)
- [Railway CLI sets env vars via the `variable set` subcommand — the --set flag is legacy](learnings/railway-cli-sets-env-vars-via-the-variable-set-subcommand-th.md) — **The gotcha (found 2026-11-12 while wiring `DRUM_APPROVAL_SECRET` across environments):** on Railway CLI 5.x (5.62.1), setting env vars goe… (2026-11-12)
- [GitHub Actions cron is UTC-only — Amsterdam-local schedules drift an hour with DST](learnings/github-actions-cron-is-utc-only-amsterdam-local-schedules-dr.md) — **The fact (found 2026-11-12 while retiming the drum draw):** GitHub Actions `schedule:` accepts cron expressions in **UTC only** — there is… (2026-11-12)
- [Feed surfaces link synthetic negative-id listings — public listing routes must accept any integer id](learnings/feed-surfaces-link-synthetic-negative-id-listings-public-lis.md) — **The coupling (found 2026-11-10, fixed in commit `e4ecd86`):** feed surfaces link `/listings/{id}` for their drawn items — Drum cards and T… (2026-11-10)
- [Svelte script blocks terminate at a literal </script> — even in comments](learnings/svelte-script-blocks-terminate-at-a-literal-script-even-in-c.md) — **The gotcha (found 2026-11-10 while adding JSON-LD via a `JsonLd.svelte` head component):** (2026-11-10)
- [The Digest is deactivated at two layers (feature gate + disabled cron); re-arm procedure documented](learnings/the-digest-is-deactivated-at-two-layers-feature-gate-disable.md) — **The state (2026-11-09):** The Digest is deliberately deactivated at BOTH control layers, so no email can go out: (2026-11-09)
- [GitHub Actions invalid YAML: startup failure with zero jobs; the schedule silently never fires](learnings/github-actions-invalid-yaml-startup-failure-with-zero-jobs-t.md) — **The gotcha (found 2026-11-09):** a `run:` value containing `Drum draw:` — a `colon+space` inside a plain (unquoted) YAML scalar — made `.g… (2026-11-09)
- [Wiping feed_items: due = max(created_at), rotation resets, empty state degrades gracefully](learnings/wiping-feed-items-due-max-created-at-rotation-resets-empty-s.md) — Discovered 2026-11-07 while wiping all Drum items and handing the surface back to the normal draw flow. (2026-11-07)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-11-10)

## Global Patterns

- [Spotlight write-up format taxonomy](pages/concepts/spotlight-write-up-format-taxonomy.md) — Editorial catalog of 16 write-up structures in 4 families for promoting database listings: A) single-listing (Teardown, First-Run Guide, Cur… (2026-11-19)
- [Search and LLM discovery layer](pages/concepts/search-and-llm-discovery-layer.md) — The site-wide layer that makes productsear.ch findable and legible to three machine audiences — search-engine crawlers, AI answer-engine cra… (2026-11-10)
- [LLM content negotiation](pages/concepts/llm-content-negotiation.md) — What is it? (2026-11-06)
- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it? (2026-08-25)
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it? (2026-07-03)

<!-- wiki-memory:end -->
