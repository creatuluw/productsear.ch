---
type: System Overview
title: Overview
description: What this project contains and its structure.
timestamp: "2026-07-03T13:24:57.608Z"
---

# Overview

**productsear.ch** is a project workspace that currently consists almost entirely of a knowledge wiki scaffold. The repository name suggests an intended product-search application or website (the `.ch` domain suffix is common for Swiss domains), but no application source code, tests, build configuration, or package manifests have been added yet. The only substantive content is documentation infrastructure: an [OKF](https://github.com/earendil-works/okf) (Open Knowledge Format) bundle living under `docs/wiki/`.

The project is organized into three top-level directories. `.pi/` holds pi (the coding-agent harness) session state, including file-based todos. `.work/` holds runtime/scratch state for tools, specifically the PieTask lightweight task-tracker (its setup marker and discovered port). `docs/` contains the entire OKF wiki bundle — the only user-facing content in the project so far.

Inside `docs/wiki/`, the layout follows the standard OKF structure: an `index.md` landing page, an `overview.md` (this file), a `glossary.md`, a `last_updated.md` sync marker, and a `log.md` changelog. Subdirectories partition knowledge by type: `architecture/` (e.g. the file-tree map), `decisions/` (ADRs), `rules/` (reusable conventions), `learnings/`, `preferences/`, and `pages/` (which further splits into `concepts/`, `entities/`, and `artifacts/`, plus a `TEMPLATES.md` reference). Each typed folder ships with an `index.md`.

Because the wiki was scaffolded freshly (initial creation logged 2026-07-03) and no code exists yet, the knowledge base is largely empty templates. The natural next step is to begin capturing the intended domain (product search), record architecture decisions as they're made, and document the application once implementation starts.
