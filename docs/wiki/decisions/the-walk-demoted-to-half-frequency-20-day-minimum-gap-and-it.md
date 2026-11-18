---
type: Decision
title: The Walk demoted to half frequency (20-day minimum gap) and its trail items made clickable
description: Context
tags: [the-drum, the-walk, feed, rotation, demotion, clickable-links]
status: accepted
timestamp: "2026-11-18T15:30:37.008Z"
---

# The Walk demoted to half frequency (20-day minimum gap) and its trail items made clickable

## Context

productsear.ch/feed showed **three Walk items in a row** (Nov 14/16/17) because the LLM drafting chain was down (Railway gateway 503 "Loading model") and The Floor was starving, so the rotation's catch-and-skip funneled every draw into The Walk — the only generator that cannot fail. The owner also questioned The Walk's reader value: the card shows 5 titles + bare hop distances with no narration of why the hops connect, making it the weakest-narrated card in the magazine.

## The choice

1. **Demote The Walk's frequency**: the generator now enforces a **minimum gap of 20 days** since the last *published* walk (`WALK_MIN_GAP_DAYS` in `src/lib/server/feed/generators/walk.ts`, gate query on `max(published_at) WHERE type='walk' AND status='published'`). When the gap is not met it returns null and the rotation falls through to the next type, per the existing catch-and-skip semantics. Effect: Walk appears at most every ~20 days instead of every ~10 (half frequency). Gate verified live: with the Nov 17 walk published, the generator returns null until ~2026-12-07.
2. **Walk items become clickable**: the `/feed` card renderer (`src/routes/feed/+page.svelte`) now wraps `body.items[].url` in an external `<a target="_blank" rel="noopener">` with the site's hover-accent treatment. This is data-driven rendering, so **the three already-published Walk cards got clickable links with no data migration** — the urls were already stored in `feed_items.body`.

## Alternatives considered

- LLM-narrate each hop (why neighbors are adjacent) or personalize the seed from reader context — the stronger fixes for reader value, but they depend on the currently-broken LLM chain; deferred.
- Cut The Walk entirely — kept, because it is the corpus's serendipity layer (pure pgvector, unique to this site) and the LLM outage made it look worse than it is.
- Fix the Railway LLM gateway — still outstanding (the five LLM-drafted types remain dead until then); the demotion does not fix that.

## Consequences

- The Walk streak cannot recur: with a 20-day gap, even a total LLM outage yields at most one Walk per 20 days, and the other draws fall through to the data-driven types (pulse/resurrections/tombola).
- The broader failure mode (LLM outage collapses the rotation onto whatever cannot fail) remains — see [learnings/when-llm-providers-are-down-the-drum-degenerates-into-consec](../../learnings/when-llm-providers-are-down-the-drum-degenerates-into-consec.md).
