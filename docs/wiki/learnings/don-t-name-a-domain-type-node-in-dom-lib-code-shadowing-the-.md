---
type: Learning
title: Don't name a domain type Node in DOM-lib code — shadowing the global bites
description: With `lib.dom` in the tsconfig (SvelteKit default), declaring your own `interface Node` / `type Node` shadows the global DOM `Node`. Wherever both concepts touc
tags: [[typescript, naming, gotcha, feed]]
timestamp: "2026-11-06T20:27:00.787Z"
---

# Don't name a domain type Node in DOM-lib code — shadowing the global bites

With `lib.dom` in the tsconfig (SvelteKit default), declaring your own `interface Node` / `type Node` shadows the global DOM `Node`. Wherever both concepts touch a file (DOM APIs, events, generic tree code) the shadowing produces confusing type errors that look unrelated to your code.

**Convention set 2026-11-06:** name domain graph/trail node types with a domain prefix — the Walk generator's embedding-trail node is `WalkNode` (`src/lib/server/feed/generators/walk.ts`) for exactly this reason. Applies to any new AST/graph/tree type in this repo.
