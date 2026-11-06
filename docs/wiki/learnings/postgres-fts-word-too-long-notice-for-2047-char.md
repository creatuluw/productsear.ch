---
type: Learning
title: Postgres FTS "word too long" NOTICE for >2047-char tokens is harmless
description: "When populating a `tsvector` / `search_tsv` column, Postgres may emit a NOTICE like:"
tags: [postgres, fts, embeddings, gotcha]
timestamp: "2026-07-04T10:54:34.586Z"
---

# Postgres FTS "word too long" NOTICE for >2047-char tokens is harmless

When populating a `tsvector` / `search_tsv` column, Postgres may emit a NOTICE like:

> word too long to be indexed

for any token longer than 2047 characters. This is **not an error** — it's an informational NOTICE. The index/row is still created; that one oversized token is just skipped.

We hit this during the 6000-char-content re-embed backfill of 2,277 bookmarks and the run completed `2277/2277` cleanly. Don't treat the NOTICE line as a failure when scanning script logs — check the final count.
