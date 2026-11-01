---
type: Rule
title: Guard min-content width on wrapping-sensitive text
description: "**Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_app:`) set large **m"
tags: [design, responsive, css, typography, craft]
timestamp: "2026-11-01T01:27:44.055Z"
---

# Guard min-content width on wrapping-sensitive text

**Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_app:`) set large **min-content widths** that push a page wider than the viewport even inside `min-w-0` grids. Overflow from min-content is invisible in desktop screenshots and only shows on narrow viewports.

**Always**:
- Apply `break-words` to wrapping-sensitive user-supplied text (titles, snippets, tags).
- Downsize mono stat values at small breakpoints (e.g. the `2026-10-31` date at `text-lg` makes each grid cell ~185px min-content → the panel alone forces ~418px page width).
- Use 2×2 stat-panel grids until `lg`; go 4-col only at wide breakpoints — 4 narrow mono cells wrap dates mid-token ("2026-10-" / "31").
- Keep horizontal chrome bars (wordmark + nav + tabs) `overflow-x-auto` scrollable instead of letting them push page width.

**Evidence**: 3 of the 5 defects found in the P5 verify round (2026-11-01) were min-content-width issues — shell-bar overflow, stats-grid date wrapping, unbreakable repo tokens. See [[instrument-grade-design-principles-avoid-banned-tells]] for the overarching design system this belongs to.
