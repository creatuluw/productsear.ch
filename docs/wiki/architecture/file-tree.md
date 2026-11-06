---
type: Artifact
title: File tree
description: Complete project file listing with per-file descriptions.
timestamp: "2026-07-04T00:00:00.000Z"
---

# File tree — generated 2026-11-01
# Excludes .git, node_modules, .svelte-kit, build, .pi, .work, .agents.
# [description] — shorthand summary of each file's function

.
├── .env [local env, gitignored — DATABASE_URL + VOYAGE_API_KEY + chat provider keys]
├── .env.example [committed env template; Voyage keys + DeepSeek/OpenAI chat config]
├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.js [flat config: typescript-eslint + eslint-plugin-svelte]
├── package.json [SvelteKit 2 + adapter-node + Drizzle + ai SDK + Tailwind 4; `start` = node build]
├── package-lock.json
├── svelte.config.js [adapter-node]
├── tsconfig.json [TS strict]
├── vite.config.ts [sveltekit() plugin from @sveltejs/kit/vite + Tailwind 4]
├── docs/ [project documentation]
│   └── wiki/ [OKF knowledge wiki bundle]
│       ├── architecture/ [architectural artifacts (diagrams, file maps)]
│       │   └── file-tree.md [this file — complete project listing]
│       ├── decisions/ [Architecture Decision Records (ADRs)]
│       │   ├── hybrid-semantic-search-stack-pgvector-tsvector.md [core search/RAG stack choice]
│       │   └── index.md
│       ├── learnings/ [captured insights and non-obvious facts]
│       │   ├── env-dynamic-private-breaks-under-plain-tsx-use.md [$env/dynamic/private + tsx gotcha]
│       │   ├── postgres-js-db-execute-returns-rows-directly-not.md [db.execute shape gotcha]
│       │   ├── vercel-ai-sdk-v4-streamtext-exposes-async.md [streamText surface gotcha]
│       │   └── index.md
│       ├── pages/ [project pages: concepts, entities, artifacts]
│       │   ├── concepts/
│       │   │   ├── hybrid-search-via-reciprocal-rank-fusion.md [RRF fusion concept]
│       │   │   └── index.md
│       │   ├── entities/
│       │   │   ├── api-ask-endpoint.md [streaming RAG route]
│       │   │   ├── api-search-endpoint.md [hybrid search route]
│       │   │   ├── embed-bookmarks-backfill-script.md [resumable embedding backfill]
│       │   │   └── index.md
│       │   ├── artifacts/ [empty — index only]
│       │   ├── TEMPLATES.md [reference templates for Concept/Entity/Artifact pages]
│       │   └── index.md
│       ├── preferences/ [empty — index only]
│       ├── rules/ [empty — index only]
│       ├── glossary.md [key terms and definitions]
│       ├── index.md [wiki landing page linking all sections]
│       ├── last_updated.md [sync marker]
│       └── log.md [chronological update/changelog log]
├── docs/
│   ├── research_semantic_search/
│   │   └── research_report.md [research backing the search/RAG stack decision]
│   └── wiki/ [OKF knowledge wiki bundle]  (see below)
├── scripts/
│   ├── analyze-bookmarks.js [LLM analysis pass (z.ai GLM-5 → Railway Qwen fallback) → bookmark_analysis; LIMIT 100/run; imported from te9.dev 2026-11-06] (npm run analyze)
│   ├── backfill-archetypes.ts [deterministic multi-label archetype classifier → bookmark_archetypes; --missing for unclassified only]
│   ├── calibrate-floor.ts [rerank score-distribution calibration for RELEVANCE_FLOOR]
│   ├── crawl-bookmarks.js [Readability crawler → bookmark_content; LIMIT 100/run; imported from te9.dev 2026-11-06] (npm run crawl)
│   ├── diagnose-query.ts [trace a query + url-substring target through vec/text/RRF stages]
│   ├── embed-bookmarks.ts [resumable batched embedding backfill; --dry-run]
│   ├── insert-missing-repos-active-30d.sql [idempotent INSERT of the 522 active missing GitHub repos (synthetic negative ids); executed 2026-11-06]
│   ├── migrate.ts [applies a SQL migration file to DATABASE_URL]
│   ├── migration.sql [enable pgvector, create bookmark_embeddings (384-dim) + HNSW + GIN — original schema]
│   ├── migration-384.sql [original OpenAI/hf 384-dim variant, superseded by voyage-1024]
│   ├── migration-voyage-1024.sql [Voyage voyage-4-large 1024-dim embedding column + index]
│   ├── rollback-insert-missing-repos-active-30d.sql [undo for the insert above: deletes bookmark_id/id < 0 rows children-first, one transaction]
│   ├── sync-raindrop.js [Raindrop collection → te9_dev.bookmarks upsert-only mirror sync; imported from te9.dev 2026-11-06] (npm run sync)
│   └── verify-search.ts [end-to-end check that the conversational video-query returns MotionClone]
├── static/
│   ├── favicon.svg
│   └── mascot-product-search.png [transparent mascot cutout for the site-wide footer]
└── src/
    ├── app.css [Tailwind 4 import]
    ├── app.d.ts [SvelteKit app typings]
    ├── app.html [root HTML shell; Plausible analytics script wired here]
    ├── hooks.server.ts [content negotiation: ?view=llm from non-browser clients → raw text/markdown via lib/server/llms.ts]
    ├── lib/
    │   ├── components/
    │   │   ├── InfoTip.svelte [hover/focus tooltip; explains methodology + vital-signs labels on the homepage]
    │   │   ├── LlmDoc.svelte [renders ?view=llm markdown for humans (marked) with a raw .md link]
    │   │   ├── WaveLoader.svelte [CSS-only wave animation shown in the latency gauge while searching]
    │   │   └── wave-loader-demo.html [standalone demo harness for the WaveLoader (21st.dev symmetric-wave port); dev-only, not imported]
    │   └── server/
    │       ├── bookmark-text.ts [builds the one searchable text blob per bookmark]
    │       ├── db/
    │       │   └── index.ts [Drizzle/postgres-js client; reads process.env]
    │       ├── embeddings.ts [Voyage AI embedding client; default voyage-4-large 1024-dim; raw fetch, no SDK]
    │       ├── llms.ts [?view=llm core: wantsRawMarkdown(), corpusOverviewMd(), llmMarkdown() route router, mdResponse()]
    │       ├── llmview.ts [per-surface ?view=llm markdown builders (search / archive / collections) + usage preamble]
    │       ├── rerank.ts [Voyage rerank-2.5-lite cross-encoder re-scoring client; shares VOYAGE_API_KEY]
    │       ├── search.ts [single hybrid RRF SQL query: cosine + ts_rank]
    │       └── skill-doc.ts [SKILL_MD — LLM usage guide served at /skill.md; kept in sync with E:\skills.te9.dev\productsear.ch\SKILL.md]
    └── routes/
        ├── +layout.svelte [site-wide layout: slim nav (search · listings · collections) + llms-view toast + slim footer (mascot cutout + tagline), footer hidden on ?view=llm]
        ├── +page.server.ts [load: homepage search results; ?view=llm → markdown surfaces, corpus overview when no q]
        ├── +page.svelte [search UI; humans | llms dual-view tabs; WaveLoader in the latency gauge; InfoTip tooltips on methodology + vital-signs]
        ├── archive/
        │   ├── +page.server.ts [archive browser load + ?view=llm markdown]
        │   └── +page.svelte [chronological listings browser (display term "listings"; URL stays /archive)]
        ├── collections/
        │   ├── +page.server.ts [collections load + ?view=llm markdown]
        │   └── +page.svelte [browse listings by archetype]
        ├── compendium/
        │   ├── +page.server.ts [308 redirect → /collections (query string preserved)]
        │   └── [slug]/+page.server.ts [308 redirect → /collections/<slug>]
        ├── skill.md/
        │   └── +server.ts [GET /skill.md — raw LLM usage guide (SKILL_MD)]
        └── api/
            └── search/
                └── +server.ts [GET /api/search — hybrid RRF search + Voyage rerank]
└── .github/
    └── workflows/
        └── embed-new-bookmarks.yml [daily cron + manual dispatch: embeds new bookmarks]
