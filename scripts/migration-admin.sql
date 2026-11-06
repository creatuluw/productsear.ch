-- migration-admin.sql — admin subsystem tables for productsear.ch (2026-11-06).
-- Idempotent (IF NOT EXISTS everywhere + ON CONFLICT DO NOTHING seeds).
-- Dry-run first:  npx tsx scripts/run-sql.ts scripts/migration-admin.sql
-- Apply for real: npx tsx scripts/run-sql.ts scripts/migration-admin.sql --commit
-- Undo:           npx tsx scripts/run-sql.ts scripts/rollback-migration-admin.sql --commit
--
-- 1) better-auth tables (email+password). Model names user/session/account/
--    verification map via drizzleAdapter in src/lib/server/auth.ts.
-- 2) admin-panel content tables: extensions, agents, settings, feature flags.
-- 3) Seed flags/settings so the console (and getFlag/getSetting helpers) start
--    with meaningful rows. Seeds are descriptive defaults — toggling them in
--    /admin is the intended workflow.

-- ---------- better-auth ----------
CREATE TABLE IF NOT EXISTS te9_dev.auth_user (
	id text PRIMARY KEY,
	name text NOT NULL,
	email text NOT NULL UNIQUE,
	email_verified boolean NOT NULL DEFAULT false,
	image text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS te9_dev.auth_session (
	id text PRIMARY KEY,
	expires_at timestamptz NOT NULL,
	token text NOT NULL UNIQUE,
	ip_address text,
	user_agent text,
	user_id text NOT NULL REFERENCES te9_dev.auth_user(id) ON DELETE CASCADE,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS te9_dev.auth_account (
	id text PRIMARY KEY,
	account_id text,
	provider_id text NOT NULL,
	user_id text NOT NULL REFERENCES te9_dev.auth_user(id) ON DELETE CASCADE,
	access_token text,
	refresh_token text,
	id_token text,
	access_token_expires_at timestamptz,
	refresh_token_expires_at timestamptz,
	scope text,
	password text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS te9_dev.auth_verification (
	id text PRIMARY KEY,
	identifier text NOT NULL,
	value text NOT NULL,
	expires_at timestamptz NOT NULL,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- admin panel content ----------
CREATE TABLE IF NOT EXISTS te9_dev.admin_extensions (
	id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
	name text NOT NULL,
	slug text NOT NULL UNIQUE,
	description text,
	enabled boolean NOT NULL DEFAULT false,
	config jsonb NOT NULL DEFAULT '{}'::jsonb,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS te9_dev.admin_agents (
	id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
	name text NOT NULL,
	slug text NOT NULL UNIQUE,
	description text,
	system_prompt text NOT NULL DEFAULT '',
	model text,
	enabled boolean NOT NULL DEFAULT false,
	config jsonb NOT NULL DEFAULT '{}'::jsonb,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS te9_dev.admin_settings (
	key text PRIMARY KEY,
	value text NOT NULL,
	description text,
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS te9_dev.admin_features (
	key text PRIMARY KEY,
	label text NOT NULL,
	description text,
	enabled boolean NOT NULL DEFAULT false,
	updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- seeds ----------
INSERT INTO te9_dev.admin_features (key, label, description, enabled)
VALUES
	('search.rerank_enabled', 'Rerank search results', 'Voyage rerank-2.5-lite re-scoring on top of RRF hybrid search.', true),
	('llm_views_enabled', 'LLM (?view=llm) surfaces', 'Serves ?view=llm markdown readouts for LLM clients.', true),
	('ui.show_vital_signs', 'Show homepage vital signs', 'Displays the vital-signs gauge strip on the homepage.', true)
ON CONFLICT (key) DO NOTHING;

INSERT INTO te9_dev.admin_settings (key, value, description)
VALUES
	('site.tagline', 'A product and information catalog curated by Patrick Tehubijuluw', 'Footer tagline shown site-wide.'),
	('search.results_per_page', '30', 'Number of results the search pipeline returns after rerank.')
ON CONFLICT (key) DO NOTHING;
