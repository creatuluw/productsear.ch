---
type: Learning
title: wiki_note_* auto-converts wikilinks to relative links — cross-folder references need path-qualified slugs
description: "Discovered 2026-11-06 while creating the [[utobo-email-transactional-email-service]] entity page and cross-linking it to the utobo sending-domain ADR in `docs/w"
tags: [wiki, okf, documentation, gotcha]
timestamp: "2026-11-06T13:42:08.406Z"
---

# wiki_note_* auto-converts wikilinks to relative links — cross-folder references need path-qualified slugs

Discovered 2026-11-06 while creating the [[utobo-email-transactional-email-service]] entity page and cross-linking it to the utobo sending-domain ADR in `docs/wiki/decisions/`.

**The gotcha:** `wiki_note_page` (and the other `wiki_note_*` tools) **auto-convert `[[wikilinks]]` to relative markdown links at write time**. Two failure modes when linking across folders:

- **Human-readable title-style wikilinks don't resolve at all** — e.g. `[[the utobo sending-domain ADR]]` is not a slug; the validator flags it as a broken link (W4).
- **Bare-slug wikilinks to other folders produce relative links that resolve wrong** — e.g. `[[utobo-sending-domain-dns-records]]` written in a `pages/entities/` file was converted to a link relative to that folder, so a target living two directories up (`../../decisions/...`) came out broken.

**The fix:** use **path-qualified slugs** for any cross-folder reference — `[[decisions/set-up-utobo-as-transactional-email-sender-for-productsear-c]]`, not `[[set up utobo as transactional email sender]]`. Same-folder links can stay bare.

**Working method:** after writing a page with wikilinks, run `wiki_validate` and read the actual written file (the transformation happens silently — the tool's input echoes don't show it); fix any W4 broken-link warnings with path-qualified slugs before declaring the page done. Pre-existing W2 long-filename warnings on tool-generated slugs are noise — leave them.

**Refinement (same day, while creating [The Drum feed](../pages/entities/the-drum-feed.md)):** the converter's cross-folder handling is also *inconsistent*, not just folder-sensitive — from a `pages/entities/` file, `[[pages/concepts/X]]` came out as a same-folder link (`./X.md`, folder dropped) and `[[decisions/X]]` got slash→dash slugified then truncated to 60 chars (`./decisions-X-trunc.md`); both broke. So path-qualified slugs are **necessary but not reliably sufficient**: after wiki_validate, hand-correct the generated relative links (`../../decisions/<slug>.md`, `../concepts/<slug>.md`, and fix wrong slugs like `collections-pages` vs the real `compendium-pages.md`) and re-run validate until W4 clears.
