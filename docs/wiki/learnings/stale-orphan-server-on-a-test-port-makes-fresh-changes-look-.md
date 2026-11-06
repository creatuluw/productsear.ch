---
type: Learning
title: Stale orphan server on a test port makes fresh changes look missing — verify what serves the port first
description: "Discovered 2026-11-06 while verifying the new "last 30 days" homepage tile on a local production build:"
tags: [verification, debugging, local-dev, processes]
timestamp: "2026-11-06T12:58:48.342Z"
---

# Stale orphan server on a test port makes fresh changes look missing — verify what serves the port first

Discovered 2026-11-06 while verifying the new "last 30 days" homepage tile on a local production build:

An **orphaned preview server from an earlier session** was still holding the test port (3199), serving a **stale build**. The new code change looked "missing" on that server — the initial diagnosis ("the served doc differs from source") was environmental, not a code bug.

**The method:** when a freshly-built change doesn't appear on a local verification server, before debugging the code:

1. Identify what actually serves the port: `netstat -ano | findstr :<port>` → PID → `Get-CimInstance Win32_Process -Filter "ProcessId=<pid>"` (inspect `CommandLine` and start time).
2. Kill orphans by **exact PID only** (never by name — see the global no-Node-name-kill rule), then re-verify on a clean server.

Symptom tells: served output matches an *older* version of the code, and your recent edits are absent from an otherwise-working page.
