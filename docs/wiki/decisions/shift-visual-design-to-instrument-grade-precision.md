---
type: Decision
title: Shift visual design to instrument-grade precision-tool system (OKLCH)
description: Context
tags: [design, frontend, styling, design-system]
status: accepted
supersedes: decisions/adopt-agentos-sdk-dev-visual-design-system
timestamp: "2026-08-06T09:34:50.714Z"
---

# Shift visual design to instrument-grade precision-tool system (OKLCH)

## Context
The app's visual identity was previously lifted wholesale from agentos-sdk.dev (warm light-paper theme: cream cards, orange primary, SVG paper grain, signature animated silver chrome-gradient border) — see the superseded ADR. That direction read as decorative/generic-flashy rather than purposeful. A new design brief (`.impeccable.md`) defines the brand as a **precision instrument** the operator trusts because it is legible, consistent, and fast — the working-tool opposite of decorative SaaS/marketing chrome. This redesign implements that brief.

## Choice
Adopt an **"instrument-grade precision tool"** light theme: near-white cool-neutral surfaces (neutrals tinted toward a brand hue of green ~165 for subconscious cohesion), deep ink text, a single deep ink-green accent for structure, hairline rules, mono-set data. Replace the decorative chrome-gradient signature with a **live instrument readout** (corpus size · last-indexed · latency · pipeline) in Martian Mono — transparency over ornament.

## Key tokens (OKLCH — perceptually uniform)
- canvas `oklch(0.985 0.004 165)`, surface `oklch(0.995 0.003 165)`
- ink `oklch(0.22 0.012 165)`, ink-soft `oklch(0.48 0.012 165)`, ink-faint `oklch(0.7 0.01 165)`
- accent (ink-green) `oklch(0.42 0.09 165)` / hover `oklch(0.36 0.1 165)`
- signal (gold, active-only — caret, focus underline) `oklch(0.68 0.14 70)`
- success `oklch(0.55 0.11 165)`, **danger** `oklch(0.54 0.16 27)` (new — clear failure states for trust)
- radius `0.375rem`; hairline borders `oklch(0.22 0.012 165 / 0.1)`

## Typography
- Sans: **Hanken Grotesk** (400/500/600/700) — display + body
- Mono: **Martian Mono** (400/500/600) — all numerals/IDs/timing, the "instrument readout" voice; `font-variant-numeric: tabular-nums`
- Headlines: semibold, tight negative tracking; `.md` prose `line-height: 1.7`

## Dropped from the previous system
- Chrome-gradient border (animated silver conic) — banned as decorative
- SVG fractal-noise paper-grain background texture
- Gloria Hallelujah handwritten accent; Manrope; JetBrains Mono
- Warm paper/cream/gold/olive/orange palette
- lucide Search/Sparkles icons on the mode toggle (→ lowercase mono text pills)

## Signature element
The **instrument readout**: a 4-cell mono `<dl>` (Corpus · Indexed · Latency · Pipeline) atop the page, fed live by the `load` query. Reinforces trust (transparent state), proficiency (data-forward), and speed (timing shown). Replaces the chrome-gradient gimmick.

## Rationale
The brief's users are a power-user operator doing quick mid-task lookups where seconds and trust matter. A calm, legible, data-forward instrument communicates competence better than warm-paper ornament. OKLCH gives perceptually uniform steps; tinting neutrals toward the brand hue binds the palette without explicit color. Surfacing real corpus/latency/indexed state builds trust the chrome border couldn't.

## Alternatives considered
- Keep / iterate the agentos-sdk.dev system — rejected: reads as decorative and generic-flashy; doesn't match the "working tool" brand.
- Dark theme — deferred: considered as a future mode, not the default (max legibility for daytime lookups wins).

## Consequences
- `app.css @theme` fully replaced (tokens, fonts, radius); `:focus-visible` ring + `::selection` styling added; `.chrome-border` class and paper-grain background removed; `.md blockquote` restyled to a hairline-bordered tinted block (no side-stripe — a banned tell).
- `app.html` Google Fonts load → Hanken Grotesk + Martian Mono.
- `+page.svelte` redesigned end-to-end: instrument readout header, lowercase mono mode pills, hero search field (bottom-border + gold signal caret), numbered result rows with `fly` transition + `prefers-reduced-motion` guard, danger-tinted error state, mono result-count line.
- `+page.server.ts` now also returns `lastSynced` (`max(synced_at)::text`) to feed the readout.
- Source design brief lives at `.impeccable.md`; see also the [[instrument-grade-design-principles-avoid-banned]] rule.
