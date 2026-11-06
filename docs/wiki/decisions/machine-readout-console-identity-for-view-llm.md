---
type: Decision
title: Machine-readout console identity for ?view=llm surfaces
description: Context
tags: [frontend, design, llms-view, css]
status: accepted
timestamp: "2026-11-03T09:30:39.301Z"
---

# Machine-readout console identity for ?view=llm surfaces

## Context

`?view=llm` documents (home, search, archive, compendium) were rendered by LlmDoc through the generic `.md` prose class — a sans-serif human-document look inherited from the removed Ask mode. The LLM-facing surface had no machine identity, and the raw `.md` link navigated in the same tab.

## Choice

LlmDoc now renders each llm view as a **machine-readout console**: a hairline-bordered panel with a mono status bar (`● machine view · text/markdown · /path`, green status dot), full Martian Mono 13px body, green `#` heading/list markers (`--color-success`), hairline-ruled h1, bordered code chips, dark pre blocks, horizontally scrollable tables, and `overflow-wrap: anywhere` for long URLs. Implemented as a **dedicated `.md-machine` CSS layer in `app.css`**, composed with the existing `.md` class (`class="md md-machine"`) — the shared `.md` human-prose styles are untouched. The raw `.md` link opens in a new tab (`target="_blank" rel="noopener"`).

## Alternatives considered

- **Restyle `.md` in place** — rejected: `.md` is shared human-prose styling; touching it risks regressions on human surfaces.
- **Keep the human treatment** — rejected: in the dual-view product (humans | llms), the llm surface is itself an audience-facing document and should read as machine-grade, per the instrument-grade design system.

## Rationale

Isolating machine styling to one greppable layer (`.md-machine`) makes llm-view changes safe and self-contained; the console grammar matches the existing precision-tool design language.

## Consequences

- Any llm-view styling change goes in `.md-machine` (`src/app.css`) or `src/lib/components/LlmDoc.svelte`; human markdown surfaces keep `.md` untouched.
- Verified commit `0500b2d`: all four raw surfaces (`/`, `/?q=…`, `/archive`, `/compendium`) still serve `text/markdown`; build green.
