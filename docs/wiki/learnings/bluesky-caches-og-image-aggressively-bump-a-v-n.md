---
type: Learning
title: "Bluesky caches og:image aggressively — bump a ?v=N cache-bust on card URLs after redesigns"
description: "**The incident (2026-11-07, commit `6b3aeb0`):** after the receipt-card redesign, the user pasted a Bluesky compose screenshot showing the **old card** (missing"
tags: [[og-images, caching, bluesky, gotcha, social-cards]]
timestamp: "2026-11-07T12:16:44.524Z"
---

# Bluesky caches og:image aggressively — bump a ?v=N cache-bust on card URLs after redesigns

**The incident (2026-11-07, commit `6b3aeb0`):** after the receipt-card redesign, the user pasted a Bluesky compose screenshot showing the **old card** (missing text, full-height blue left stripe) — while production was in fact already serving the redesigned card (verified: prod PNG sizes byte-identical to local, 101KB/104KB, mascot and all).

**The cause:** not the code — **Bluesky's CDN replaying its cached PNG** of the OG endpoint response. Our own endpoint also sends cache headers (`max-age=3600`), so unfurls keep the previous image even after a correct deploy. The deploy was fine; the *platform cache* was stale.

**The fix:** versioned `og:image` URLs — both meta tags (`src/routes/feed/+page.svelte`, `src/routes/listings/[id]/+page.svelte`) now carry `?v=2` on the `/api/feed/og/...` URLs. **Bump the `?v=N` number on every card redesign** to force social platforms to refetch.

**Corollary diagnostic:** when a social-card bug report arrives after a redesign, first curl the OG endpoint from production and compare against local before debugging card code — the stale image often lives in the platform's CDN, not in the code. (Distinct from the OG font incident, where production genuinely diverged from HEAD — there the fix-side check is `git show HEAD:…` bytes.)
