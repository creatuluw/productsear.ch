---
type: Glossary
title: Glossary
description: Key terms for this project.
timestamp: "2026-07-03T13:24:57.608Z"
---

# Glossary

| Term | Definition |
|------|------------|
| OKF | Open Knowledge Format — the Markdown-with-frontmatter convention used to structure this wiki bundle; see [okf on GitHub](https://github.com/earendil-works/okf). |
| Wiki bundle | The collection of OKF documents under `docs/wiki/` that together document the project. |
| Frontmatter | YAML metadata block (`---` delimited) at the top of each OKF document carrying `type`, `title`, `description`, and `timestamp`. |
| pi | The coding-agent harness that operates this workspace; its session state lives in `.pi/`. |
| PieTask | A lightweight file-based task/feedback tracker whose runtime state (port, setup marker) lives under `.work/pietask/`. |
| ADR | Architecture Decision Record — a document in `docs/wiki/decisions/` capturing a major decision, its alternatives, and rationale. |
| Concept page | A wiki page (under `pages/concepts/`) describing an abstract idea, definition, or pattern. |
| Entity page | A wiki page (under `pages/entities/`) describing a concrete named thing (service, endpoint, model, tool). |
| Artifact page | A wiki page (under `pages/artifacts/`) describing a deliverable such as a diagram, report, or spec. |
| File tree | The annotated map of the project's files at `docs/wiki/architecture/file-tree.md`. |
| Sync marker | `last_updated.md`, bumped to signal the wiki is in sync with the codebase. |
| productsear.ch | The project/repo name; suggests an intended product-search application, though no source code exists yet. |
