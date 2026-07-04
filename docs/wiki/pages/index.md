# Pages

Knowledge graph: concepts, entities, and artifacts that make up this project.

- [Concepts](./concepts/) — Abstract ideas, definitions, and categories
- [Entities](./entities/) — Concrete named things, systems, tools, and records
- [Artifacts](./artifacts/) — Documents, diagrams, code files, and deliverables
- [Hybrid search via Reciprocal Rank Fusion](./concepts/hybrid-search-via-reciprocal-rank-fusion.md) — What is it?
- [Embed-bookmarks backfill script](./entities/embed-bookmarks-backfill-script.md) — What is it?
- [agentos-sdk.dev design system extraction](./artifacts/agentos-sdk-dev-design-system-extraction.md) — Reference design system reverse-engineered from https://agentos-sdk.dev/, to be replicated on productsear.ch. Captures exact color tokens, typography, signature
- [Rerank service](./entities/rerank-service.md) — `src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.
- [Daily embed-new-bookmarks workflow](./entities/daily-embed-new-bookmarks-workflow.md) — `.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that runs the [[embed-bookmarks-backfill-script]] nightly to embed only newly-
