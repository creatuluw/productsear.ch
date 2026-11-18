---
type: Learning
title: UTOBO_EMAIL_API_KEY was missing from the Railway runtime — local-send success masked the prod gap
description: "**The incident (2026-11-12, "Generate new produced no new approval email"):** The Drum approval send failed silently in production — Railway logs showed `[feed]"
tags: [true]
timestamp: "2026-11-12T17:01:27.848Z"
---

# UTOBO_EMAIL_API_KEY was missing from the Railway runtime — local-send success masked the prod gap

**The incident (2026-11-12, "Generate new produced no new approval email"):** The Drum approval send failed silently in production — Railway logs showed `[feed] approval NOT sent: UTOBO_EMAIL_API_KEY is not configured`.

Root cause: `UTOBO_EMAIL_API_KEY` existed in **GitHub Actions secrets and the local `.env`, but never in the Railway runtime**. The first approval email "worked" only because it was sent from the local machine's `.env` — that success masked the production gap and made the pipeline look operational when it wasn't.

Key facts about the failure mode:

- **Fail-soft path worked as designed**: the click DID work — old draft was deleted, a new one was drawn — only the email step failed; the drawn card sat safely as a draft and the failure was logged. Recovery = re-mail the approval for the existing draft (no redraw needed).
- **Collateral discovery**: The Digest's real sends would have failed for the same reason; setting the key in Railway unblocked both surfaces at once.
- **Fix pattern**: set the var in Railway (`railway variables set ...`, which triggers a redeploy), then re-trigger the mail for the existing draft rather than redrawing.
- Different surfaces hold different copies of secrets: **GitHub Secrets ≠ Railway runtime env ≠ local `.env`** — presence in one says nothing about the others.

Evidence: Railway deploy logs + the re-sent approval email verified live (2026-11-12). See [[rules/verify-production-runtime-env-vars-before-declaring-a-send-pipeline-armed]] and [[learnings/the-digest-send-pipeline-verifies-in-stages-no-active-subscr]].
