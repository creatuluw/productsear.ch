-- rollback-migration-admin.sql — undo for scripts/migration-admin.sql.
-- Children first (FK targets last). CASCADE drops dependents defensively.
BEGIN;
DROP TABLE IF EXISTS te9_dev.auth_session CASCADE;
DROP TABLE IF EXISTS te9_dev.auth_account CASCADE;
DROP TABLE IF EXISTS te9_dev.auth_verification CASCADE;
DROP TABLE IF EXISTS te9_dev.auth_user CASCADE;
DROP TABLE IF EXISTS te9_dev.admin_extensions CASCADE;
DROP TABLE IF EXISTS te9_dev.admin_agents CASCADE;
DROP TABLE IF EXISTS te9_dev.admin_features CASCADE;
DROP TABLE IF EXISTS te9_dev.admin_settings CASCADE;
COMMIT;
