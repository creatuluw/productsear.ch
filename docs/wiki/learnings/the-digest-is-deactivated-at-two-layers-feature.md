---
type: Learning
title: The Digest is deactivated at two layers (feature gate + disabled cron); re-arm procedure documented
description: "**The state (2026-11-09):** The Digest is deliberately deactivated at BOTH control layers, so no email can go out:"
tags: [the-drum, digest, cron, github-actions, feature-flag, devops]
timestamp: "2026-11-09T15:26:58.723Z"
---

# The Digest is deactivated at two layers (feature gate + disabled cron); re-arm procedure documented

**The state (2026-11-09):** The Digest is deliberately deactivated at BOTH control layers, so no email can go out:

1. **Feature gate** — `feed_settings.digest_enabled = false` (it ships dark by default): 0 subscribers, never sent. Even if the cron ran, the send would stop at the gates (see [[learnings/the-digest-send-pipeline-verifies-in-stages-no-active-subscr]] for the expected stop messages).
2. **Cron** — the Monday 10:07 UTC workflow `.github/workflows/digest-send.yml` was disabled on GitHub via `gh workflow disable digest-send.yml` → state `disabled_manually`. The workflow won't even run to stop at the gates (keeps the Actions history clean of confusing "expected stop" runs).

**What stays live:** the drum draw cron is untouched; the `/feed` subscribe form still works — new addresses simply accumulate in `digest_subscribers` and will receive the first send once re-armed.

**Re-arm procedure (reversible, "for now"):**
1. `gh workflow enable digest-send.yml` (or flip it back in the GitHub Actions tab)
2. Turn `digest_enabled` on in the admin console (`/admin/feed`)
3. Subscribers opt in via `/feed` — the next Monday run sends whatever the drum published since the `feed_settings.last_digest_sent_at` cursor

**Why two layers:** the feature gate alone already prevented sends; disabling the cron additionally avoids weekly scheduled runs whose only outcome is a gates-stop. If you find `digest-send.yml` in `disabled_manually` state, that is intentional — not a broken workflow.
