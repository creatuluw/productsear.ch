---
type: Rule
title: Attribute build failures before fixing; never touch a concurrent session's in-progress work
description: "**Guideline:** When a whole-project check (`npm run build`, typecheck) fails in this repo, attribute the errors **before** treating your own work as broken — an"
tags: [multi-session, build, verification, collaboration, vite]
timestamp: "2026-11-06T13:55:47.391Z"
---

# Attribute build failures before fixing; never touch a concurrent session's in-progress work

**Guideline:** When a whole-project check (`npm run build`, typecheck) fails in this repo, attribute the errors **before** treating your own work as broken — and never touch a concurrent session's half-done code to unbreak the build.

This repo is regularly worked by multiple concurrent sessions (orca/foreman siblings, parallel pi sessions). A failure in files you didn't change — e.g. an `adminExtensions` shorthand-property bug inside another session's in-progress `(admin)` route work — is not yours to fix:

- **Diagnose ownership first**: map failing file paths against your own diff (`git status`, your touched-file list) before diagnosing your code.
- **Never edit, fix, or revert another session's WIP** — you collide with its author mid-write and can destroy in-progress intent. Leave it alone and let its owner finish.
- **Verify your own surfaces via the dev server**: the SvelteKit/Vite dev server compiles lazily per-request, so routes you own can be exercised in dev even while the full production build fails on unrelated WIP. Defer the "full build green" check until the other session's work lands.

Rationale/evidence: 2026-11-06 — build failed with an `adminExtensions` shorthand bug in `(admin)` routes owned by a concurrent session; the correct move was to decline touching it and verify own surfaces via the lazily-compiling dev server.
