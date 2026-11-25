---
type: Learning
title: "GitHub Actions invalid YAML: startup failure with zero jobs; the schedule silently never fires"
description: "**The gotcha (found 2026-11-09):** a `run:` value containing `Drum draw:` — a `colon+space` inside a plain (unquoted) YAML scalar — made `.github/workflows/feed"
tags: [github-actions, yaml, cron, feed-draw, the-drum, digest-send, ci, gotcha]
timestamp: "2026-11-09T15:22:21.421Z"
---

# GitHub Actions invalid YAML: startup failure with zero jobs; the schedule silently never fires

**The gotcha (found 2026-11-09):** a `run:` value containing `Drum draw:` — a `colon+space` inside a plain (unquoted) YAML scalar — made `.github/workflows/feed-draw.yml` **invalid**. Every run (push-triggered and scheduled) died as a `startup_failure` with **zero jobs**: GitHub never executed a single step. Worse, the daily 09:07 UTC schedule **never produced a single run** — all 14 run attempts since the workflow's creation (2026-11-06) were startup failures, so The Drum's nightly cron was silently dead from day one. `digest-send.yml` (The Digest's weekly cron) carried the identical bug; `embed-new-bookmarks.yml` was valid, which is why that pipeline worked.

**Diagnostic signature — how to recognize a dead workflow vs a failing one:**
- `gh run list` shows every run `failure`/`startup_failure`, and the run's job/steps list is **empty** — no step ever started. A failing script shows at least the failing step.
- No scheduled runs at all in the history (`gh run list --workflow=feed-draw.yml`) means the schedule never fired once — the workflow itself, not the trigger cadence, was broken.
- Check-run annotations / the run object name the YAML parse problem.

**Fix:** wrap `run:` values containing `:` (colons appear constantly in shell echo lines like `Drum draw: …`) in **block scalars** (`run: |`). This is the same colon+space hazard already recorded for skill frontmatter ([[learnings/skill-skill-md-description-must-quote-colons-to]]) — plain scalars cannot contain `: ` anywhere in GitHub-adjacent YAML.

**Related but distinct:** [[learnings/github-disables-scheduled-workflows-after-60-days]] is the *other* way a schedule silently stops firing (repo inactivity); this one is invalid YAML from creation. Both present as "the cron never runs" — check the run history's shape to tell them apart.
