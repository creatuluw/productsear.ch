-- Enable pgvector extension (Railway managed Postgres supports it; run once).
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings table: one row per bookmark, resumable backfill via unique bookmark_id.
CREATE TABLE IF NOT EXISTS te9_dev.bookmark_embeddings (
	id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	bookmark_id integer NOT NULL UNIQUE,
	embedding vector(1536) NOT NULL,
	model text NOT NULL,
	embedded_at timestamptz NOT NULL DEFAULT now()
);

-- HNSW index for fast cosine similarity search. ivfflat also works for 2.3k rows,
-- but HNSW needs no training step and is the current pgvector default recommendation.
CREATE INDEX IF NOT EXISTS bookmark_embeddings_embedding_idx
	ON te9_dev.bookmark_embeddings
	USING hnsw (embedding vector_cosine_ops);

-- GIN index for full-text search over the searchable text column we maintain.
-- We store a generated tsvector in bookmark_search so we don't recompute per query.
ALTER TABLE te9_dev.bookmark_embeddings
	ADD COLUMN IF NOT EXISTS search_tsv tsvector;

CREATE INDEX IF NOT EXISTS bookmark_embeddings_search_tsv_idx
	ON te9_dev.bookmark_embeddings USING gin (search_tsv);
