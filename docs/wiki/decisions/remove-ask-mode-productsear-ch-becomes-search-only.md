---
type: Decision
title: Remove Ask mode — productsear.ch becomes search-only
description: Context
tags: [redesign, ask-mode, deprecation, scope]
status: accepted
timestamp: "2026-11-01T00:50:46.876Z"
---

# Remove Ask mode — productsear.ch becomes search-only

## Context

productsear.ch shipped with two modes: search (hybrid retrieval) and Ask (streaming RAG answers via `GET /api/ask`). During the P2 redesign interview (2026-11-01, 5 questions, closed with the seven-frontier playback), the product was reframed as a **terminal-instrument corpus browser** in the host0/clawrun register — researchers and developers doing known-goal lookups, with search as the single primary action.

## Choice

Remove Ask mode entirely in the redesign: no streaming chat UI, and the `/api/ask` endpoint is retired. The site becomes search-only (plus the archive and compendium surfaces).

## Alternatives considered

- **Keep Ask alongside search** — rejected: dilutes the instrument focus, mixes two mental models (browse vs. converse), and keeps the chat-stack maintenance burden (provider key, streaming, sanitizer rule).
- **Keep the endpoint, hide the UI** — rejected: a dead, unmaintained public surface.

## Rationale

The confirmed audience answer (researchers/developers, desktop-first, known-goal lookups) makes search the only primary action worth optimizing; the instrument register calls for honest, cutoff results rather than generated answers.

## Consequences

- `src/routes/api/ask/` and its UI go away; the [[api-ask-endpoint]] entity is deprecated.
- Chat provider env (`OPENAI_API_KEY`, `CHAT_BASE_URL`) becomes unnecessary for the site.
- Stale references at shipping time: overview/glossary mention Ask mode, the promo-video artifact features "streaming Ask mode".
- Recorded at the P2 closing playback; the P3 pattern one-pager is the next approval gate before implementation.
