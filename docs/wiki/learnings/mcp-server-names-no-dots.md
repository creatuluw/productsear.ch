---
type: Learning
title: MCP server names in .pi/mcp.json forbid dots — name them with letters/digits/_/- only
description: "The dot gotcha (found 2026-11-05): pi rejects MCP server names containing characters outside `[A-Za-z0-9_-]`. The project's `.pi/mcp.json` named its database se"
tags: [devops, pi-harness, mcp, config]
timestamp: "2026-11-06T08:02:49.022Z"
---

# MCP server names in .pi/mcp.json forbid dots — name them with letters/digits/_/- only

The dot gotcha (found 2026-11-05): pi rejects MCP server names containing characters outside `[A-Za-z0-9_-]`. The project's `.pi/mcp.json` named its database server after the domain — `db-productsear.ch` — and the `.` in `.ch` triggered:

```
Warning: MCP servers need attention:
   config: E:\productsear.ch\.pi\mcp.json: invalid server name "db-productsear.ch" (use letters, digits, "_" and "-")
```

Fix: rename to `db-productsearch`. Rule of thumb: derive MCP server names from the domain but strip dots (`db-productsearch`, `skills-te9-dev`), never copy the domain verbatim. After editing `.pi/mcp.json`, run `/reload` then `/mcp` to confirm all servers connect.
