---
type: Learning
title: All human searches flow through /api/search
description: The homepage search is a client-side fetch to `GET /api/search` (not a server load), so instrumenting that one endpoint covers all human searches. The homepage'
tags: [search, api]
timestamp: "2026-11-18T15:50:53.908Z"
---

# All human searches flow through /api/search

The homepage search is a client-side fetch to `GET /api/search` (not a server load), so instrumenting that one endpoint covers all human searches. The homepage's `+page.server.ts` `?view=llm&q=` branch is the separate agent path, and `?view=llm` must stay excluded from 'web' tagging.
