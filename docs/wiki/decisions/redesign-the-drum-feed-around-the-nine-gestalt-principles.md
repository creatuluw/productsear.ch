---
type: Decision
title: Redesign The Drum /feed around the nine Gestalt principles
description: "**Context.** The `/feed` page (The Drum, [[pages/entities/the-drum-feed]]) had shipped as a functional column of hairline-separated rows: unbounded cards with f"
tags: [design, frontend, feed, the-drum]
status: accepted
timestamp: "2026-11-06T20:56:48.699Z"
---

# Redesign The Drum /feed around the nine Gestalt principles

**Context.** The `/feed` page (The Drum, [[pages/entities/the-drum-feed]]) had shipped as a functional column of hairline-separated rows: unbounded cards with floating meta, ~8 text styles per card, ~130-char line lengths, no reading rhythm. The user directed a redesign grounded in the nine Gestalt principles (gestaltprinciples.com) so the page would "read and enjoy better".

**Choice.** Each violated principle was mapped to a concrete structural treatment:

- **Common Region / Closure** → every card is a bounded surface (`bg-surface` + border + radius); the header readout became a vital-signs-style panel; a hairline closes each card's action zone.
- **Continuity** → a continuous **timeline spine with accent nodes** runs the stream — "the drum keeps time" made literal.
- **Figure-Ground** → headline promoted to 22px semibold, the unambiguous figure; domain/body recede to ground; domain sits directly under its headline.
- **Proximity** → chip+date pair kept tight; share actions grouped into one separated row (open stack ↔ share on bluesky; digest input ↔ methodology link).
- **Symmetry & Order / Prägnanz** → constrained ~72ch measure, fewer text styles, and the dangling "listing added —" em-dash noise dropped.
- **Similarity** → identical chips and identical action pairs on every card.
- **Common Fate** → cards animate as units (kept).

**Alternatives considered.** Cosmetic tweaks (spacing, font sizes) — rejected: the problems were structural (no regions, no rhythm), not sizing. Full page rebuild — unnecessary; token architecture and card semantics were preserved.

**Rationale.** Verified in the dark theme via headless-Chrome screenshots before/after; check + build green; committed `b75116c` and pushed. The light theme shares the same token architecture, so it carries over.

**Consequences.** This bounded-card-on-a-spine language is now the reference style for Drum feed surfaces. The homepage's 3 latest Drum cards were deliberately NOT restyled in the same pass — they are a candidate follow-up until the homepage matches. The method used (principle-by-principle diagnosis → treatment mapping) is captured as a reusable rule.
