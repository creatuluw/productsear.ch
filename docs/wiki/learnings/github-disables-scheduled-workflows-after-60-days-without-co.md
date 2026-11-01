---
type: Learning
title: GitHub disables scheduled workflows after 60 days without commits — cron runs don't count
description: GitHub automatically disables scheduled workflows after **60 days with no commits** to the repository. Scheduled (cron) runs do **not** count as activity — only
tags: [github-actions, devops, scheduled-workflows, embed-bookmarks]
timestamp: "2026-10-27T08:48:13.904Z"
---

# GitHub disables scheduled workflows after 60 days without commits — cron runs don't count

GitHub automatically disables scheduled workflows after **60 days with no commits** to the repository. Scheduled (cron) runs do **not** count as activity — only commits do. So a workflow that runs green every night will still be disabled if the repo sees no pushes for 60 days.

Observed on 2026-10-14: the [[daily-embed-new-bookmarks-workflow]] (`Embed new bookmarks`) in creatuluw/productsear.ch was `disabled_inactivity` despite running daily. GitHub emails the repo owner a "Scheduled workflows are disabled automatically after 60 days of repository inactivity" notice.

## Recovery

1. Re-enable: `gh workflow enable "Embed new bookmarks"` (or via the Actions tab).
2. Verify with a manual dispatch: `gh workflow run` — confirmed completed/success in ~31s (run 40475851367).

## Gotcha

This **recurs**. Pushing a commit today does not permanently fix it — if the repo goes another 60+ days without commits, the workflow is disabled again. Mitigations: any periodic commit counts (even a README touch or an automated date-bump commit), or accept that re-enabling is a two-command fix when GitHub's email arrives.

Related: [[github-requires-workflow-scope-on-the-token-to-push-commits-]] (same workflow token gotcha family).
