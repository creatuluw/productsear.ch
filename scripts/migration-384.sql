-- Rebuild embeddings table at 384 dim (local all-MiniLM-L6-v2 model).
-- Safe to drop: table is app-owned and currently empty; backfill repopulates it.
DROP TABLE IF EXISTS te9_dev.bookmark_embeddings;

CREATE TABLE te9_dev.bookmark_embeddings (
	id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	bookmark_id integer NOT NULL UNIQUE,
	embedding vector(384) NOT NULL,
	search_tsv tsvector,
	model text NOT NULL,
	embedded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX bookmark_embeddings_embedding_idx
	ON te9_dev.bookmark_embeddings USING hnsw (embedding vector_cosine_ops);

CREATE INDEX bookmark_embeddings_search_tsv_idx
	ON te9_dev.bookmark_embeddings USING gin (search_tsv);
