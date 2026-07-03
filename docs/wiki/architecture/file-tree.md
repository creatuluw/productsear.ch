---
type: Artifact
title: File tree
description: Complete project file listing with per-file descriptions.
timestamp: "2026-07-03T13:25:27.632Z"
---

# File tree — generated 2026-07-03
# Excludes .git, node_modules, .svelte-kit, build, .pi, .work, .agents.
# [description] — shorthand summary of each file's function

.
├── .env [local env, gitignored — OPENAI_API_KEY + DATABASE_URL]
├── .env.example [committed env template with sk-REPLACE_ME]
├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.js [flat config: typescript-eslint + eslint-plugin-svelte]
├── package.json [SvelteKit 2 + adapter-node + Drizzle + ai SDK + Tailwind 4]
├── package-lock.json
├── svelte.config.js [adapter-node]
├── tsconfig.json [TS strict]
├── vite.config.ts [sveltekit() plugin from @sveltejs/kit/vite + Tailwind 4]
├── docs/ [project documentation]
│   └── wiki/ [OKF knowledge wiki bundle]
│       ├── architecture/ [architectural artifacts (diagrams, file maps)]
│       │   └── file-tree.md [this file — complete project listing]
│       ├── decisions/ [Architecture Decision Records (ADRs)]
│       │   ├── hybrid-semantic-search-stack-pgvector-tsvector-with-rrf-fusi.md [core search/RAG stack choice]
│       │   └── index.md
│       ├── learnings/ [captured insights and non-obvious facts]
│       │   ├── env-dynamic-private-breaks-under-plain-tsx-use-process-env-i.md [$env/dynamic/private + tsx gotcha]
│       │   ├── postgres-js-db-execute-returns-rows-directly-not-rows.md [db.execute shape gotcha]
│       │   ├── vercel-ai-sdk-v4-streamtext-exposes-async-textstream-not-tor.md [streamText surface gotcha]
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
├── research_semantic_search/
│   └── research_report.md [research backing the search/RAG stack decision]
├── scripts/
│   ├── embed-bookmarks.ts [resumable batched embedding backfill; --dry-run]
│   ├── migrate.ts [applies SQL migration]
│   └── migration.sql [enable pgvector, create bookmark_embeddings + HNSW + GIN]
└── src/
    ├── app.css [Tailwind 4 import]
    ├── app.d.ts [SvelteKit app typings]
    ├── app.html [root HTML shell]
    ├── lib/
    │   └── server/
    │       ├── bookmark-text.ts [builds the one searchable text blob per bookmark]
    │       ├── db/
    │       │   └── index.ts [Drizzle/postgres-js client; reads process.env]
    │       ├── embeddings.ts [OpenAI text-embedding-3-small client; reads process.env]
    │       ├── rag.ts [retrieval + prompt + streaming answer via AI SDK streamText]
    │       └── search.ts [single hybrid RRF SQL query: cosine + ts_rank]
    └── routes/
        ├── +layout.svelte
        ├── +page.svelte [search UI + Ask mode]
        └── api/
            ├── ask/
            │   └── +server.ts [GET /api/ask — streaming RAG]
            └── search/
                └── +server.ts [GET /api/search — hybrid RRF search]
