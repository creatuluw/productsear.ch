---
type: Learning
title: Await dotenv imports; anchor .env path
description: "Two failures when `missing-repos.js` (a plain Node script in `.archive/repo-scan/`) loaded `DATABASE_URL`, discovered 2026-11-06:"
tags: [dotenv, env, node-scripts, gotcha, archive-scripts]
timestamp: "2026-11-06T09:00:28.198Z"
---

# Await dotenv imports; anchor .env path

Two failures when `missing-repos.js` (a plain Node script in `.archive/repo-scan/`) loaded `DATABASE_URL`, discovered 2026-11-06:

1. **Race**: a dynamic `await import('dotenv')` must complete before any `process.env.DATABASE_URL` read — reading env before the import resolves silently yields undefined.

2. **chdir breaks discovery**: `process.chdir('repo-scan')` before `dotenv.config()` makes dotenv look for `.env` in the new cwd, where there is none. Anchor the path explicitly: `dotenv.config({ path: path.resolve(import.meta.dirname, '../../.env') })`.

Related but distinct: [[env-dynamic-private-breaks-under-plain-tsx-use]] covers `$env/dynamic/private` vs `process.env`; this covers dotenv *loading* in scripts that change cwd.
