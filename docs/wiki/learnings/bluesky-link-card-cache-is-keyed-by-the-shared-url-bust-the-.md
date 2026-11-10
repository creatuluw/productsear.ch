---
type: Learning
title: "Bluesky link-card cache is keyed by the shared URL — bust the share URL, not just og:image"
description: "**The mechanism (discovered 2026-11-07, commit `80cadc8`):** Bluesky's link-card cache is keyed by **the shared URL itself** (`/listings/2274791`), not by the `"
tags: [bluesky, og-images, caching, social-cards, gotcha, share-urls]
timestamp: "2026-11-07T12:19:40.325Z"
---

# Bluesky link-card cache is keyed by the shared URL — bust the share URL, not just og:image

**The mechanism (discovered 2026-11-07, commit `80cadc8`):** Bluesky's link-card cache is keyed by **the shared URL itself** (`/listings/2274791`), not by the `og:image` URL. While composing a post, Bluesky does **not re-fetch the page** — it replays the cached card for that URL, so a `?v=2` bump on the og:image (the fix from [[learnings/bluesky-caches-og-image-aggressively-bump-a-v-n-cache-bust-o]]) is never discovered: the page never gets re-resolved.

**The two-layer fix:**

- **Layer 1 (page side):** bump `?v=N` on the og:image URLs — helps only *once* the page is re-fetched.
- **Layer 2 (share side):** make the shared URL itself a fresh cache key. The **share on bluesky buttons** now append `?utm_source=bsky` to every share URL, so each future share gets a unique cache key (and Plausible gets the referral attribution).

**Instant workaround** for verifying a redesigned card right now: paste the listing URL with any query suffix — `https://productsear.ch/listings/2274791?bsky` — Bluesky treats it as a different URL, fetches fresh, and the new card unfurls.

**Rule of thumb:** after a social-card redesign, bust *both* layers — the og:image version param AND the share-URL template. Deploying the new card alone shows the old card to everyone who shared the URL before.
