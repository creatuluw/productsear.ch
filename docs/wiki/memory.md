---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-11-06T19:39:44.099Z.

## Recent Decisions

- [The Drum converged (Q15-A) — formal spec written at docs/specs/the-drum.md](decisions/the-drum-converged-q15-a-formal-spec-written-at-docs-specs-t.md) — Context (2026-11-06)
- [Feed round 14: Same Day Last Year out; the feed is named The Drum; convergence slate locked pending final verdict (Q15)](decisions/feed-round-14-same-day-last-year-out-the-feed-is-named-the-d.md) — Context (2026-11-06)
- [Feed round 13: stream order fixed round-robin; The Backlog in (draw-time drafts + auto-publish); inline editor on all posts; accounts = phase 2; Same Day Last Year pitched (type #12)](decisions/feed-round-13-stream-order-fixed-round-robin-the-backlog-in-.md) — Context (2026-11-06)
- [Feed round 12 wrap: approvals are per-item admin toggles; The Digest in as admin-toggled dark launch (off by default); The Backlog pitched (launch pre-draft)](decisions/feed-round-12-wrap-approvals-are-per-item-admin-toggles-the-.md) — Context (2026-11-06)
- [Feed round 12: editorial workflow in (corpus-drafted, admin-approved); artifact source D hybrid+origin tags; The Drum in; The Digest pitched (utobo email)](decisions/feed-round-12-editorial-workflow-in-corpus-drafted-admin-app.md) — Context (2026-11-06)
- [Feed round 11: The Floor in (type #10), Impress the Boss in as user-originated type #11; The Drum pitched (countdown mechanic)](decisions/feed-round-11-the-floor-in-type-10-impress-the-boss-in-as-us.md) — Context (2026-11-06)
- [Feed round 10: Tombola selection corpus-derived; Origin card parked; The Floor pitched (aggregated search misses)](decisions/feed-round-10-tombola-selection-corpus-derived-origin-card-p.md) — Context (2026-11-06)
- [Feed round 9: cadence 1 item/2 days admin-configurable; The Tombola in as type #9; The Origin card pitched](decisions/feed-round-9-cadence-1-item-2-days-admin-configurable-the-to.md) — Context (2026-11-06)
- [Feed round 8: homepage shows 3 latest feed cards; The Walk in, Ribbon's Diary re-pitched](decisions/feed-round-8-homepage-shows-3-latest-feed-cards-the-walk-in-.md) — Feed round 8: homepage shows 3 latest feed cards; The Walk in, Ribbon's Diary re-pitched (2026-11-06)
- [Feed round 7: v1 ships all 7 item types; The Walk pitched](decisions/feed-round-7-v1-ships-all-7-item-types-the-walk-pitched.md) — Context (2026-11-06)
- [Adopt dark theme via semantic token swap on html.dark (reverses earlier deferral)](decisions/adopt-dark-theme-via-semantic-token-swap-on-html-dark-revers.md) — Context (2026-11-06)
- [Feed round 6: Bluesky-only share; Receipt cards accepted](decisions/feed-round-6-bluesky-only-share-receipt-cards-accepted.md) — Context (2026-11-06)
- [Feed stream runs on rotation (personalization post-accounts); The Pulse accepted; Receipt cards pitched (proposed)](decisions/feed-stream-runs-on-rotation-personalization-post-accounts-t.md) — Context (2026-11-06)
- [Corpus feed anatomy: stream + stack; Ambition Path accepted; The Pulse pitched (proposed)](decisions/corpus-feed-anatomy-stream-stack-ambition-path-accepted-the-.md) — Context (2026-11-06)
- [Reshape the corpus feed as a listings feed of item types: pitches, One Save, Two Futures (proposed)](decisions/reshape-the-corpus-feed-as-a-listings-feed-of-item-types-pit.md) — Context (2026-11-06)

## Active Rules

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

## Recent Learnings — development patterns

- [Dark theme token architecture: @theme inline + html.dark swap, no hardcoded oklch](learnings/dark-theme-token-architecture-theme-inline-html-dark-swap-no.md) — **The architecture (added 2026-11-06, commit c06dfe4):** theming works by swapping semantic vars on `html.dark`, not by `dark:` utilities. (2026-11-06)
- [Interview brevity refinement: bare lettered options, no prose — "way too complex"](learnings/interview-brevity-refinement-bare-lettered-options-no-prose-.md) — **The refinement (2026-11-06, magazine-feed brainstorm round 2):** the lettered-options interview format from [[rules/interview-questions-sh… (2026-11-06)
- [Production runs Railway commits only — local uncommitted work is invisible on the live site](learnings/production-runs-railway-commits-only-local-uncommitted-work-.md) — **Discovered 2026-11-06** when the user reported "I don't see an icon to log into the admin" on https://productsear.ch/: (2026-11-06)
- [better-auth on SvelteKit adapter-node: zod4 + @opentelemetry/api must be installed](learnings/better-auth-on-sveltekit-adapter-node-zod4-opentelemetry-api.md) — Two runtime crashes when deploying better-auth 1.7.18 in a SvelteKit @sveltejs/adapter-node build (2026-11-06): (2026-11-06)
- [Splitting npm dependency versions: direct dep for the new, pinned deps nest auto](learnings/splitting-npm-dependency-versions-direct-dep-for-the-new-pin.md) — When different versions of a package must coexist (npm hoists only ONE version to top-level node_modules), declare the newer one as a direct… (2026-11-06)
- [wiki_note_* auto-converts wikilinks to relative links — cross-folder references need path-qualified slugs](learnings/wiki-note-auto-converts-wikilinks-to-relative-links-cross-fo.md) — Discovered 2026-11-06 while creating the [[utobo-email-transactional-email-service]] entity page and cross-linking it to the utobo sending-d… (2026-11-06)
- [Verify GoDaddy DNS writes by polling the authoritative nameservers — API writes are visible instantly](learnings/verify-godaddy-dns-writes-by-polling-the-authoritative-names.md) — Discovered 2026-11-06 while setting up the utobo sending-domain records for productsear.ch via the GoDaddy Domains API: (2026-11-06)
- [Deliberately untracked paths: .archive/ is gitignored (holds .ghtoken); wave-loader-demo.html stays local-only](learnings/deliberately-untracked-paths-archive-is-gitignored-holds-ght.md) — Discovered 2026-11-06 while committing/pushing the pipeline work (5 commits, `1ac2b8e..bbd94b1`). (2026-11-06)
- [Git Bash mangles /PID-style flags in taskkill — use //PID escaping and verify the port is freed](learnings/git-bash-mangles-pid-style-flags-in-taskkill-use-pid-escapin.md) — Discovered 2026-11-06 while killing an orphaned preview server on port 3199 (exact-PID kill, per the global no-name-kill rule): (2026-11-06)
- [Stale orphan server on a test port makes fresh changes look missing — verify what serves the port first](learnings/stale-orphan-server-on-a-test-port-makes-fresh-changes-look-.md) — Discovered 2026-11-06 while verifying the new "last 30 days" homepage tile on a local production build: (2026-11-06)
- [Analyzed metric 100%: analyzer fallback patch + what the metric actually counts](learnings/analyzed-metric-100-analyzer-fallback-patch-what-the-metric-.md) — Discovered 2026-11-06 while driving the homepage `analyzed` vital sign to 100%. (2026-11-06)
- [llmview.ts / skill-doc.ts template literals contain escaped backticks; multi-hunk edit calls are atomic](learnings/llmview-ts-skill-doc-ts-template-literals-contain-escaped-ba.md) — Discovered 2026-11-06 while renaming compendium → collections across the LLM-view surfaces. (2026-11-06)
- [External crawler/analyzer lives at E:\te9.dev — analyzer requires crawled content, processes 100 rows/run newest-first](learnings/external-crawler-analyzer-lives-at-e-te9-dev-analyzer-requir.md) — Discovered 2026-11-06 while answering "where is the sync/analysis pipeline?" (user's best guess: `E:\te9.dev` — confirmed correct). (2026-11-06)
- [Homepage "analyzed" vital sign = analyzed/total ratio — bulk inserts regress it until the external analysis pass runs](learnings/homepage-analyzed-vital-sign-analyzed-total-ratio-bulk-inser.md) — Discovered 2026-11-06 while diagnosing why https://productsear.ch/ showed `analyzed` = 81% (user reported the drop). (2026-11-06)
- [Bookmark ingestion chain is gap-catching; archetypes classifier lives at src/lib/archetypes.ts](learnings/bookmark-ingestion-chain-is-gap-catching-archetypes-classifi.md) — Discovered 2026-11-06 while processing the 522 synthetic repo rows end-to-end. (2026-11-06)
- [Negative synthetic ids for manual bookmarks-table inserts (never collide with the external sync)](learnings/negative-synthetic-ids-for-manual-bookmarks-table-inserts-ne.md) — **The convention (set 2026-11-06):** when manually inserting rows into `te9_dev.bookmarks` (normally an external-sync mirror), use **negativ… (2026-11-06)
- [check-active.js: "active" is user-defined as pushed within 30 days; --resplit re-splits cached data without API calls](learnings/check-active-js-active-is-user-defined-as-pushed-within-30-d.md) — **The fact (set 2026-11-06, user-defined):** for the digital-products-repos activity split, the user explicitly redefined **ACTIVE = last pu… (2026-11-06)
- [Await dotenv imports; anchor .env path](learnings/await-dotenv-imports-anchor-env-path.md) — Two failures when `missing-repos.js` (a plain Node script in `.archive/repo-scan/`) loaded `DATABASE_URL`, discovered 2026-11-06: (2026-11-06)
- [pi loads every standalone .md in .agents/skills/ as a skill named after its parent dir; slash commands live in .pi/prompts/](learnings/pi-skill-name-fallback-and-prompts-dir.md) — Two related facts about how pi loads project-level agent config, discovered 2026-11-06 while fixing a `commands` collision warning: (2026-11-06)
- [MCP server names in .pi/mcp.json forbid dots — name them with letters/digits/_/- only](learnings/mcp-server-names-no-dots.md) — The dot gotcha (found 2026-11-05): pi rejects MCP server names containing characters outside `[A-Za-z0-9_-]`. The project's `.pi/mcp.json` n… (2026-11-06)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-07-04)

## Global Patterns

- [LLM content negotiation](pages/concepts/llm-content-negotiation.md) — What is it? (2026-11-06)
- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it? (2026-08-25)
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it? (2026-07-03)

<!-- wiki-memory:end -->
