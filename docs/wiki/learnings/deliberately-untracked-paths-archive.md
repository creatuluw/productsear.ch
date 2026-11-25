---
type: Learning
title: "Deliberately untracked paths: .archive/ is gitignored (holds .ghtoken); wave-loader-demo.html stays local-only"
description: Discovered 2026-11-06 while committing/pushing the pipeline work (5 commits, `1ac2b8e..bbd94b1`).
tags: [git, security, repo-hygiene, untracked-files]
timestamp: "2026-11-06T13:13:32.925Z"
---

# Deliberately untracked paths: .archive/ is gitignored (holds .ghtoken); wave-loader-demo.html stays local-only

Discovered 2026-11-06 while committing/pushing the pipeline work (5 commits, `1ac2b8e..bbd94b1`).

**`.archive/` is gitignored on purpose.** It contains `.ghtoken` — a GitHub credential used by the repo-scan scripts documented in [[repo-scan-pipeline]]. Gitignoring the whole directory means the token can never leak through a careless `git add .` or pathspec slip. Consequence: changes under `.archive/` never show in `git status` and are **not version-controlled** — the repo-scan pipeline files exist only on this machine.

**Deliberately untracked by design (do not "clean up" into a commit):**

- `wave-loader-demo.html` — local-only dev harness for the WaveLoader component
- `.monster/` session transcripts

When doing a final-commit sweep of the repo, these paths are expected leftovers, not missed files. Never move `.ghtoken` (or copies of it) into tracked paths.
