---
type: Rule
title: Check the index before committing; use pathspec-scoped commits in repos with pre-staged changes
description: "**Guideline:** Before running `git commit` in any repo — especially auxiliary/external repos like `E:\skills.te9.dev` whose indexes accumulate unrelated pre-sta"
tags: [git, commits, hygiene, multi-repo, gotcha]
timestamp: "2026-11-06T12:36:26.217Z"
---

# Check the index before committing; use pathspec-scoped commits in repos with pre-staged changes

**Guideline:** Before running `git commit` in any repo — especially auxiliary/external repos like `E:\skills.te9.dev` whose indexes accumulate unrelated pre-staged changes — run `git status --short` first. If the index holds staged changes you did not stage, commit **only your files by pathspec** (`git commit -- <paths> -m "..."`) instead of a bare `git commit`, and never `git add -A` in such repos.

**When it applies:** any commit in a repo where you didn't start from a verified-clean index; multi-repo turns (this project always touches `productsear.ch` + the external skill doc + the wiki).

**Rationale / evidence:** 2026-11-06, pushing the SKILL.md sync commit to `skills.te9.dev` (commit `9b84ae6`) also swept in 7 pre-staged wiki-bot file renames sitting in that repo's index — unrelated changes shipped under a commit message that never mentioned them. A pathspec-scoped commit (`git commit -- SKILL.md`) commits only the named paths regardless of what else is staged, so the sweep would have been impossible.
