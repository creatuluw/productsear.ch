-- ROLLBACK for insert-missing-repos-active-30d.sql
-- Removes ALL rows created by the 2026-11-06 ingestion of the 522 still-active
-- missing GitHub repos, including every derived row (embeddings, archetypes, and
-- any content/analysis rows the external pipelines may have added since).
--
-- Scope: negative synthetic ids only (id = raindrop_id = -1 … -522). The external
-- Raindrop→DB sync only ever writes positive ids, so `id < 0` / `bookmark_id < 0`
-- is a precise, collision-proof scope — real bookmarks are never touched.
--
-- Run order: children first, then the parent. Wrapped in one transaction so it
-- either fully rolls back or does nothing.
--
-- Verify BEFORE running:  SELECT count(*) FROM te9_dev.bookmarks WHERE id < 0;  -- expect 522
-- Verify AFTER running:   SELECT count(*) FROM te9_dev.bookmarks WHERE id < 0;  -- expect 0

BEGIN;

DELETE FROM te9_dev.bookmark_archetypes WHERE bookmark_id < 0;
DELETE FROM te9_dev.bookmark_embeddings   WHERE bookmark_id < 0;
DELETE FROM te9_dev.bookmark_content      WHERE bookmark_id < 0;
DELETE FROM te9_dev.bookmark_analysis     WHERE bookmark_id < 0;
DELETE FROM te9_dev.bookmarks             WHERE id < 0;

COMMIT;
