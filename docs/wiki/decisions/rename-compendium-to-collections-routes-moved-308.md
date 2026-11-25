---
type: Decision
title: Rename compendium to collections (routes moved, 308 redirects)
description: Context
tags: [frontend, routing, rename, ux]
status: accepted
timestamp: "2026-11-06T12:33:18.322Z"
---

# Rename compendium to collections (routes moved, 308 redirects)

## Context

The archetype roll-up surface shipped 2026-11-01 as **/compendium** with the display term "compendium". The user asked to rename it: "in https://productsear.ch/compendium i want to rename compandium to collections".

## Choice

Full rename — display term AND routes — on 2026-11-06 (commit `75f6424`):

- Routes moved: `src/routes/compendium/` → `src/routes/collections/` (index + `[slug]` group)
- **308 redirects** at `/compendium` and `/compendium/<slug>` (new minimal `+page.server.ts` redirect loads, query string preserved so `?view=llm` twins still resolve)
- Every render path swept per the sweep-every-render-path rule: nav label, `<title>` tags, sr-only h1s, headings, back links, pagination hrefs
- LLM twins updated: `llmview.ts` (preamble paths, `# collections` headers), `llms.ts` (pathname match + slug regex), served `/skill.md`
- External skill doc `E:\skills.te9.dev\productsear.ch\SKILL.md` updated in sync (per the external-skill learning)

## Alternatives considered

- **Display-terms-only rename, URLs stay /compendium** (the pattern of the "listings" rename, which kept `/archive`). Rejected here: no explicit keep-the-URL instruction, the route was only 5 days old, and `/collections` is a cleaner public slug than `/compendium`.
- **No redirects, clean break.** Rejected: LLM clients and the external SKILL.md had already bookmarked `/compendium`; the redirect files are the only remaining "compendium" strings in `src/` and are intentional.

## Rationale

Rename completion signal is a clean grep — `grep -rni compendium src/` hits only the two redirect files, which must reference the old path by design. Verified with `npm run check` (0 errors) and `npm run build` before push.

## Consequences

- Old links (HTML and `?view=llm`) keep working via 308.
- Historical wiki docs (decisions/learnings from 2026-11-01..03) intentionally still say "compendium" — they describe what was true then; live-contract docs (file-tree, overview, entity page) were updated.
- The wiki entity page keeps the id `compendium-pages` (renaming it would break `[[...]]` wikilinks); it is retitled "Collections pages" and documents the rename.
