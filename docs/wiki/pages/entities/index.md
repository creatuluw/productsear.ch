# Entities

_Concrete named things will be listed here._
fill-script.md) - What is it?
- [Rerank service](./rerank-service.md) - `src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.
- [Daily embed-new-bookmarks workflow](./daily-embed-new-bookmarks-workflow.md) - `.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that runs the [[embed-bookmarks-backfill-script]] nightly to embed only newly-
- [Search diagnostics](./search-diagnostics.md) - Search-quality diagnostic tooling shipped with the 2026-11-01 rerank fix: a trace script for the retrieval stages, a debug env flag for the rerank stage, and a
- [API ask endpoint](./api-ask-endpoint.md) - What is it?
- [Bookmark archetype system](./bookmark-archetype-system.md) - The bookmark archetype system classifies every bookmark in the corpus into a curated set of **30 canonical archetypes** (AI Coding Agent, RAG & Search, Open Sou
- [Compendium pages](./compendium-pages.md) - `/compendium` (index) and `/compendium/[slug]` (group) — the archetype roll-up surface. The index lists all **30 canonical archetypes** with live counts; each g
