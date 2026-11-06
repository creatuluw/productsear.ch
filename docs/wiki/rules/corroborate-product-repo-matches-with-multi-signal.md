---
type: Rule
title: Corroborate product→repo matches with multi-signal checks; stars never validate homepage/npm links
description: Guideline
tags: [data-quality, entity-matching, github-api, classification]
timestamp: "2026-11-03T14:23:34.639Z"
---

# Corroborate product→repo matches with multi-signal checks; stars never validate homepage/npm links

## Guideline

Any bulk automated product→repo (or bookmark→repo, name→entity) match must be **corroborated by multiple independent signals** before being labelled high-confidence; demote failures to a review bucket rather than deleting them. Signals used in `build-html.js` (`qualityOk()`): owner-name match, repo `homepage` ↔ product domain, description↔title-excerpt overlap, stars ≥ 30 — with **method-specific thresholds**.

**Stars must never corroborate homepage-derived or registry-derived links on their own.** Popular third-party repos are high-star, which is exactly why they get linked in site footers and "built with X" sections.

## When it applies

Any fuzzy name-matching task against GitHub (or similar registries): CSV enrichment, corpus analysis, OSS discovery. Especially single-token product names ("Rube", "Buttondown"), which collide with random personal repos.

## Evidence (measured on digital-products.csv, 2026-11-03)

- Homepage scans linked **third-party** repos: Buttondown → `react/react` (closed-source SaaS!), Botpress → `js-cookie`, MGX → `MetaGPT` — 40 of 248 homepage matches were junk.
- Raw GitHub name search matched random personal repos for single-token names (`Allysonroberson/allyson`, ArcDPS plugins).
- After re-classification: raw 3,049 matches → 1,346 high-confidence + 1,703 review; manual sampling confirmed demoted items were exactly the junk spotted by eye.
