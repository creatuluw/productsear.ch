---
type: Decision
title: User-facing vocabulary is "listings" — display-terms-only rename, URLs stay /archive
description: Context
tags: [frontend, copy, vocabulary, routes]
status: accepted
timestamp: "2026-11-03T09:17:03.563Z"
---

# User-facing vocabulary is "listings" — display-terms-only rename, URLs stay /archive

## Context

The site's user-facing copy mixed two internal terms: the chronological all-entries surface was labeled **"archive"** (nav link, page title tag, sr-only h1, page heading) and the data was described as the **"corpus"** (search placeholder, vital-signs stat label). The user asked to rename both user-facing terms to **"listings"**.

## Choice

All user-facing display vocabulary is now **"listings"** (commits `5dca6ca` + `47fc5b8`, 2026-11):

- Homepage: search placeholder "search the listings — …", vital-signs stat label `LISTINGS`
- Nav: `search · listings · compendium` (in `src/routes/+layout.svelte`)
- `/archive` page: `<title>` tag, sr-only h1, and the big page heading all say "listings"
- Compendium sr-only heading updated to match

**URLs are unchanged** — the route is still `/archive` (and `/archive/page/N`). This is a display-terms-only rename.

## Alternatives considered

- Rename URLs `/archive` → `/listings` — rejected: user asked for display terms only; existing `/archive` links (shareable, indexed) would break.
- Keep "archive"/"corpus" in copy — rejected: inconsistent vocabulary for the same thing users can search.

## Consequences

- The display/URL mismatch (`/archive` serves the "listings" page) is **intentional** — do not "fix" it by renaming routes.
- Internal vocabulary is unchanged: the DB corpus, `llms.ts` (`corpusOverviewMd()`), schema docs, and prose about the data still say "corpus"/"archive" where they refer to internals, not UI copy.
- New user-facing copy should say "listings", never "corpus" or "archive" — see [sweep-every-render-path-when-renaming-display](../rules/sweep-every-render-path-when-renaming-display.md).
