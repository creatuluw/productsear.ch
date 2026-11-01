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
- [productsear.ch promo video](./artifacts/productsear-ch-promo-video.md) — An animated ~6-scene promo MP4 that introduces productsear.ch: semantic bookmark search via hybrid retrieval ([[hybrid-search-via-reciprocal-rank-fusion]]) plus
- [URL-driven search state](./concepts/url-driven-search-state.md) — What is it?
- [Search diagnostics](./entities/search-diagnostics.md) — Search-quality diagnostic tooling shipped with the 2026-11-01 rerank fix: a trace script for the retrieval stages, a debug env flag for the rerank stage, and a
- [host0.ai and clawrun.sh design references](./artifacts/host0-ai-and-clawrun-sh-design-references.md) — Two live sites the user endorsed ("i like") as aesthetic north stars for the upcoming site redesign: https://host0.ai/ and https://clawrun.sh/. Both were fetche
- [API ask endpoint](./entities/api-ask-endpoint.md) — What is it?
- [Impeccable pattern one-pager (P3)](./artifacts/impeccable-pattern-one-pager-p3.md) — The **pattern one-pager** is the P3 gate deliverable of the impeccable design-studio redesign: a single self-contained HTML page showing the "80% base" layout f
- [Impeccable design brief (P4)](./artifacts/impeccable-design-brief-p4.md) — The **design brief** is the P4 gate deliverable of the impeccable design-studio redesign: the self-sufficient handover spec from which the approved design gets
- [Bookmark archetype system](./entities/bookmark-archetype-system.md) — The bookmark archetype system classifies every bookmark in the corpus into a curated set of **30 canonical archetypes** (AI Coding Agent, RAG & Search, Open Sou
- [Compendium pages](./entities/compendium-pages.md) — `/compendium` (index) and `/compendium/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; each g
- [LlmDoc component](./entities/llmdoc-component.md) — `src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as styled GFM, replaci
- [product-search mascot (illo character pack)](./entities/product-search-mascot-illo-character-pack.md) — The official brand mascot for productsear.ch: **product-search**, a bookmark-ribbon character in the illo plugin's **riso** look — the ribbon that has already f
- [WaveLoader component](./entities/waveloader-component.md) — A CSS-only animated loading indicator shown in the latency gauge box while a search runs; it swaps to the `{tookMs}ms` latency readout when the search completes
