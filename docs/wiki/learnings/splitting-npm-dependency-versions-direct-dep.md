---
type: Learning
title: "Splitting npm dependency versions: direct dep for the new, pinned deps nest auto"
description: When different versions of a package must coexist (npm hoists only ONE version to top-level node_modules), declare the newer one as a direct dependency — packag
tags: [npm, dependency-management, zod]
timestamp: "2026-11-06T14:18:49.894Z"
---

# Splitting npm dependency versions: direct dep for the new, pinned deps nest auto

When different versions of a package must coexist (npm hoists only ONE version to top-level node_modules), declare the newer one as a direct dependency — packages with a pinned dependency get their version nested under themselves, while packages with a peer dep on the top-level resolve the hoisted one. E.g. zod@4 direct + @ai-sdk packages pinning zod@3 → clean split. Don't install just the version a lib needs as a direct dep when a peer-dep'd consumer still needs the old one.
