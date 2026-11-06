---
type: Learning
title: adapter-node requires ORIGIN env var for CSRF protection
description: When deploying SvelteKit with `@sveltejs/adapter-node`, requests with a mismatched `Host`/`Origin` header are rejected unless the `ORIGIN` environment variable 
timestamp: "2026-07-04T11:10:17.109Z"
---

# adapter-node requires ORIGIN env var for CSRF protection

When deploying SvelteKit with `@sveltejs/adapter-node`, requests with a mismatched `Host`/`Origin` header are rejected unless the `ORIGIN` environment variable is set to the app's public URL (e.g. `https://<app>.up.railway.app`).

**Symptom**: `403 Cross-site POST form submissions forbidden` (or similar) on form actions and POST endpoints in production.

**Fix**: Set `ORIGIN` on the host (Railway dashboard env vars). `PORT` is provided automatically by Railway — do not hardcode it.

This bit us on Railway after the first successful deploy of the productsear.ch SvelteKit app. The build/start phases worked, but POST requests failed until `ORIGIN` was configured.
