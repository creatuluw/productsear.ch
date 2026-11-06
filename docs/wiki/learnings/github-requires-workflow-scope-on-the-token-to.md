---
type: Learning
title: GitHub requires `workflow` scope on the token to push commits touching `.github/workflows/`
description: "A token with only `repo` (and `gist`, `read:org`) scopes cannot push a commit that modifies any file under `.github/workflows/`. GitHub rejects the push with a "
tags: [github, ci, devops, workflows, git]
timestamp: "2026-07-04T10:59:54.366Z"
---

# GitHub requires `workflow` scope on the token to push commits touching `.github/workflows/`

A token with only `repo` (and `gist`, `read:org`) scopes cannot push a commit that modifies any file under `.github/workflows/`. GitHub rejects the push with a "refusing to allow ... to create or update workflow" error. The push token must have the **`workflow`** scope granted.

This applies to *any* commit touching a workflow file — not just commits that create workflows. A commit that mixes workflow-file changes with unrelated code will be rejected wholesale unless the token has the scope.

## Workarounds

- **Add the scope once**: `gh auth refresh -h github.com -s workflow` opens a browser to grant `workflow` to the current `gh` token.
- **Split the commit**: ship the non-workflow changes first, then add the scope and push the workflow file separately.
- **Create the file via the GitHub web UI** (e.g. `…/new/main/.github/workflows`) which bypasses the token-scope check entirely.

## Evidence

In this repo, the `creatuluw` token (scopes: `gist, read:org, repo`) had its push rejected because the commit touched `.github/workflows/embed-new-bookmarks.yml`. The `hoipippeloi` token has the scope but lacks write access to the repo. Splitting the commit let everything else land on `main`; the workflow file needed the scope added (or the UI route).
