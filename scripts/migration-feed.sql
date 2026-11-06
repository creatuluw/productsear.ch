-- The Drum — app-owned feed subsystem (source tables stay read-only mirrors).
-- feed_items    — one row per draw: a drafted/published feed post of a given type.
-- feed_settings — singleton settings row (cadence, round-robin order, toggles).
-- search_misses — raw queries that fell below the relevance floor (total=0), for
--                 The Floor. Append-only; only aggregated themes ever get
--                 published, never raw queries.

CREATE TABLE IF NOT EXISTS te9_dev.feed_items (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	type text NOT NULL,
	listing_id integer, -- te9_dev.bookmarks.id, no FK: the mirror is externally managed and feed history must outlive it
	body jsonb NOT NULL DEFAULT '{}'::jsonb,
	status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
	requires_approval boolean NOT NULL DEFAULT false,
	published_at timestamptz,
	signals jsonb NOT NULL DEFAULT '{}'::jsonb,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feed_items_published_idx ON te9_dev.feed_items (published_at DESC);
CREATE INDEX IF NOT EXISTS feed_items_listing_idx ON te9_dev.feed_items (listing_id);

-- Singleton settings row (primary key is literally true — exactly one row exists).
CREATE TABLE IF NOT EXISTS te9_dev.feed_settings (
	id boolean PRIMARY KEY DEFAULT true CHECK (id),
	cadence_hours integer NOT NULL DEFAULT 48 CHECK (cadence_hours >= 1),
	digest_enabled boolean NOT NULL DEFAULT false,
	type_order jsonb NOT NULL DEFAULT '[]'::jsonb,
	updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO te9_dev.feed_settings (id, type_order)
VALUES (true, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS te9_dev.search_misses (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	query text NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS search_misses_created_idx ON te9_dev.search_misses (created_at DESC);
