---
type: Learning
title: Production runs Railway commits only — local uncommitted work is invisible on the live site
description: "**Discovered 2026-11-06** when the user reported "I don't see an icon to log into the admin" on https://productsear.ch/:"
tags: [[deployment, railway, git, admin, production, debugging]]
timestamp: "2026-11-06T14:29:02.581Z"
---

# Production runs Railway commits only — local uncommitted work is invisible on the live site

**Discovered 2026-11-06** when the user reported "I don't see an icon to log into the admin" on https://productsear.ch/:

The admin console code, icon, and login flow were fully built and working locally — but **the work was never committed/pushed**, so Railway production was still serving the old build. Nothing was broken in the code.

**Symptom pattern:** a feature that exists in local dev but "doesn't exist" on production is a *deployment gap*, not a code bug. Before diagnosing any "missing on the live site" behavior:

1. `git status` / `git log` — is the work committed and pushed?
2. Check the Railway deployment state (latest deploy commit/`git SHA`, BUILDING vs SUCCESS) — the SUCCESS entry may predate the most recent push.
3. Check the service's env vars on Railway — new env vars (`ADMIN_EMAILS`, `ORIGIN`, `BETTER_AUTH_SECRET`, …) added locally during development must be mirrored on the Railway service or form-action CSRF and auth break in ways unrelated to the code.

**Also note:** concurrent sessions keep in-flight changes in this repo's tree — commit with strict pathspecs excluding others' work (see the check-index rule), then poll the deployment to SUCCESS before verifying production behavior.
