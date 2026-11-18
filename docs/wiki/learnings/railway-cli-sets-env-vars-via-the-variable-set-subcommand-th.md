---
type: Learning
title: Railway CLI sets env vars via the `variable set` subcommand — the --set flag is legacy
description: "**The gotcha (found 2026-11-12 while wiring `DRUM_APPROVAL_SECRET` across environments):** on Railway CLI 5.x (5.62.1), setting env vars goes through the **`var"
tags: [railway, cli, env, secrets, github-actions]
timestamp: "2026-11-12T15:59:03.147Z"
---

# Railway CLI sets env vars via the `variable set` subcommand — the --set flag is legacy

**The gotcha (found 2026-11-12 while wiring `DRUM_APPROVAL_SECRET` across environments):** on Railway CLI 5.x (5.62.1), setting env vars goes through the **`variable set` subcommand**, not a flag:

```bash
railway variable set KEY=VALUE -s <service>   # canonical form
railway variables set KEY=VALUE               # alias works too
```

The old flag form (`railway variables --set "KEY=VALUE"`) still exists but is marked **legacy** ("use 'variable set' instead") and failed in practice when invoked with quoted pairs from Git Bash.

GitHub-side counterpart for Actions secrets: `gh secret set NAME --body "..."` (requires the `repo` scope + admin). The full shared-secret wiring across all three surfaces used: `railway variable set` + `gh secret set` + local `.env` edit — the value must match everywhere when GitHub-minted tokens must verify against the Railway-served production endpoint.
