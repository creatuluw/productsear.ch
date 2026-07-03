# Semantic Search + RAG over 2,300 Postgres Rows — Research Report

**Stack under evaluation:** SvelteKit 2 + TypeScript + Drizzle ORM on managed Postgres (Railway). Dataset ≈ 2,300 product rows.

## Recommendation Summary (TL;DR)

For ~2,300 rows the lazy answer is the right answer: **stay inside Postgres.** Do not add a dedicated vector DB (Pinecone/Qdrant/Weaviate) and do not add a search extension (ParadeDB `pg_search`) you would have to build from source on a managed host.

**Locked stack:**

| Layer | Choice | Why |
|---|---|---|
| Vector storage + ANN | **pgvector** on existing Postgres | Ships in managed Postgres; 2.3k rows fit a single exact/HNSW scan trivially. |
| Lexical search | **Native `tsvector` + `ts_rank`** | Core Postgres; no extension. |
| Hybrid | cosine (`<=>`) + `ts_rank` via **RRF** | ~30 lines of SQL, no infra. |
| Embeddings | **OpenAI `text-embedding-3-small`** (1536 or 512) | ~$0.02 to embed the whole corpus once; best hosted quality. |
| RAG + streaming | **Vercel AI SDK** (`ai` + `@ai-sdk/openai` + `@ai-sdk/svelte`) | First-class Svelte 5/SvelteKit streaming; one-line provider swap. |
| ORM query | **Drizzle** `vector` column + **raw `sql`** for the cosine predicate | Drizzle has no `<=>` operator; drop to `sql` for that one clause. |

**Why "no overkill":** 2,300 rows is small enough that **exact** nearest-neighbor (no ANN index) returns in single-digit ms. A separate vector DB adds a second datastore, sync logic, billing, and failure modes for zero perceptible benefit. ParadeDB BM25 needs a compiled Rust extension (`cargo-pgrx`) that managed hosts won't run — pure overhead when Postgres already has full-text search built in.

---

## 1. pgvector on Managed Postgres (Railway)

### Key facts

- **pgvector** is an open-source Postgres extension for vector similarity search. Current release **v0.8.x** (README pins `v0.8.4`). Enable once per database: `CREATE EXTENSION vector;`.
- Supports **exact and approximate** NN search; multiple distance operators; multiple vector types (`vector`, `halfvec`, `bit`, `sparsevec`).
- Operators: cosine **`<=>`**, L2 **`<->`**, inner product **`<#>`**, L1 **`<+>`**.
- By default pgvector does **exact** NN search with **perfect recall**. ANN (HNSW / IVFFlat) is an opt-in recall/speed trade.
- Index types: **HNSW** (better speed/recall, more memory, no training step) and **IVFFlat**. Cosine: `CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);`
- `vector` type supports **up to 2,000 dims** (1536 from `text-embedding-3-small` fits); `halfvec` up to 4,000.
- README states pgvector "comes preinstalled ... and many hosted providers" — managed Postgres (Railway, Supabase, Neon) ships it enabled or one-`CREATE EXTENSION` away.

### Fit for 2,300 rows vs a separate vector DB

At 2,300 rows the whole vector column (1536-dim × 2300 ≈ 3.5M floats ≈ ~14 MB) scans in **well under 10 ms with no index** (exact KNN). The threshold where ANN becomes necessary is commonly cited in the low tens-of-thousands and up; below that, brute-force exact search is both faster (no graph traversal) and perfectly accurate. A separate vector DB buys sharding/billion-scale latency this dataset will never reach, at the cost of dual-write sync, a second billing line, and another failure mode.

### Verdict

**Use pgvector.** For 2,300 rows: `CREATE EXTENSION vector;`, store `vector(1536)` (or 512), **skip the HNSW index** to start. Add it later only if queries ever feel slow (they won't). No separate vector DB.

### Citations

- [pgvector README](https://github.com/pgvector/pgvector) — `CREATE EXTENSION`, operators, exact vs ANN, HNSW/IVFFlat, dimension limits.
- [pgvector Indexing](https://github.com/pgvector/pgvector#indexing) — HNSW/IVFFlat, `vector_cosine_ops`.
- [npm pgvector](https://www.npmjs.com/package/pgvector) — v0.3.0, Node/Deno/Bun helpers.

---
## 2. Hybrid Search: Native `tsvector` vs ParadeDB `pg_search` (BM25)

### Key facts

- **Postgres full-text search is core Postgres**: `tsvector`, `tsquery`, `to_tsvector()`, `ts_rank()` / `ts_rank_cd()`, and GIN indexes (`USING gin(to_tsvector(...))`). No extension needed.
- **Hybrid retrieval** fuses lexical (`ts_rank`) + semantic (cosine). Simplest robust fusion is **Reciprocal Rank Fusion (RRF)**: `score = Σ 1/(k + rank_i)` — needs no score normalization. Implementable in plain SQL with `UNION`/window functions over two ranked subqueries.
- **ParadeDB `pg_search`** is a Rust extension (BM25) built on `pgrx`. README confirms it requires **Rust + `cargo-pgrx` 0.18.1** and builds against a managed `~/.pgrx` Postgres. On a managed host like Railway you generally **cannot install custom compiled extensions** — only what the provider ships. BM25 vs `ts_rank` is marginal at small scale.

### Comparison

| Aspect | Native `tsvector` | ParadeDB `pg_search` |
|---|---|---|
| Install friction | None (core) | High (Rust + pgrx; blocked on managed hosts) |
| BM25 scoring | No (ts_rank is different) | Yes |
| Quality diff @ 2.3k rows | Imperceptible | Imperceptible |
| Operator | `@@ tsquery`, `ts_rank()` | `@@@` BM25 |

### Verdict

**Native `tsvector` + `ts_rank` + GIN index, fused with cosine via RRF.** ParadeDB is overkill: BM25 advantage only matters at search-scale corpora, and its install model fights managed Postgres.

### Citations

- [ParadeDB pg_search README](https://github.com/paradedb/paradedb/tree/dev/pg_search) — Rust + `cargo-pgrx 0.18.1`, PG15+.
- [ParadeDB docs](https://docs.paradedb.com) — install/deploy/usage.
- [PostgreSQL Full Text Search](https://www.postgresql.org/docs/current/textsearch.html) — tsvector/tsquery/ts_rank/GIN.
- [Drizzle: PostgreSQL Full-Text Search](https://orm.drizzle.team/docs/guides/postgresql-full-text-search) — confirmed in Drizzle docs nav.

---
## 3. Embeddings: model choice, dimensions, cost

### Key facts (verified from OpenAI docs)

- **`text-embedding-3-small`**: default **1536 dims**, max input **8192 tokens**, MTEB **62.3%**, ~**62,500 pages per dollar** (~$0.02 / 1M tokens).
- **`text-embedding-3-large`**: 3072 dims, MTEB 64.6%, ~9,615 pages/dollar (~$0.13 / 1M tokens).
- Both v3 models support a **`dimensions`** param to shorten embeddings with minimal quality loss (3-large @ 256 dims still beats ada-002 @ 1536).
- **Cost for 2,300 docs:** ~500 tokens/doc avg → ~1.15M tokens → **≈ $0.023 one-time** with `text-embedding-3-small`. Effectively free; re-embedding edits is cents-per-thousand.

### Alternatives

| Model | Dims | Host | Notes |
|---|---|---|---|
| OpenAI `text-embedding-3-small` | 1536 (shortable) | API | Best quality/price; trivial via `@ai-sdk/openai` |
| Voyage `voyage-3` | 1024 | API | Strong retrieval; separate SDK/billing |
| Cohere `embed-english-v3` | 1024 | API | Good multilingual; separate SDK/billing |
| `@xenova/transformers` / `@huggingface/transformers` (`bge-small-en`) | 384–768 | **local** | Free/offline; v3 pkg is `@huggingface/transformers` v4.x; below v3-small quality |

### Verdict

**OpenAI `text-embedding-3-small` at 1536** (optionally shortened to **512** to halve storage with negligible recall loss — `vector(512)` makes scans cheaper). Corpus cost is a few cents, so pick on quality. Local transformers.js is only worth it if you must avoid the OpenAI dependency or run offline.

### Citations

- [OpenAI Embeddings guide](https://platform.openai.com/docs/guides/embeddings) — v3-small/large, 1536/3072, `dimensions` param, pages-per-dollar, MTEB.
- [OpenAI Pricing](https://platform.openai.com/docs/pricing) — per-1M-token rates.
- [npm @xenova/transformers](https://www.npmjs.com/package/@xenova/transformers) v2.17.2; [npm @huggingface/transformers](https://www.npmjs.com/package/@huggingface/transformers) v4.2.0.

---
## 4. RAG + Streaming in SvelteKit with the Vercel AI SDK

### Key facts (verified current versions, July 2026)

| Package | Version | Purpose |
|---|---|---|
| `ai` | **7.0.14** | Core: `streamText`, stream helpers, message types |
| `@ai-sdk/openai` | **4.0.7** | OpenAI provider (`openai(...)`, `embed`/`embedMany`) |
| `@ai-sdk/svelte` | **5.0.14** | Svelte 5 bindings — `Chat` class + reactive state |

- **Server (`+server.ts`):** run hybrid retrieval (Section 2), build prompt (system + retrieved chunks + user question) into `messages`, then `streamText({ model, messages })` and return via `createUIMessageStreamResponse(...)` (AI SDK v7).
- **Client (Svelte 5 `+page.svelte`):** use the `@ai-sdk/svelte` `Chat` object (Svelte 5 equivalent of React's `useChat`). API mirrors `useChat`; exposes reactive token state; binds to the `/api/chat` endpoint.
- `streamText` exposes `result.textStream` (async iterable) and helpers (`toTextStreamResponse()` / `toUIMessageStreamResponse()`) for non-`useChat` cases.
- The OpenAI provider also exposes `embed`/`embedMany` for the corpus embeddings — **one provider covers both embedding and RAG**.
- **npmx.dev / npmjs.dev** both resolve (HTTP 200) and mirror npm registry metadata — package browsers, not separate SDKs. Confirm versions there if desired; install from npm.

### RAG flow

1. Client → `/api/chat` with the user query.
2. Server: `embed(query)` → Drizzle raw-SQL hybrid (cosine `<=>` + `ts_rank`, RRF) → top-k chunks.
3. Server: build prompt → `streamText({ model: openai('gpt-...'), messages })`.
4. Return `createUIMessageStreamResponse(...)`; Svelte 5 `Chat` renders tokens live.

### Verdict

**Use the Vercel AI SDK.** Only solution with first-class SvelteKit streaming, typed messages, and a provider abstraction (swap OpenAI ↔ Anthropic ↔ local without touching retrieval). Hand-rolling SSE reinvents what the SDK already does correctly (abort, tool calls, partial JSON, error recovery).

### Citations

- [AI SDK streamText reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) — `streamText`, `textStream`, response helpers.
- [AI SDK SvelteKit getting started](https://ai-sdk.dev/docs/getting-started/svelte) — `+server.ts` with `streamText` + `createUIMessageStreamResponse`, Svelte `Chat`.
- [AI SDK streaming foundations](https://ai-sdk.dev/docs/foundations/streaming).
- [npm ai](https://www.npmjs.com/package/ai) v7.0.14; [npm @ai-sdk/openai](https://www.npmjs.com/package/@ai-sdk/openai) v4.0.7; [npm @ai-sdk/svelte](https://www.npmjs.com/package/@ai-sdk/svelte) v5.0.14.
- [npmx.dev](https://npmx.dev) / [npmjs.dev](https://npmjs.dev) — npm browsers (HTTP 200).

---
## 5. Drizzle ORM + pgvector: column type and cosine query

### Key facts

- Drizzle ships a **native `vector` column type** for Postgres (`drizzle-orm/pg-core`): `vector({ dimensions: 1536 })`, used in schema + migrations like any column. Current `drizzle-orm`: **0.45.x**.
- Drizzle has an official **Vector Similarity Search** guide (`/docs/guides/vector-similarity-search`) and **PostgreSQL Full-Text Search** guide — both confirmed in the docs nav.
- Drizzle has **no first-class `<=>` operator** in its query builder. Documented pattern: drop to **raw `sql`** for the similarity predicate.

```ts
import { sql } from 'drizzle-orm'

// k nearest neighbors by cosine distance (smaller <=> = more similar)
const rows = await db.execute(sql`
  SELECT id, name,
         embedding <=> ${sql.raw(`'${queryVecJson}'`)} AS distance
  FROM products
  ORDER BY embedding <=> ${sql.raw(`'${queryVecJson}'`)}
  LIMIT 20
`)
```

- Hybrid (cosine + FTS, RRF) is also plain `sql` — Drizzle's typed builder is the wrong tool for window/UNION rank fusion. Keep the whole retrieval in one raw SQL block and parse rows on the way out.

### Verdict

**Drizzle `vector` column for schema/migrations; raw `sql` for the cosine predicate and the RRF fusion query.** This is the documented approach, not a workaround — Drizzle intentionally hands you `sql` for vendor-specific operators.

### Citations

- [Drizzle Vector Similarity Search](https://orm.drizzle.team/docs/guides/vector-similarity-search).
- [Drizzle PG column types](https://orm.drizzle.team/docs/column-types/pg) — incl. `vector`.
- [Drizzle PostgreSQL Full-Text Search](https://orm.drizzle.team/docs/guides/postgresql-full-text-search).
- [npm drizzle-orm](https://www.npmjs.com/package/drizzle-orm) v0.45.2.

---

## Locked Stack Decision

For **semantic search + RAG over ~2,300 product rows** on SvelteKit 2 + Drizzle + managed Postgres:

1. **pgvector** — `CREATE EXTENSION vector`, `vector(1536)` column, **no HNSW index** initially (exact KNN is sub-10ms at this size).
2. **Hybrid = pgvector cosine `<=>` + native `tsvector`/`ts_rank`**, fused by **RRF** in one raw-SQL query.
3. **OpenAI `text-embedding-3-small`** at 1536 (optionally 512) for embeddings + RAG generation — corpus cost ≈ $0.02.
4. **Vercel AI SDK** — `ai` + `@ai-sdk/openai` + `@ai-sdk/svelte` — `streamText` in a `+server.ts` returning `createUIMessageStreamResponse(...)`, consumed by the Svelte 5 `Chat` binding.
5. **Drizzle** `vector` column for schema; **raw `sql`** for the cosine predicate and the RRF hybrid query.

### Why this is "no overkill" for 2.3k rows

- **No separate vector DB** (Pinecone/Qdrant/Weaviate): 1–2 MB of vectors; exact scan is faster than graph traversal and needs no second datastore/sync/billing.
- **No ParadeDB `pg_search`**: BM25 vs `ts_rank` indistinguishable at this scale, and `pg_search` needs Rust/`pgrx` compilation managed Postgres won't allow.
- **No ANN index to start**: exact KNN = perfect recall, sub-10ms; add HNSW only if future growth demands it.
- **No custom streaming layer**: the AI SDK handles SSE/abort/tool-calls/partial-JSON for SvelteKit already.
- **Total new infra added: zero.** Everything runs on the Postgres you already have + the OpenAI key you'd need anyway.

**Upgrade triggers** (only if hit later): row count past ~50k → add `HNSW` + `vector_cosine_ops`; recall plateau → revisit ParadeDB BM25; want model independence → AI SDK provider layer makes it a one-line swap.
