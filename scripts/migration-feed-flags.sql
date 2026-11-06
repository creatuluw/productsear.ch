-- The Drum feature flags — admin toggles for the feed's site-wide surfaces.
-- nav_enabled              — show/hide the feed link in the site nav
-- homepage_cards_enabled   — show/hide the "latest from the drum" block on the homepage

ALTER TABLE te9_dev.feed_settings
	ADD COLUMN IF NOT EXISTS nav_enabled boolean NOT NULL DEFAULT true,
	ADD COLUMN IF NOT EXISTS homepage_cards_enabled boolean NOT NULL DEFAULT true;
