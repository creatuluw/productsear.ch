---
type: Learning
title: Git Bash mangles /PID-style flags in taskkill — use //PID escaping and verify the port is freed
description: "Discovered 2026-11-06 while killing an orphaned preview server on port 3199 (exact-PID kill, per the global no-name-kill rule):"
tags: [windows, git-bash, processes, tooling]
timestamp: "2026-11-06T12:58:48.342Z"
---

# Git Bash mangles /PID-style flags in taskkill — use //PID escaping and verify the port is freed

Discovered 2026-11-06 while killing an orphaned preview server on port 3199 (exact-PID kill, per the global no-name-kill rule):

In Git Bash on Windows, `taskkill /PID 7924 /T /F` **silently fails to kill the process** — Git Bash path-mangles the `/PID`-style flags into paths, so taskkill receives garbage arguments and the target keeps running (the command may even appear to succeed).

**The fix:** escape flags with double slashes in Git Bash:

```
taskkill //PID <pid> //T //F
```

**Always verify the kill took effect** — re-run `netstat -ano | findstr :<port>` (or check the PID is gone) before trusting that the port is free. The escaped-flags lesson generalizes to any Windows CLI invoked from Git Bash with `/FLAG`-style arguments.
