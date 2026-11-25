---
type: Learning
title: The Digest send pipeline verifies in stages — "no active subscribers" is the expected stop when armed but empty
description: "**The behavior (verified 2026-11-06 after the operator added the utobo secrets):** `scripts/digest-send.ts` gates its send path in stages, and the *failure poin"
tags: [the-drum, digest, utobo, verification, devops, secrets]
timestamp: "2026-11-06T20:50:19.673Z"
---

# The Digest send pipeline verifies in stages — "no active subscribers" is the expected stop when armed but empty

**The behavior (verified 2026-11-06 after the operator added the utobo secrets):** `scripts/digest-send.ts` gates its send path in stages, and the *failure point* is the proof of progress:

- **"key not configured"** — `UTOBO_EMAIL_API_KEY` missing/invalid; the pipeline dies at the utobo auth stage.
- **"no active subscribers"** — the key **passed** auth; the pipeline is armed and stops only because `te9_dev.digest_subscribers` has no active rows (expected normal state until readers sign up via the `/feed` form).

**The working method:** when arming an external-service integration, don't just check that the secret exists in `.env`/GitHub secrets — walk the pipeline stage-by-stage: `--dry` first (proves the template renders and the key is *read*), then a real force-send and observe **which gate it stops at**. A *changed* failure message is evidence the previous stage passed, even though the run "failed". For The Digest, "no active subscribers" after a force-send is the success signal for the credential, not an error.

At verification time the remaining operator steps were: flip `digest_enabled` in `/admin/feed` settings, and let subscribers accumulate — first automatic send fires Monday 10:07 UTC (cron) or instantly via the admin "send digest now" button. See [[pages/entities/the-digest-email-digest-pipeline]].
