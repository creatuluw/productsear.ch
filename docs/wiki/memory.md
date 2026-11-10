---
okf_version: "0.1"
---

<!-- wiki-memory:start -->
# Memory — the live contract

Auto-generated digest of the most recent conventions, decisions, rules and
development patterns, plus architecture and global patterns — newest first.
The actual files live in the wiki subfolders; follow the links (clickable in /wiki).
Regenerated on every wiki write and on wiki_mark_synced. Generated 2026-11-10T11:26:57.816Z.

## Recent Decisions

- [Elegant shared OG cards: one card builder in $lib/server/og plus a dedicated Drum OG endpoint](decisions/elegant-shared-og-cards-one-card-builder-in-lib-server-og-pl.md) — Context (2026-11-07)
- [Homepage content/system-metadata split: auto-opening search drawer](decisions/homepage-content-system-metadata-split-auto-opening-search-d.md) — **Context.** The homepage carried two system-metadata blocks inline in the page flow — the retrieval-methodology line (semantic + full-text … (2026-11-07)
- [Adapt every public surface for touch/mobile — rethink, don't scale](decisions/adapt-every-public-surface-for-touch-mobile-rethink-don-t-sc.md) — **Context.** The site was desktop-first. A diagnosis pass (impeccable adapt skill, run through the [[rules/redesign-surfaces-via-the-gestalt… (2026-11-06)
- [Redesign The Drum /feed around the nine Gestalt principles](decisions/redesign-the-drum-feed-around-the-nine-gestalt-principles.md) — **Context.** The `/feed` page (The Drum, [[pages/entities/the-drum-feed]]) had shipped as a functional column of hairline-separated rows: un… (2026-11-06)
- [Receipt-card OG images: hand-built SVG + @resvg/resvg-js (replaces broken-outside-Vercel @vercel/og)](decisions/receipt-card-og-images-hand-built-svg-resvg-resvg-js-replace.md) — Context (2026-11-06)
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

## Active Rules

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

## Recent Learnings — development patterns

- [Svelte script blocks terminate at a literal </script> — even in comments](learnings/svelte-script-blocks-terminate-at-a-literal-script-even-in-c.md) — **The gotcha (found 2026-11-10 while adding JSON-LD via a `JsonLd.svelte` head component):** (2026-11-10)
- [The Digest is deactivated at two layers (feature gate + disabled cron); re-arm procedure documented](learnings/the-digest-is-deactivated-at-two-layers-feature-gate-disable.md) — **The state (2026-11-09):** The Digest is deliberately deactivated at BOTH control layers, so no email can go out: (2026-11-09)
- [GitHub Actions invalid YAML: startup failure with zero jobs; the schedule silently never fires](learnings/github-actions-invalid-yaml-startup-failure-with-zero-jobs-t.md) — **The gotcha (found 2026-11-09):** a `run:` value containing `Drum draw:` — a `colon+space` inside a plain (unquoted) YAML scalar — made `.g… (2026-11-09)
- [Wiping feed_items: due = max(created_at), rotation resets, empty state degrades gracefully](learnings/wiping-feed-items-due-max-created-at-rotation-resets-empty-s.md) — Discovered 2026-11-07 while wiping all Drum items and handing the surface back to the normal draw flow. (2026-11-07)
- [Bluesky link-card cache is keyed by the shared URL — bust the share URL, not just og:image](learnings/bluesky-link-card-cache-is-keyed-by-the-shared-url-bust-the-.md) — **The mechanism (discovered 2026-11-07, commit `80cadc8`):** Bluesky's link-card cache is keyed by **the shared URL itself** (`/listings/227… (2026-11-07)
- [Bluesky caches og:image aggressively — bump a ?v=N cache-bust on card URLs after redesigns](learnings/bluesky-caches-og-image-aggressively-bump-a-v-n-cache-bust-o.md) — **The incident (2026-11-07, commit `6b3aeb0`):** after the receipt-card redesign, the user pasted a Bluesky compose screenshot showing the *… (2026-11-07)
- [Fixed locally but never committed — verify HEAD bytes when prod diverges (OG font incident)](learnings/fixed-locally-but-never-committed-verify-head-bytes-when-pro.md) — **The incident (2026-11-07, commit `faf3818`):** production Bluesky cards rendered with **all text missing** while the local working tree re… (2026-11-07)
- [Translucent overlays ghost background content — auto-opening drawers go canvas-solid](learnings/translucent-overlays-ghost-background-content-auto-opening-d.md) — Discovered 2026-11-07 while building the homepage system drawer (`src/routes/+page.svelte`, commit `9168e3d`). (2026-11-07)
- [opacity-0 elements still occupy layout space — closed tipboxes caused 54px of phantom overflow](learnings/opacity-0-elements-still-occupy-layout-space-closed-tipboxes.md) — Discovered 2026-11-06 while probing 54px of hidden horizontal overflow on 390px phones: the three closed tipboxes were hidden with `opacity:… (2026-11-06)
- [The same port number can be live on IPv4 and IPv6 with different owners — hit 127.0.0.1 explicitly](learnings/the-same-port-number-can-be-live-on-ipv4-and-ipv6-with-diffe.md) — Discovered 2026-11-06 during the mobile-adaptation preview loop. On Windows, two different processes can simultaneously own the SAME port nu… (2026-11-06)
- [The Digest send pipeline verifies in stages — "no active subscribers" is the expected stop when armed but empty](learnings/the-digest-send-pipeline-verifies-in-stages-no-active-subscr.md) — **The behavior (verified 2026-11-06 after the operator added the utobo secrets):** `scripts/digest-send.ts` gates its send path in stages, a… (2026-11-06)
- [Utobo API key provisioning: dashboard path, shown once, Send-only scope](learnings/utobo-api-key-provisioning-dashboard-path-shown-once-send-on.md) — **The how-to (settled 2026-11-06 while wiring The Digest's sends):** the utobo API key for `UTOBO_EMAIL_API_KEY` is created in the **email.u… (2026-11-06)
- [gstatic css2 legacy-UA downloads are EOT files, not TTFs — pull real TTFs from the official repo](learnings/gstatic-css2-api-serves-ttf-urls-with-an-old-user-agent.md) — The legacy user-agent trick against Google Fonts' css2 API returns URLs whose downloaded bytes are legacy EOT, not TTF — @resvg/resvg-js sil… (2026-11-06)
- [Don't name a domain type Node in DOM-lib code — shadowing the global bites](learnings/don-t-name-a-domain-type-node-in-dom-lib-code-shadowing-the-.md) — With `lib.dom` in the tsconfig (SvelteKit default), declaring your own `interface Node` / `type Node` shadows the global DOM `Node`. Whereve… (2026-11-06)
- [In a FROM list, JOIN binds tighter than comma — put set-returning functions last](learnings/in-a-from-list-join-binds-tighter-than-comma-put-set-returni.md) — **The gotcha (2026-11-06, Ambition Path query):** when a FROM list mixes comma joins and explicit JOINs, Postgres parses the JOIN as binding… (2026-11-06)
- [SELECT DISTINCT ... ORDER BY random() is illegal in Postgres](learnings/select-distinct-order-by-random-is-illegal-in-postgres.md) — **The rule:** with `SELECT DISTINCT`, every `ORDER BY` expression must appear in the select list. `random()` is not in the list, so Postgres… (2026-11-06)
- [TS interfaces lack implicit index signatures — type aliases have them](learnings/ts-interfaces-lack-implicit-index-signatures-type-aliases-ha.md) — **The rule (hit 2026-11-06 in The Drum slice C):** a TypeScript `interface` is **not** assignable to `Record<string, unknown>` — `Index sign… (2026-11-06)
- [Drizzle's sql tag expands JS arrays into a param tuple — not an array literal](learnings/drizzle-s-sql-tag-expands-js-arrays-into-a-param-tuple-not-a.md) — **The gotcha (2026-11-06, The Drum slice C):** interpolating a JS array into a drizzle `sql` template sends it as a list of separate bind pa… (2026-11-06)
- [Drizzle's sql tag has no .json() — use explicit JSON.stringify(...)::jsonb casts](learnings/drizzle-s-sql-tag-has-no-json-use-explicit-json-stringify-js.md) — Discovered 2026-11-06 during The Drum slice A seed (`scripts/` feeding `feed_items` jsonb payloads). (2026-11-06)
- [Standalone tsx scripts hang after success — close the postgres pool or call process.exit()](learnings/standalone-tsx-scripts-hang-after-success-close-the-postgres.md) — Discovered 2026-11-06 while seeding The Drum (`feed-draw` seed script run via tsx). (2026-11-06)

## Architecture

- [File tree](architecture/file-tree.md) — Complete project file listing with per-file descriptions. (2026-11-06)

## Global Patterns

- [LLM content negotiation](pages/concepts/llm-content-negotiation.md) — What is it? (2026-11-06)
- [URL-driven search state](pages/concepts/url-driven-search-state.md) — What is it? (2026-08-25)
- [Hybrid search via Reciprocal Rank Fusion](pages/concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it? (2026-07-03)

<!-- wiki-memory:end -->
