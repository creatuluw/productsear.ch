---
id: AA0001
title: Sync search query to URL param and make search endpoint LLM-readable
status: open
priority: 2
archetype: feature
surface: app
bundle_with: []
created: 2026-08-24T20:35:11Z
updated: 2026-08-24T20:35:11Z
---
## Context
SvelteKit app (productsear.ch) over bookmarks. src/routes/+page.svelte runs search client-side via fetch('/api/search?q=...&limit=20'); query lives only in component state, URL never changes, so a query can't be shared. src/routes/api/search/+server.ts is an unauthenticated GET returning JSON {query, tookMs, count, results} — already fetchable by an LLM agent directly, but page URL (the thing a user shares) contains no query and SPA HTML shells don't expose results. Goal: put query in URL (?q=) for shareability and confirm/tune /api/search for LLM consumption.

## Requirements
- On load, read ?q= from URL and run search for it (debounced path reused)
- After each search run, sync query into URL ?q= via history.pushState/replaceState — no page reload
- Empty/cleared query removes ?q= from URL
- Direct visit to /?q=<encoded> shows results (client hydration path; no SSR requirement)
- Inspect /api/search: verify unauthenticated GET + JSON shape is LLM-agent-usable as-is
- If warranted, add optional ?format=md to /api/search returning plain-text/markdown results (title, url, snippet per hit); default remains JSON
- No behavior change to existing JSON response, limit cap (<=50), or 400 on >500 chars

## Acceptance Criteria
- npm run build passes (typecheck + svelte-check clean)
- Opening /?q=voyage+rate+limit renders results identical to typing that query
- Typing a new query updates the URL bar query param without reload; clearing input removes it
- Visiting a shared ?q= URL re-runs and displays the search
- curl '/api/search?q=x' returns prior JSON shape; with &format=md returns 200 markdown text list
- Zero new dependencies

## Notes
Files: src/routes/+page.svelte (query state, runSearch, onInput), src/routes/api/search/+server.ts (GET handler), src/routes/+page.server.ts (load for counts — untouched). LLM fetching page URL gets HTML shell, not results; if sharing-to-LLM is the goal, consider pointing users/LLMs at /api/search?q= or a format=md variant. Lazy rules: reuse existing runSearch/debounce, avoid new deps, minimal diff.
