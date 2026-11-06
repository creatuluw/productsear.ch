---
type: Learning
title: SvelteKit normalizes event.url for data requests — always early-return on event.isDataRequest in handle hooks
description: "**The gotcha (found 2026-11-01 while debugging a prod 500 on `/?view=llm`):** in a SvelteKit `handle` hook, `event.url` for a client-router data fetch (`/__data"
tags: [sveltekit, hooks, content-negotiation, gotcha]
timestamp: "2026-11-01T01:52:54.642Z"
---

# SvelteKit normalizes event.url for data requests — always early-return on event.isDataRequest in handle hooks

**The gotcha (found 2026-11-01 while debugging a prod 500 on `/?view=llm`):** in a SvelteKit `handle` hook, `event.url` for a client-router data fetch (`/__data.json?...`) is **normalized to the route path** — pathname shows `/`, not `/__data.json`. The llms-view negotiation hook therefore matched its `/` branch and answered the router's data request with `text/markdown`; SvelteKit's client router then `JSON.parse`-failed on `# products…` and rendered its 500 error page. One bug, two symptoms (console JSON.parse error + 500 at `/?view=llm`).

**The fix:** any request interception in `src/hooks.server.ts` must early-return before touching data requests:

```ts
if (event.isDataRequest) return resolve(event);
```

**Symptom signature to recognize:** `SyntaxError: Unexpected token '#', "# …" is not valid JSON` at `JSON.parse` in the client bundle + SvelteKit's 500 page on a URL that curl works fine on → a hook is answering a `__data.json` request with non-JSON.
