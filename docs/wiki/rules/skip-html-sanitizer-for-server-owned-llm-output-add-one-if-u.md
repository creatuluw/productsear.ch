---
type: Rule
title: Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in
description: When rendering model output as HTML on the client (e.g. ask-mode answers parsed
tags: [frontend, security, ask-mode, markdown]
timestamp: "2026-07-04T11:15:49.823Z"
---

# Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in

When rendering model output as HTML on the client (e.g. ask-mode answers parsed
with `marked`), an HTML sanitizer (DOMPurify) can be omitted **only when** the
rendered text originates entirely from a server-side call you control and the
only way to inject into it is the user's own query (self-XSS, which has no
attacker/third-party impact).

## When to apply
- Rendering LLM/agent completions to HTML on the client.

## When you MUST add a sanitizer
- The rendered text can include untrusted/user-submitted content (comments,
  titles, scraped pages, other users' data).
- The model output is influenced by third-party-retrieved context that could
  contain adversarial markup.

## Rationale
`marked` does not sanitize. Without DOMPurify the parsed HTML is injected raw.
For productsear.ch's `/api/ask`, the only attacker is the user themselves
(their query drives the answer), so self-XSS carries no cross-user risk. If
ask mode ever surfaces other users' bookmarks or scraped page content inside
the answer, add `isomorphic-dompurify` (or DOMPurify) before `marked` output
is bound to the DOM.

## Source
- `src/routes/+page.svelte` — renders `marked.parse(answer)` into `.md` block
- `decisions/` — no formal ADR; this rule documents the deliberate omission.
