---
type: Learning
title: Railpack (Railway build driver) requires a start command
description: "Railpack is Railway's default build driver (v0.30.0 at time of writing). It infers the start command for a Node app by checking, in order:"
timestamp: "2026-07-04T11:10:17.110Z"
---

# Railpack (Railway build driver) requires a start command

Railpack is Railway's default build driver (v0.30.0 at time of writing). It infers the start command for a Node app by checking, in order:

1. A `"start"` script in `package.json`
2. A `"main"` field in `package.json` pointing to an entry file
3. An `index.js` or `index.ts` in the project root

If none are present the build fails with `✖ No start command detected`. Having only a `"build"` script is not enough.

**For SvelteKit + `@sveltejs/adapter-node`**: the build emits `build/index.js`, so add this script to `package.json`:

```json
"scripts": {
  "start": "node build"
}
```

Static sites can instead set `RAILPACK_SPA_OUTPUT_DIR` to the built-files directory.

The fix that unblocked the Railway deploy was simply adding the `start` script — Railpack then runs `npm install` → `npm run build` → `node build`.
