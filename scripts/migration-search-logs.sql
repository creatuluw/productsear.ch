-- Search analytics — one row per executed search, append-only.
-- Covers every search surface: the site's own UI (source 'web'), external
-- API/agent callers of GET /api/search (source 'api'), and the homepage
-- ?view=llm machine twin (source 'llm').
-- Raw queries are stored for the owner's analysis only; public surfaces
-- (The Floor) keep publishing aggregated themes, never raw queries.

CREATE TABLE IF NOT EXISTS te9_dev.search_logs (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	query text NOT NULL,
	source text NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'api', 'llm')),
	results integer NOT NULL DEFAULT 0,
	took_ms integer,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS search_logs_created_idx ON te9_dev.search_logs (created_at DESC);
