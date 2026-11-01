# DESIGN-BRIEF — productsear.ch corpus-browser redesign

> Handover document for the design work. Self-sufficient: an LLM that never saw the
> conversation can produce the approved design from this file alone.
> Preceded by: approved pattern one-pager (`.monster/impeccable-studio/onepager.html`),
> archetype research (`research/archetype-patterns.md`), interview (state.json decisions).

## 1. Header

- **Surface**: productsear.ch — a corpus browser with three surfaces (search home `/`, archive `/archive`, compendium `/compendium`), each with a `humans | llms` view twin, plus `/skill.md`.
- **Project**: productsear.ch (SvelteKit 2 + Svelte 5 + Tailwind v4, deployed on Railway).
- **Date**: 2026-11-01 · **Archetype**: search/library instrument (archival corpus browser).
- **Impeccable mode**: **Operate** — a working instrument the researcher uses daily; the primary action is search-and-find, not persuasion or long-form reading. Every surface optimizes for scan speed, state transparency, and trust.

## 2. Product context

- **Audience**: (1) the owner-researcher — daily, desktop, known-goal lookups, arrives with a query; (2) incidental search-engine visitors exploring a specific tool. No onboarding chrome; every entry stands alone.
- **Primary action**: search the 3.7k-entry corpus and get strong matches with honest counts. Secondary: scan the archive (all entries, newest first), browse the compendium by archetype.
- **Brand adjectives**: instrument-grade, precise, calm, terminal-native, honest. **Never**: marketing-y, decorative, gradient-sloppy, padded, dashboard-busy.
- **References**: host0.ai — interface shows the machine working (deploy logs, version timeline), protocol-numbered steps ("There is no step four"), wry confident microcopy. clawrun.sh — mono-led density, fact strips (`1min / 100% / 24/7 / ∞`), pipeline-as-hero. Both validate leaning harder into the terminal register.
- **Constraints**: existing OKLCH instrument tokens (ink on paper, signal green, amber accent — see `src/app.css`); WCAG AA (gold accent must never carry small text — standing lesson); reduced-motion respected; source DB tables are read-only mirrors (app owns only `bookmark_embeddings` + a new archetype table); read-only corpus, no auth; Ask mode is removed.
- **Data facts the design consumes** (all real, no placeholders):
  - ordering by `te9_dev.bookmarks.raindrop_created_at` (NOT `synced_at` — rewritten every sync pass)
  - per-entry metadata from `te9_dev.bookmark_analysis`: `purpose` (what), `how_to_use` (how), `when_to_use` (when), `relevance`, `tags`, `category` (raw)
  - 1,320 raw categories roll up to **20–30 modern archetypes** (workforce / business-domain / tool-type lens), stored as multi-entry `jsonb` on an app-owned table, backfilled by a deterministic classifier; a bookmark may carry several archetypes
  - search: rerank-score cutoff (only good matches shown), 20/page URL-addressable pagination, honest counts ("N strong matches")

## 3. The skeleton (approved base)

One shell, three surfaces. Block ids from the one-pager.

| # | Block | Purpose · content intent | Patterns | Real content |
|---|---|---|---|---|
| 1 | **Shell bar** | thin sticky bar: wordmark left · surface nav (`search · archive · compendium`) · `humans \| llms` tabs right (plain links, `?view=llm`) | #1, D1 | live nav state; tabs reflect current URL |
| 2 | **Search field** (home) | the instrument's primary control; query persists in field; clear (×) once typing; ⏎ submits; URL-driven (`?q=`) | #1 | real corpus queries; example chips |
| 3 | **Vital-signs strip** | corpus size · last sync · coverage · query latency — live readout, the trust signature | #2 | live DB counts (never hardcode) |
| 4 | **Results region** (home) | honest count line → strong-match rows only (cutoff) → 20/page pager; mono index + title + domain + purpose line + relevance meta | #4, #8, #9 | real results + rerank scores |
| 5 | **Archive surface** `/archive` | ALL entries newest first; date headlines (2026-11, 2026-10…) proportional to density; compact full-width rows; 20/page | #3, #4, #8 | all 3,764+ rows, live |
| 6 | **Compendium** `/compendium` | 20–30 archetype groups, count per group; per entry a bounded card: what (purpose) · how (how_to_use) · when (when_to_use) · who (implied audience from purpose wording) + raw category + tags | #5, #6, D3 | real roll-up + real metadata |
| 7 | **Footer** | total counts, `/skill.md` link, sync provenance, colophon | #2 | live |

**The `llms` twin** (every surface): same route + `?view=llm` renders paste-ready markdown — a compact "using this site as an LLM" preamble (distilled from `E:\skills.te9.dev\productsear.ch\SKILL.md`: API endpoints, query patterns, verify-before-adopt workflow) followed by the page's content as dense markdown (headings, flat lists, inline URLs). Zero chrome. `/skill.md` serves the skill itself.

**Removed**: Ask mode (mode toggle, `/api/ask`, RAG module) — the space it occupied is inherited by the results region.

## 4. Visual direction

- **Palette roles** (existing OKLCH system, unchanged): paper ground, near-black ink (content), ink-soft/ink-faint (secondary), signal green (live status only), amber accent (interactive/links + the ONE exception treatment), danger red (errors only). Color beyond ink/paper must carry meaning.
- **Type**: Hanken Grotesk for content text; Martian Mono for data — counts, labels, indices, dates, URLs, the vital signs, tab pills. Terminal register: protocol numbering (`01 / 02 / 03`) for section markers, mono-heavy labels, lowercase surface names (`search · archive · compendium`).
- **Spacing**: compact header (~48–64px); dense but regular row rhythm — in-row gaps 4–12px, between rows one hairline + 20–24px; group gaps ≥ 2× in-row gaps; full-width rows.
- **Motion**: one sentence — rows enter together (same fly: 8px y, 180ms, stagger ≤35ms/item capped at 280ms), hovers tint uniformly, nothing decorative, reduced-motion collapses all to 0.
- **Imagery**: none. No thumbnails, no icons beyond functional (×, ‹ ›, magnifier, external-link).

## 5. The Gestalt handover — MANDATORY

*Every principle below is binding on this surface.* All fifteen, instantiated.

### 1. Proximity
Group label-to-value pairs tightly: vital-signs cell label → value gap ≤ 6px; search context line → field ≤ 8px; entry-row internals (domain, title, snippet, tags) gaps 4–12px. Separate groups hard: result rows separated by hairline + 20–24px; compendium entries ≥ 24px apart; archetype group header → first card ≤ 12px, last card → next group ≥ 40px. Spacing alone must communicate grouping before any border is seen.

### 2. Similarity
One style = one meaning across all surfaces: every entry row shares the mono-index + title + domain treatment; every group header shares name+count shape; every link shares the accent hover. Exactly ONE intentional exception per viewport: the active element (filled-ink tab pill, or active pager page) differs in fill AND weight — never one attribute alone.

### 3. Closure
Archive date dividers are partial rules; they must read unambiguously as separators at 16px and 64px. The pager's ‹ › chevrons and the search field's × must complete as recognizable controls from minimal strokes. Mono index numbers (`01`, `02`) must read as list positions even where row borders fade.

### 4. Continuity
One left content axis per surface: archive rows and date headlines align on the mono-index column (~2.5rem); compendium cards align on a single card-grid axis; the eye's path never reverses: shell bar → search field → count line → results → pager, top-down, one direction. Broken alignments read as defects — none allowed.

### 5. Figure/Ground
Ink-on-paper contrast stays ≥ the existing token ratio (~15:1); secondary text uses ink-soft, never below AA for its size. Figure = the content region; ground = quiet paper chrome. The llms view strips to pure text ground (no chrome competes). Signal green appears only as live-status dot/underline — never large fills. Hover tint = ≤2% ink so rows stay figure, not buttons.

### 6. Symmetry & Order
Vital-signs: 4 equal cells (4-col grid; 2×2 on mobile). Results: 2-col equal-gutter grid at xl, 1-col below. Pager centered on the content axis. The one asymmetry — brand left, tabs right in the shell bar — is deliberate, anchored by the centered-under focal search field.

### 7. Common Fate
All result rows share one entrance fly (same direction, distance, timing, ≤35ms stagger, 280ms cap); archive rows the same; on pager navigation the outgoing and incoming sets move as one group; every row's hover is identical (tint + title→accent). No single row animates apart from its group.

### 8. Common Region
Each compendium entry = one bounded card (hairline + surface tint) because four who/what/how/when lines alone would bleed into neighbors. The vital-signs strip is ONE bounded region subdivided by internal hairlines — not four floating cards. The llms content sits in its own region (mono, chrome-free) so the tab switch is unmistakable.

### 9. Prägnanz
At most 3 alignment axes per surface (content-left, meta-right, pager-center). One shape language: 1px hairlines + the system radius token. No decorative shapes, no gradients, no shadows-as-ornament. Every element that survives a simplification pass earns its complexity by carrying hierarchy, action, or meaning.

### 10. Emergence
At 50% zoom each surface is nameable in 2 seconds: home = "a search instrument" (big field + readout strip + dense list); archive = "a log of everything, newest first" (date headlines + rows); compendium = "a catalog of tool types" (grouped cards). Silhouettes come from rows and groups, never imagery or decoration.

### 11. Invariance
The entry row keeps one silhouette across default/hover/loading and across breakpoints (index · title · domain · meta line); states change only tint and color, never shape or order. Tabs read as tabs at any width; the pager is the same component at 3 pages or 40. A row is never mistaken for a different thing because it's loading.

### 12. Multistability
Date headlines must not read as buttons: no hover, no pointer, no fill. The cutoff notice must not read as an error: amber (not red), phrased "N strong matches · stopped at the quality floor". The `humans | llms` switch reads as tabs (active = filled pill), never as a mystery toggle. Every two-way-ambiguous element gets exactly one disambiguating cue.

### 13. Focal Point
Exactly one focal point per viewport. Home: the search field (largest type on the page, signal caret, focus border). Archive: the newest date group header. Compendium: the archetype index (group list). The vital-signs strip never competes — it is data-dense but visually quiet.

### 14. Uniform Connectedness
The shell bar connects to the surface via a continuous bottom hairline; the active tab's underline meets it. Vital-signs cells share internal 1px grid lines as one connected instrument panel. In the archive, each date headline connects to its rows by a shared left rule, so group membership is carried by connection, not just spacing.

### 15. Past Experience
Keep the conventions users already know: nav top with wordmark left; magnifier = search; × = clear; ‹ › = pager; underline-on-hover = link; mono = data; external-link icon = opens new tab. Redirect learned expectations deliberately where we deviate: label the view switch literally `humans | llms` (words, not icons); where ecommerce-trained users expect padded pages, the count line states the cutoff explicitly; groups are called `archetypes` — the site's own vocabulary — reinforced by every group header repeating the word.

**Coverage check (all fifteen, in order):** 1 proximity ✓ 2 similarity ✓ 3 closure ✓ 4 continuity ✓ 5 figure/ground ✓ 6 symmetry & order ✓ 7 common fate ✓ 8 common region ✓ 9 prägnanz ✓ 10 emergence ✓ 11 invariance ✓ 12 multistability ✓ 13 focal point ✓ 14 uniform connectedness ✓ 15 past experience ✓ — **15/15**.

## 6. Impeccable execution plan

1. **Setup**: seed `PRODUCT.md` from §2 (init semantics); load existing `src/app.css` token block + `+page.svelte` as the refine-existing context. Acceptance: PRODUCT.md states audience, primary action, adjectives, never-list.
2. **New-work per surface** (order: home → archive → compendium → llms twins → `/skill.md` route) against §3–§5, inside the existing SvelteKit components; data endpoints extended first (pagination + cutoff params, rerank scores surfaced, archetype table + backfill, archive/compendium loads). Acceptance: skeleton blocks all present, real data wired, Gestalt steps verifiable per surface.
3. **Bounded verify pass** per impeccable's ceiling; fix findings in one batch.
4. **P6 refine rounds** as feedback demands, mapped to refine verbs (polish/layout/typeset/colorize/distill/clarify/harden).

## 7. Out of scope

- Facet rails / filter UI (pattern #7 deviate)
- Item detail pages (entries link out; no local detail route)
- Auth, personalization, accounts
- Embedding/sync pipeline changes beyond the archetype backfill addition
- API redesign beyond: pagination + cutoff on `/api/search`, removal of `/api/ask`, new `/skill.md` route
- Dark mode, i18n
