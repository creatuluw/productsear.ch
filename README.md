# productsear.ch — semantic bookmark search

A SvelteKit app providing blazing-fast semantic search and RAG "ask" over a Raindrop-backed bookmark corpus stored in PostgreSQL (`te9_dev` schema), using `pgvector` for embeddings and Postgres full-text for hybrid retrieval.

## Stack

- **SvelteKit 2** + adapter-node + TypeScript (strict)
- **Tailwind CSS 4**
- **Drizzle ORM** over managed Postgres (Railway)
- **pgvector** for semantic embeddings + native `tsvector` for keyword/hybrid search
- **OpenAI** `text-embedding-3-small` (embeddings) + chat model (RAG)
- **Vercel `ai` SDK** (`ai` + `@ai-sdk/openai`) for streaming answers

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL + OPENAI_API_KEY
npm run embed          # one-shot backfill of embeddings (resumable)
npm run dev            # http://localhost:5173
```

## Usage

- `/` — search UI. Type a query → ranked hybrid results.
- **Ask mode** — toggle to switch from "ranked results" to "LLM synthesis with citations".
- `GET /api/search?q=...` — JSON ranked results.
- `POST /api/ask` — `{ "q": "..." }` → streamed RAG answer.

See `research_semantic_search/research_report.md` for the stack rationale.
