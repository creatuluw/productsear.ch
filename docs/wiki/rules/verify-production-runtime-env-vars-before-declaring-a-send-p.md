---
type: Rule
title: Verify production runtime env vars before declaring a send pipeline armed
description: "**Guideline:** Before declaring any external-send or API-integration pipeline operational (utobo email, Drum approval mails, The Digest sends, Voyage, chat prov"
tags: [true]
timestamp: "2026-11-12T17:01:27.850Z"
---

# Verify production runtime env vars before declaring a send pipeline armed

**Guideline:** Before declaring any external-send or API-integration pipeline operational (utobo email, Drum approval mails, The Digest sends, Voyage, chat providers), verify the required env vars exist in the **actual production runtime** (Railway: `railway variables`), not just in the local `.env` or GitHub Actions secrets.

**When it applies:** arming or changing any pipeline that calls an external SaaS at runtime from the Railway deployment — especially after wiring a new secret "everywhere".

**Rationale/evidence:** 2026-11-12 — the Drum approval email pipeline looked fully working because the first approval email arrived. It had been sent from the local machine's `.env`; the Railway runtime never had `UTOBO_EMAIL_API_KEY`, so every production click of "Generate new" silently hit the fail-soft path with no email. Same gap would have broken The Digest's real sends. See [[learnings/utobo-email-api-key-was-missing-from-the-railway-runtime-local-s]].

**Corollary:** a successful local send is evidence about your laptop, not about production. The three secret stores (local `.env`, GitHub Actions secrets, Railway runtime env) are independent copies — arming one does not arm the others.
