---
type: Learning
title: Walk item URLs were already stored, only human renderer ignored them
description: "Walk body items have carried `body.items[].url` in the DB all along (including the three live rows), but `+page.svelte` rendered `li.label` as plain text. The `"
tags: [feed, walk, svelte]
timestamp: "2026-11-18T15:31:18.651Z"
---

# Walk item URLs were already stored, only human renderer ignored them

Walk body items have carried `body.items[].url` in the DB all along (including the three live rows), but `+page.svelte` rendered `li.label` as plain text. The `?view=llm` twin already printed the URLs. So making items clickable needed no data migration — just a renderer fix.
