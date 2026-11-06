---
type: Learning
title: "BrowserClaw owns IPv4 :9222; harness Chrome lands on IPv6 — discover CDP WS URL via curl, not undici fetch"
description: "Discovered 2026-11-03 while doing CDP-based visual QA of `.archive/digital-products-repos.html`:"
tags: [browser-harness, cdp, chrome, qa, gotcha]
timestamp: "2026-11-03T14:23:44.268Z"
---

# BrowserClaw owns IPv4 :9222; harness Chrome lands on IPv6 — discover CDP WS URL via curl, not undici fetch

Discovered 2026-11-03 while doing CDP-based visual QA of `.archive/digital-products-repos.html`:

- **BrowserClaw (the user's app) listens on IPv4 `127.0.0.1:9222`.** A browser-harness Chrome started afterwards lands on IPv6 `[::1]:9222` — both are "port 9222" simultaneously. Use `netstat -ano | findstr :9222` to see both, inspect the PID command lines, and **never touch the BrowserClaw PID** — only the harness Chrome you launched yourself.
- **Node's undici `fetch` gets 404 from Chrome's DevTools HTTP endpoints** (`/json/version` etc.) even though `curl` succeeds — a header difference, not a server problem. Also, browser-harness's own health check chokes on `/json/version` 404.
- **Workaround that works**: discover the WebSocket debugger URL via `curl http://[::1]:9222/json/list`, pass the `webSocketDebuggerUrl` into a plain Node script, and drive CDP over Node 24's built-in `WebSocket`. No dependencies needed.
