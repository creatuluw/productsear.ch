-- The Digest — drum email edition (spec slice E, dark by default).
-- digest_subscribers — reader emails with per-reader unsubscribe tokens.
-- feed_settings.last_digest_sent_at — send window cursor (items published
-- since this timestamp make up the next digest).

CREATE TABLE IF NOT EXISTS te9_dev.digest_subscribers (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	email text NOT NULL UNIQUE,
	token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
	unsubscribed_at timestamptz,
	created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE te9_dev.feed_settings
	ADD COLUMN IF NOT EXISTS last_digest_sent_at timestamptz;
