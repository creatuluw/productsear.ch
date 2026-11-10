---
type: Artifact
title: File tree
description: Complete project file listing with per-file descriptions.
timestamp: "2026-11-06T20:27:08.223Z"
---

# File tree — regenerated 2026-11-06 (through The Drum slices A–C)
# Excludes .git, node_modules, .svelte-kit, build, .pi, .work, .agents, .archive (gitignored).
# [description] — shorthand summary of each file's function

.
├── .env [local env, gitignored — DATABASE_URL + VOYAGE_API_KEY + chat/LLM provider keys]
├── .env.example [committed env template]
├── .gitignore [.archive/ and wave-loader-demo.html deliberately untracked]
├── .prettierrc
├── README.md
├── eslint.config.js [flat config: typescript-eslint + eslint-plugin-svelte]
├── package.json [SvelteKit 2 + adapter-node + Drizzle + Tailwind 4; `start` = node build]
├── package-lock.json
├── svelte.config.js [adapter-node]
├── tsconfig.json [TS strict]
├── vite.config.ts [sveltekit() plugin + Tailwind 4]
├── docs/
│   ├── specs/
│   │   └── the-drum.md [formal converged spec for The Drum feed]
│   ├── research_semantic_search/
│   │   └── research_report.md [research backing the search/RAG stack decision]
│   └── wiki/ [OKF knowledge wiki bundle — index/overview/memory/glossary + decisions/rules/learnings/pages/changelog]
├── scripts/
│   ├── analyze-bookmarks.js [LLM analysis pass (z.ai GLM-5 → Railway Qwen fallback) → bookmark_analysis; LIMIT 100/run]
│   ├── backfill-archetypes.ts [deterministic multi-label archetype classifier → bookmark_archetypes; --missing]
│   ├── calibrate-floor.ts [rerank score-distribution calibration for RELEVANCE_FLOOR]
│   ├── crawl-bookmarks.js [Readability crawler → bookmark_content; LIMIT 100/run]
│   ├── diagnose-query.ts [trace a query + url-substring target through vec/text/RRF stages]
│   ├── digest-send.ts [The Digest send runner: --dry renders the email, --send sends via utobo; stage-verified gates]
│   ├── embed-bookmarks.ts [resumable batched embedding backfill; --dry-run]
│   ├── feed-draw.ts [The Drum cadence-gated draw runner; --force / --status]
│   ├── insert-missing-repos-active-30d.sql [idempotent INSERT of the 522 active missing repos (synthetic negative ids)]
│   ├── migrate.ts [applies a SQL migration file to DATABASE_URL]
│   ├── migration.sql [pgvector + bookmark_embeddings 384-dim original schema]
│   ├── migration-384.sql [superseded 384-dim variant]
│   ├── migration-admin.sql [auth + admin console tables; idempotent; seeds flags/settings]
│   ├── migration-archetypes.sql [bookmark_archetypes table]
│   ├── migration-digest.sql [digest_subscribers table + feed_settings.last_digest_sent_at send cursor]
│   ├── migration-feed.sql [The Drum data core: feed_items, feed_settings, search_misses]
│   ├── migration-feed-flags.sql [feed_settings nav_enabled / homepage_cards_enabled — The Drum visibility flags]
│   ├── migration-voyage-1024.sql [Voyage voyage-4-large 1024-dim embedding column + index]
│   ├── rollback-insert-missing-repos-active-30d.sql / rollback-migration-admin.sql [undo scripts]
│   ├── run-sql.ts [reusable SQL runner: dry-run = transaction rollback, --commit to persist]
│   ├── sync-raindrop.js [Raindrop → te9_dev.bookmarks upsert-only mirror sync]
│   └── verify-search.ts [end-to-end check that the video-query returns MotionClone]
├── static/
│   ├── favicon.svg
│   ├── fonts/ [vendored Hanken Grotesk TTFs + SIL OFL licenses — brand fonts for the resvg receipt-card OG render]
│   └── mascot-product-search.png [transparent mascot cutout for the site-wide footer]
└── src/
    ├── app.css [Tailwind 4 + semantic theme tokens (@theme inline; html.dark swap for dark mode)]
    ├── app.d.ts [SvelteKit app typings]
    ├── app.html [root HTML shell; Plausible analytics script wired here]
    ├── hooks.server.ts [content negotiation: ?view=llm from non-browser clients → raw text/markdown]
    ├── lib/
    │   ├── archetypes.ts [30-canonical-archetype multi-label classifier (shared)]
    │   ├── auth-client.ts [better-auth browser client]
    │   ├── components/
    │   │   ├── InfoTip.svelte [hover/focus tooltip; methodology + vital-signs labels]
    │   │   ├── LlmDoc.svelte [renders ?view=llm markdown for humans + raw .md link]
    │   │   ├── WaveLoader.svelte [CSS-only wave animation in the latency gauge]
    │   │   ├── wave-loader-demo.html [standalone WaveLoader demo harness; local-only]
    │   │   └── icons/ShieldCogCorner.svelte [admin entry icon; lucide-style shield+cog]
    │   └── server/
    │       ├── admin-guard.ts [requireAdmin() — re-guards every admin form action]
    │       ├── admin-settings.ts [getSetting/getFlag with 30s cache + clearSettingsCache()]
    │       ├── admin-util.ts [shared admin helpers]
    │       ├── auth.ts [better-auth server instance (email+password)]
    │       ├── bookmark-text.ts [builds the one searchable text blob per bookmark]
    │       ├── db/
    │       │   ├── index.ts [Drizzle/postgres-js client; search_path te9_dev,public]
    │       │   ├── admin-schema.ts [admin_extensions/agents/settings/features]
    │       │   └── auth-schema.ts [better-auth tables (auth_ prefix)]
    │       ├── embeddings.ts [Voyage embedding client; voyage-4-large 1024-dim; raw fetch]
    │       ├── feed/
    │       │   ├── digest.ts [Digest pipeline: subscribers, windowed selection (published_at > last_digest_sent_at; limit 12, first send 5), buildDigestHtml, sendDigest()]
    │       │   ├── llm.ts [shared LLM drafting helper: z.ai GLM-5 → Railway gateway; draftText/draftJson; throws so rotation skips]
    │       │   ├── queries.ts [feed_items/feed_settings reads + mutations; listAllItems, patchItemBody, setItemApproval/Status, settings]
    │       │   ├── rotation.ts [drawNext/nextDueInfo — cadence clock + round-robin, catch-and-skip]
    │       │   ├── stack.ts [listing-stack queries + Keep Walking neighbors]
    │       │   ├── types.ts [FeedType roster (10 implemented of 11), FeedItemBody, GeneratorResult — type aliases by design]
    │       │   └── generators/
    │       │       ├── index.ts [GENERATORS registry — one function per implemented type]
    │       │       ├── ambition-path.ts [corpus picks cluster + 5 listings; LLM names ambition, orders steps (id-validated)]
    │       │       ├── floor.ts [aggregated zero-result search themes; waits for search_misses]
    │       │       ├── impress-the-boss.ts [LLM names role + artifact; origin tag described-from-analysis]
    │       │       ├── one-save.ts [LLM why-it-mattered paragraph + reader question]
    │       │       ├── pitch.ts [LLM infers persona, pitches in second person]
    │       │       ├── pulse.ts [archetype drift movers + rising domains]
    │       │       ├── resurrections.ts [300–900-day-old saves, second life]
    │       │       ├── tombola.ts [last-10 saves scored by archetype drift]
    │       │       ├── two-futures.ts [LLM writes the two Tuesday scenes]
    │       │       └── walk.ts [pure pgvector: random seed → 4 nearest-neighbor hops (WalkNode; ARRAY[...]::int[] literal for ALL comparisons)]
    │       ├── llms.ts [?view=llm core: wantsRawMarkdown(), llmMarkdown() route router, mdResponse()]
    │       ├── llmview.ts [per-surface markdown builders (search/archive/collections/feed/methodology) + usage preamble]
    │       ├── rerank.ts [Voyage rerank-2.5-lite cross-encoder client; shares VOYAGE_API_KEY]
    │       ├── search.ts [single hybrid RRF SQL query + pool-then-rerank + RELEVANCE_FLOOR]
    │       └── skill-doc.ts [SKILL_MD — LLM usage guide served at /skill.md; synced with E:\skills.te9.dev]
    └── routes/
        ├── +layout.svelte [site-wide layout: nav (search · listings · collections · feed · the drum) + llms-view toast + footer, footer hidden on ?view=llm]
        ├── +page.server.ts [homepage search load; ?view=llm markdown surfaces]
        ├── +page.svelte [search UI; humans | llms tabs; WaveLoader; InfoTip]
        ├── (admin)/admin/
        │   ├── +layout.svelte [(admin) guard layout]
        │   ├── +page.server.ts / +page.svelte [dashboard: corpus vitals + counts]
        │   ├── agents/ [agent CRUD]
        │   ├── extensions/ [extension CRUD]
        │   ├── features/ [feature-flag toggles]
        │   ├── feed/ [The Drum editorial console: queue, inline editor, approval dial, publish/retract/delete, draw-now, cadence/order/Digest settings]
        │   └── settings/ [settings form]
        ├── (auth)/admin/login/ [sign-in/sign-up outside the (admin) guard]
        ├── api/
        │   ├── auth/[...all]/+server.ts [better-auth catch-all handler]
        │   ├── digest/subscribe/+server.ts [POST — public Digest opt-in: validated, duplicate-safe, unsubscribe-token rotation]
        │   ├── feed/draw/+server.ts [POST — admin-allowlist gated manual drum draw]
        │   ├── feed/og/listing/[id]/+server.ts [GET — receipt-card OG PNG: hand-built SVG → resvg, vendored Hanken Grotesk fonts]
        │   └── search/+server.ts [GET — hybrid RRF search + Voyage rerank]
        ├── archive/ [chronological listings browser + ?view=llm]
        ├── collections/ (+ [slug]/) [archetype roll-up + ?view=llm]
        ├── compendium/ (+ [slug]/) [308 redirects → /collections]
        ├── digest/unsubscribe/ [+page.server.ts / +page.svelte — token unsubscribe from The Digest; subscribers marked, never erased]
        ├── feed/
        │   ├── +page.server.ts / +page.svelte [the drum: header with cadence/next-draw/next-type + methodology link, type-tagged stream, LlmDoc twin]
        │   └── methodology/ [how this drum works — trust surface; same markdown for human + raw views]
        ├── listings/[id]/ [listing stack page: context, its feed items, Keep Walking + ?view=llm]
        └── skill.md/+server.ts [GET /skill.md — raw LLM usage guide]
└── .github/
    └── workflows/
        ├── digest-send.yml [weekly Mon 10:07 UTC cron: The Digest send via utobo (dark by default) + manual dispatch]
        ├── embed-new-bookmarks.yml [daily cron: embed new bookmarks]
        └── feed-draw.yml [daily 09:07 UTC cron: cadence-gated drum draw]
