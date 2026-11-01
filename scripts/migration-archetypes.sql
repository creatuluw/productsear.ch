-- App-owned archetype roll-up (source tables are read-only mirrors).
-- Multi-entry: archetypes is a jsonb array of archetype slugs, e.g.
--   ["agent-framework","oss-library"]
CREATE TABLE IF NOT EXISTS te9_dev.bookmark_archetypes (
	bookmark_id integer PRIMARY KEY REFERENCES te9_dev.bookmarks(id) ON DELETE CASCADE,
	archetypes jsonb NOT NULL DEFAULT '[]'::jsonb,
	classified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookmark_archetypes_gin ON te9_dev.bookmark_archetypes USING gin (archetypes);
