---
type: Artifact
title: digital-products-repo index
description: digital-products-repo index
tags: [artifact, html, data-index, archive]
timestamp: "2026-11-03T14:24:20.995Z"
---

# digital-products-repo index

# digital-products-repo index

## What is it?

`.archive/digital-products-repos.html` — a self-contained (~1.2 MB), no-dependency HTML index mapping 4,206 digital products from `.archive/digital-products.csv` to their open-source GitHub repos, styled after the reference `E:\index.html` (warm-paper theme, client-side search, TOC pills, print styles).

## What it documents

- Final counts (2026-11-03): 4,206 products checked, 0 unchecked; **3,049 repos found** → 1,346 high-confidence + 1,703 "Likely (review)" + 1,157 no repo identified
- Each row carries the discovery method (direct URL / homepage / npm / PyPI / search), so confidence is auditable
- Built by [repo-scan-pipeline](../entities/repo-scan-pipeline.md) (`build-html.js`); match quality governed by [corroborate-product-to-repo-matches-with-multi-signal-checks](../../rules/corroborate-product-repo-matches-with-multi-signal.md)

## Details

- **Location**: `.archive/digital-products-repos.html`
- **Format**: single HTML file with an inline escaped-JSON payload (`</script>` in repo descriptions must be escaped — raw descriptions break the page); language-grouped sections; review-bucket separated from solid matches
- **QA**: smoke-tested headlessly via CDP (see [browserclaw-owns-ipv4-9222-harness-chrome-lands-on](../../learnings/browserclaw-owns-ipv4-9222-harness-chrome-lands-on.md))
- **Rebuild**: `node .archive/repo-scan/build-html.js [out.html]` from `state.json`

## Source

- Generated 2026-11-03 by `.archive/repo-scan/build-html.js` from `state.json`
