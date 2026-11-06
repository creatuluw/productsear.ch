---
type: Rule
title: Verify the serving process on a test port before trusting smoke tests
description: "**Guideline:** After any restart of a local `node build` preview server, verify what actually serves the test port `netstat -ano | findstr :<port>` (and, when a"
tags: [testing, ports, processes, debugging]
timestamp: "2026-11-06T14:18:55.035Z"
---

# Verify the serving process on a test port before trusting smoke tests

**Guideline:** After any restart of a local `node build` preview server, verify what actually serves the test port `netstat -ano | findstr :<port>` (and, when a kill is needed, positively identify the PID's command line — `node build` — before `taskkill //PID <pid> //T //F`; use `taskkill //PID` escaping in Git Bash). Never assume the newly-spawned server is the one answering requests: a stale listener silently wins the bind and the new process dies with EADDRINUSE, making freshly built changes look absent or misattributed. Check the spawned server's log for `EADDRINUSE` before concluding anything about a test result.

Applies to every local smoke-test / preview-server loop in this workspace.
