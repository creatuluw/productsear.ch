---
type: Learning
title: pi reads project MCP config from .pi/mcp.json — root .mcp.json is ignored
description: "The gotcha (found 2026-11-06 while debugging why `/mcp` showed no servers):"
tags: [pi-harness, mcp, config, security]
timestamp: "2026-11-06T08:02:37.891Z"
---

# pi reads project MCP config from .pi/mcp.json — root .mcp.json is ignored

The gotcha (found 2026-11-06 while debugging why `/mcp` showed no servers):

- pi reads **project-level** MCP server config from **`.pi/mcp.json`** (inside the `.pi/` folder, alongside `prompts/` and `todos/`), per `docs/mcp.md`.
- A root-level **`.mcp.json`** at the repo root is the **Claude Code / Cursor convention** — pi never reads it. Config placed there is silently ignored; no error, `/mcp` just shows nothing.
- Changes to MCP config take effect after `/reload` (or a fresh session).
- Project MCP servers only load once project trust is granted; `pi mcp list` in a shell shows connection errors.

**Credential hygiene note:** the project config (`db-productsearch` → `mcp-postgres-server`) carries the Railway Postgres password in **plaintext inside the repo tree**. pi's docs recommend keeping credential-bearing servers in the **user-level** `~/.pi/agent/mcp.json` so secrets stay out of the repo. If this file ever moves to git tracking or the repo is shared, rotate the password and relocate the server config first.
