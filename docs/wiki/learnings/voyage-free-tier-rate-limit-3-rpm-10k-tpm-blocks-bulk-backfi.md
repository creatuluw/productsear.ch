---
type: Learning
title: Voyage free-tier rate limit (3 RPM / 10K TPM) blocks bulk backfill without a payment method
description: Gotcha
tags: [voyage, embeddings, rate-limit, backfill, gotcha]
timestamp: "2026-07-04T09:57:20.862Z"
---

# Voyage free-tier rate limit (3 RPM / 10K TPM) blocks bulk backfill without a payment method

## Gotcha
A Voyage AI account **with no payment method on file** is capped at **3 requests/min and 10K tokens/min**, even though the advertised 200M free-token credit still applies. This is well below what a one-shot corpus backfill needs (~2,270 bookmarks ≈ 700K tokens).

## Symptom
`scripts/embed-bookmarks.ts` embedded one batch, then Voyage returned **HTTP 429**. With a 10K TPM ceiling, a full re-embed would take ~70 min of sustained throttling.

## Fix options
1. **Add a payment method** at https://dashboard.voyageai.com/billing — the 200M free tokens still apply so you are not charged, but billing unlocks standard rate limits and the backfill finishes in ~1 min. (Recommended.)
2. **Self-throttle the script** to ≤10K TPM (~25 docs/min) with 429 backoff + resume. Slower but free without billing.

## Takeaway
Before running any bulk Voyage embed job, check the account's billing tab. Free token credit ≠ usable throughput until a payment method is attached. Always make the embed client robust to 429s (the rewritten `src/lib/server/embeddings.ts` now backoffs on 429).
