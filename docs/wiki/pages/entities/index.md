# Entities

_Concrete named things will be listed here._

- [InfoTip component](./infotip-component.md) - `src/lib/components/InfoTip.svelte` — a lightweight hover/focus tooltip for homepage methodology terms and vital-signs metric labels
- [repo-scan pipeline](./repo-scan-pipeline.md) - repo-scan pipeline
- [LlmDoc component](./llmdoc-component.md) - `src/lib/components/LlmDoc.svelte` — the browser-facing renderer for llms views. Receives the server-built markdown string and renders it as a…
- [WaveLoader component](./waveloader-component.md) - A CSS-only animated loading indicator shown in the latency gauge box while a search runs; it swaps to the `{tookMs}ms` latency readout when the…
- [product-search mascot (illo character pack)](./product-search-mascot-illo-character-pack.md) - The official brand mascot for productsear.ch: **product-search**, a bookmark-ribbon character in the illo plugin's **riso** look — the ribbon that…
- [Archive page](./archive-page.md) - `/archive` — the chronological all-entries surface of productsear.ch, displayed as **"listings"** (URLs stay /archive). Newest-first by…
- [Collections pages](./compendium-pages.md) - `/collections` (index) and `/collections/[slug]` (group) — the archetype roll-up surface, formerly compendium (old paths 308-redirect). The index lists all **30 canonical archetypes** with live…
- [Bookmark archetype system](./bookmark-archetype-system.md) - The bookmark archetype system classifies every bookmark in the corpus into a curated set of **30 canonical archetypes** (AI Coding Agent, RAG &…
- [API ask endpoint](./api-ask-endpoint.md) - What is it?
- [Search diagnostics](./search-diagnostics.md) - Search-quality diagnostic tooling shipped with the 2026-11-01 rerank fix: a trace script for the retrieval stages, a debug env flag for the rerank…
- [Rerank service](./rerank-service.md) - `src/lib/server/rerank.ts` — a thin client for the Voyage `rerank-2.5-lite` cross-encoder rerank API.
- [API search endpoint](./api-search-endpoint.md) - What is it?
- [Embed-bookmarks backfill script](./embed-bookmarks-backfill-script.md) - What is it?
- [Daily embed-new-bookmarks workflow](./daily-embed-new-bookmarks-workflow.md) - `.github/workflows/embed-new-bookmarks.yml` — a GitHub Actions scheduled workflow that keeps the corpus enriched nightly. **Since 2026-11-06 it runs the full en
- [Corpus enrichment pipeline (sync/crawl/analyze)](./corpus-enrichment-pipeline-sync-crawl-analyze.md) - What is it?
- [Utobo sending-domain DNS records](./utobo-sending-domain-dns-records.md) - The four DNS records at GoDaddy that make productsear.ch a **verified sending domain on utobo** (utobo.com) — the email-sending infrastructure for the site. Wri
- [utobo Email (transactional email service)](./utobo-email-transactional-email-service.md) - **utobo Email** is the email service powering outbound (and optionally inbound) mail for productsear.ch — transactional, marketing, and sequences, built on AWS
- [utobo email platform](./utobo-email-platform.md) - utobo.com (**utobo Email**) — the external SaaS that provides productsear.ch's outbound email infrastructure: transactional email, newsletters, campaigns, and a
- [Admin console (/admin)](./admin-console-admin.md) - What it is
- [The Drum feed](./the-drum-feed.md) - **The Drum** is the official name (2026-11-06, brainstorm round 14) of productsear.ch's corpus-narrated magazine feed — a machine-drafted, human-gated stream of
