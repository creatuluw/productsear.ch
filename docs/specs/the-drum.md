# The Drum — productsear.ch feed spec

**Status:** converged (brainstorm Q15-A, 2026-11-06) · **Next step:** implementation plan
**Origin:** 15-turn diverge/converge brainstorm; decisions logged per turn (see `docs/wiki/decisions/feed-round-*`)

---

## 1. Identity

- **Name:** The Drum — the mechanic is the masthead. The drum opens every draw; the mascot (product-search) turns the handle.
- **Concept:** a feed of *item types* — corpus-drafted posts clustered around listings, each showing from a different angle how a listing can change or enrich a life and its ambitions. Not a blog: every claim has a receipt (the saved listing), every post is generated from corpus data (embeddings, archetypes, analysis fields, repo-scan data, timestamps).
- **Voice:** corpus-drafted (Q1-A). Synthetic persona voices for pitches; human fingerprint comes from the editorial gate, not the writing.

## 2. Surfaces & placement

| Surface | Behavior |
|---|---|
| `/feed` | canonical home of The Drum; linked in nav |
| Homepage | center space (below TRY chips) shows the **3 latest feed cards**; they **disappear when a search starts** |
| Listing stack page | the depth surface — all feed items about a listing, "keep walking" continuation at the end |
| Listing item page (draft) | system places automated/drafted results here for admin review |

- Stream + stack architecture (Q3-C): the stream drives return visits; stacks drive depth.

## 3. Cadence & ordering

- **Volume:** 1 item every 2 days — a **setting in the admin console** (Q8).
- **Order:** fixed round-robin across the 11 types (Q13-A); canonical sequence is a launch detail, admin-configurable.
- **The Drum countdown** ("next draw in 31:22:08") on cards + `/feed` header — the appointment mechanic (Q11).
- **The Backlog** (Q13): drafts are generated per type when their draw comes up; pre-launch seeding so day one feels lived-in. Items needing no approval publish automatically.

## 4. The 11 item types

| # | Type | Angle | Generation source | Notes |
|---|------|-------|-------------------|-------|
| 1 | **One Save** | daily habit anchor | one listing + why-it-mattered paragraph + reader question | email-sized, screenshot-shaped |
| 2 | **Target-User Pitch** | motivation | analysis `who` field → persona pitch | synthetic voices (Q2-A); helps target users motivate each other |
| 3 | **Two Futures** | real life, emotion | "your Tuesday without it vs. with it" micro-story | before/after life snapshots |
| 4 | **Ambition Path** | ambitions | archetype + semantic clusters → multi-listing route | paths/maps share better than steps |
| 5 | **The Pulse** | 20% data surprise | archetype drift, repo inactivity (obituaries), rising domains | weekly; reads like market intelligence |
| 6 | **Receipt cards** | share primitive | claim + proof (listing + 2 nearest neighbors) | server-rendered card in riso/instrument identity |
| 7 | **Resurrections** | emotion (guilt/hope) | saves untouched 300+ days | date query + draft; cheapest type |
| 8 | **The Walk** | serendipity | embedding-hop trail, 3–5 listings | also a stack-page mechanic ("keep walking →") |
| 9 | **The Tombola** | new arrivals, whimsy | draw from last 10 saves; **corpus-derived scoring** (Q9-B): archetype drift + Pulse signals pick the winner | the mascot's raffle drum moment |
| 10 | **The Floor** | 20% transparency | aggregated search misses below relevance floor (0.45) | themes only, never raw queries (privacy-safe by construction) |
| 11 | **Impress the Boss** | professional proof | actual artifact/output a listing produces, framed for a job role | artifacts: hybrid + origin tags (Q11-D) — real when feasible, sourced/mocked otherwise, always labeled |

**Criteria mapping:** 80% novel primitives = the types, stack/stream, Walk, Tombola · sharing = Receipt cards + Bluesky · rotation coverage = Two Futures (real life), Ambition Path (ambitions), Impress the Boss (professional), Resurrections/Tombola (emotion) · tech insight = every type is listing-anchored · 20% surprise = The Pulse, The Floor.

## 5. Editorial workflow

1. Pipeline drafts the item → results land on the item page.
2. **Inline editor** on every post — admin edits/adds in place (Q13).
3. **Per-item approval toggle** in admin (Q12) — admin decides which items gate.
4. Publish: gated items after approval; ungated items auto-publish.
5. **The Backlog** pre-seeds the queue so cadence never stalls.

Admin console owns: cadence setting, per-item approvals, feature toggles, the queue.

## 6. Trust & attribution

- Every card carries its **type tag**.
- One **methodology page** ("how this Drum works") explains drafts are corpus-derived, no human wrote the first version (Q10-B).
- Artifact cards always carry an **origin tag** (real / sourced / illustrative).
- Synthetic pitches use persona voices without per-card stamps; the methodology page carries the honesty load.

## 7. Sharing & distribution

- **Receipt cards**: server-rendered share images (claim + proof) — the OG preview doubles as the artifact.
- **Bluesky share button** is the v1 share surface (Q5); copy-image/link + other networks parked (phase 2).
- **The Digest**: recurring email via utobo (Q12) — latest items since last send + drum countdown. **Dark by default**: UI, mechanics, and state are admin-toggled, off at launch.

## 8. Data model sketch

App-owned tables (pattern: `bookmark_archetypes`), Postgres `te9_dev`:

- `feed_items` — `id`, `type` (slug of the 11), `listing_id` (nullable; The Walk/Pulse may aggregate), `body` (jsonb, per-type payload), `status` (`draft` | `published`), `requires_approval` (bool), `published_at`, `signals` (jsonb — generation provenance), `created_at`.
- `feed_settings` — singleton: `cadence_hours` (default 48), `digest_enabled` (default false), round-robin `type_order` (array).
- Sharing/digest state rides on existing tables (utobo config stays external).

Never write to read-only mirror tables (`bookmarks`, `bookmark_content`, `bookmark_analysis`) — read them, write app-owned only.

## 9. Phase 2 (parked, not v1)

- **Accounts** (better-auth, already in stack) → rotation personalization (Q4: B now, C later), **Marginalia** (reader notes on listings), **Confessions** (reader submission issue), share-surface expansion (copy-image/link, more networks).
- Origin card concept (stack provenance header) — pitched turn 9, never verdicted; revisit with stacks in implementation.

## 10. Open launch details

- Canonical round-robin sequence (admin-configurable at launch).
- Methodology page copy.
- Default-on vs dark for each feed feature (Digest is dark by default; the rest presumed on).
- Receipt card visual spec (riso/instrument identity, OKLCH tokens only).

---

**Goal check (original criteria):** feed users return to and share ✓ · 80% corpus-native, uncopyable primitives ✓ · share-designed items ✓ · emotion/real-life/improvement/ambition rotation ✓ · tech & capability insights ✓ · 20% unexpected data-driven content ✓.
