---
type: Learning
title: "Utobo API key provisioning: dashboard path, shown once, Send-only scope"
description: "**The how-to (settled 2026-11-06 while wiring The Digest's sends):** the utobo API key for `UTOBO_EMAIL_API_KEY` is created in the **email.utobo.com** dashboard"
tags: [utobo, email, github-actions, secrets, the-digest, devops]
timestamp: "2026-11-06T20:48:03.037Z"
---

# Utobo API key provisioning: dashboard path, shown once, Send-only scope

**The how-to (settled 2026-11-06 while wiring The Digest's sends):** the utobo API key for `UTOBO_EMAIL_API_KEY` is created in the **email.utobo.com** dashboard → API keys (or Account → API keys), with **Send only** permission — the right scope for production sends.

Gotchas:

- The key is displayed **once** at creation (`ut_live_` + 64 chars) — copy it immediately; losing it means creating a new key.
- Store it as the GitHub repo secret `UTOBO_EMAIL_API_KEY` (github.com/creatuluw/productsear.ch → Settings → Secrets and variables → Actions), or via CLI: `gh secret set UTOBO_EMAIL_API_KEY --repo creatuluw/productsear.ch`.
- Also add the same key to local `.env` for manual runs (`npx tsx scripts/digest-send.ts --send`).
- `DATABASE_URL` is already set as a repo secret (the [[corpus-enrichment-pipeline-sync-crawl-analyze]] workflow uses it) — the utobo key is the **only new secret** the digest workflow needs.

After the secret lands: Actions → The Digest → Run workflow does an instant manual test; real sends still require the admin digest toggle on in `/admin/feed` plus at least one subscriber (see [[the-digest-email-digest-pipeline]]).
