# Archetype research — search/library instrument (archival corpus browser)
> Researched 2026-11-01 · 7 exemplars · 10 patterns · informs onepager + brief
> Surfaces: search home (redesign), all-entries list (new), compendium by archetype (new)

## Exemplars examined

- **Are.na** — https://www.are.na/ — block/channel research library; calm 2-col grid, no algorithmic feed, annotations on every block (critique: https://ixd.prattsi.org/2026/02/design-critique-are-na-ios-app-2/)
- **mymind / inkling clone design doc** — https://mymind.com/ + https://github.com/Squidys-Tools/mymind-library/blob/main/docs/design.md — "quiet visual board"; search at top of library, per-type card treatments, compact header, explicit "no hero statements or dashboard metrics"
- **Pinboard** — https://pinboard.in — anti-design dense text-only bookmark archive; tags + fast search; speed as the aesthetic
- **Raindrop.io** — https://raindrop.io/ — collections-first bookmark manager; pretty but utilitarian grids
- **Internet Archive** — https://archive.org/ (via https://uiuxshowcase.com/resources/archive-org/) — vast-catalog search-first; multi-filter drill-down by type/year/creator
- **NYPL Digital Collections** — https://digitalcollections.nypl.org/ — institutional faceted collection browse (fetch failed; structure corroborated by archive.org + Berkeley case studies)
- **Baymard search-UX research** — https://baymard.com/blog/search-bar-ui — search bar anatomy, persist-query, filters-complement-search, zero-results handling
- **ui-patterns Archive/Pagination/Cards** — https://ui-patterns.com/patterns/Archive — chronological listing, 10–20 items/page guidance, cards for heterogeneous content

## The 10 patterns

### 1. Search-first instrument header (skeleton)
what: persistent, prominent search field at the very top of every surface; query persists in the field on the results page; clear control appears once typing starts.
why common: the corpus IS the product; search is the primary navigation mode for >1000-item catalogs.
prevalence: 7 of 8 (all but pure-archive showcases).
exemplars: Baymard, mymind, Pinboard, Are.na, archive.org.
gestalt: focal point, past experience, figure/ground.
verdict: **adopt**.

### 2. Corpus vital-signs strip (skeleton)
what: a compact readout band (corpus size, last-sync, coverage) above the fold — institutional libraries print collection sizes and date ranges as a trust signal.
why common: tells the researcher the instrument is alive and how fresh/complete the corpus is.
prevalence: 5 of 8 (are.na member counts, archive.org item counts, NYPL collection stats).
exemplars: are.na, archive.org, NYPL.
gestalt: uniform connectedness, similarity.
verdict: **adopt** (already our signature — keep, integrate into redesign).

### 3. Chronological archive list (skeleton → all-entries page)
what: all entries listed newest-first, partitioned by date headlines proportional to density (year/month groups), each row linking out.
why common: the "what was added lately" scan is the archive's second reading mode after search.
prevalence: 6 of 8 (ui-patterns Archive pattern, Pinboard, are.na activity).
exemplars: ui-patterns, Pinboard, are.na.
gestalt: continuity, past experience.
verdict: **adopt** for the all-entries page.

### 4. Compact text-first rows, full width (section)
what: dense single-line-to-three-line rows (title + domain + one metadata line), full-width, not a visual card grid — Pinboard's density, not Pinterest's vertigo.
why common: a 3.7k-entry corpus is scannable only as text rows; thumbnails add noise, not signal, for tool/bookmark entries.
prevalence: 5 of 8 (Pinboard, are.na channel meta-rows, archive.org list views).
exemplars: Pinboard, are.na, archive.org list mode.
gestalt: proximity, similarity, Prägnanz.
verdict: **adopt**.

### 5. Taxonomy landing = compendium by category (skeleton → compendium page)
what: a browse surface organized by category/archetype groups, each group headed with name + count, entries listed under their group.
why common: category browse serves the "what kinds of things are in here" question search cannot answer.
prevalence: 6 of 8 (archive.org media types, NYPL collections, raindrop collections).
exemplars: archive.org, NYPL, raindrop.io.
gestalt: common region, similarity.
verdict: **adopt** (categories = `bookmark_analysis.category`; "archetype" in user language).

### 6. Rich entry cards with who/what/how/when metadata (section)
what: each entry exposes its analysis metadata — purpose (what), how-to-use (how), relevance/when-to-use (when), audience implied (who) — mymind gives each saved type its own card treatment; are.na annotates every block.
why common: a research corpus's value is the annotations, not the links.
prevalence: 4 of 8 (mymind, are.na, inkling clone spec).
exemplars: mymind, are.na, inkling design.md.
gestalt: common region, proximity, closure.
verdict: **adopt** — compendium entries carry the full who/what/how/when block.

### 7. Faceted narrowing inside browse (interaction)
what: filter rails (type, date, tag) that narrow within a browse context, complementary to search (Baymard: search + filters must work as one system).
why common: large catalogs need drill-down; but it adds state complexity.
prevalence: 5 of 8.
exemplars: Baymard, archive.org, NYPL.
gestalt: common region, similarity.
verdict: **deviate (this scope)** — 3.7k entries and static categories make a filter rail overkill; compendium groups + search cover it. Revisit at 10k+.

### 8. Explicit pagination, 20 per page (interaction)
what: page-by-page paging with visible page count, not infinite scroll; ui-patterns: use from 10–20 items.
why common: archival browsing keeps position; infinite scroll destroys the "I'm at row 340" sense and back-button behavior.
prevalence: 6 of 8 (ui-patterns, NYPL, archive.org lists).
exemplars: ui-patterns, NYPL, archive.org.
gestalt: closure, uniform connectedness, past experience.
verdict: **adopt** — 20/page, URL-addressable page param.

### 9. Relevance honesty: quality cutoff + honest counts (interaction)
what: show only good matches; state "N strong matches" rather than padding to a page limit; guide on zero results (Baymard zero-results guidance).
why common: weak-result padding trains users to distrust the instrument; libraries print true result counts.
prevalence: 4 of 8 (libraries' true counts; the cutoff itself is a deliberate deviation from ecommerce "always fill the page").
exemplars: Baymard, NYPL, archive.org.
gestalt: figure/ground, focal point.
verdict: **adopt** — cutoff on rerank score; count states what survived the cutoff.

### 10. Calm low-chrome materials (style)
what: quiet ground, one accent color, compact headers; inkling spec: "no hero statements or dashboard metrics"; motion 150–300ms, communicating not decorating.
why common: the corpus is the content; chrome competes with scanning.
prevalence: 6 of 8 (mymind, are.na, Pinboard take it to the extreme).
exemplars: inkling design.md, are.na, mymind.
gestalt: figure/ground, Prägnanz, emergence.
verdict: **adopt** — maps 1:1 onto the existing instrument-grade OKLCH system.

## Conventions strip

type: system/UI or humanist sans for content, mono for data/counts/labels (both common; corpus tools lean mono-heavy) · color: one accent + neutrals; low-chrome; dark (are.na, mymind) and light (Pinboard, NYPL) both credible — our OKLCH light instrument system stays · space: compact headers, generous row rhythm; group gaps > in-group gaps · motion: minimal, 150–300ms, reduced-motion respected.

## Anti-patterns to avoid

- Pinterest-style visual-vertigo thumbnail grids (noise for tool/bookmark entries)
- Algorithmic "related/recommended" injection into archival lists (are.na's whole brand is NOT doing this)
- Hero marketing statements or dashboard-metric chrome on a tool surface
- Icon-only collapsed search; query cleared after submit
- Infinite scroll on archival lists (position + back-button breakage)
- Padding results past the good-match zone; hiding true counts
- Colored category chips with low-contrast text (our gold-accent WCAG lesson — color may mark groups, never carry small text)

## Open observations (feed P2)

- **"Date of addition" is not `synced_at`** — the Raindrop sync rewrites every row each pass, so `synced_at` is ~now for everything. Need to confirm which column holds true creation order (likely Raindrop `created`; must verify in DB before P5).
- **Relevance cutoff needs a score** — the current rerank client discards Voyage `relevance_score` (returns order only). Implementation must surface scores to cut honestly. Threshold value needs a decision (e.g. ~0.3–0.5 on rerank-2.5-lite's 0–1 scale — to be calibrated in P5).
- **Ask-mode removal** frees the home's mode toggle and bottom-anchored context line — the redesign inherits that space.
- Compendium "who" is only implied by purpose text — `bookmark_analysis` has no explicit audience column. Who = derived from purpose/howToUse wording unless the user wants an explicit field (P2 question).
