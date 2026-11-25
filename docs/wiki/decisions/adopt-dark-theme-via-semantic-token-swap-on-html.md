---
type: Decision
title: Adopt dark theme via semantic token swap on html.dark (reverses earlier deferral)
description: Context
tags: [theming, dark-mode, design-system, css, tailwind]
status: accepted
timestamp: "2026-11-06T19:17:28.285Z"
---

# Adopt dark theme via semantic token swap on html.dark (reverses earlier deferral)

## Context

The [instrument-grade design decision](shift-visual-design-to-instrument-grade-precision.md) explicitly deferred dark mode as a "future mode". Meanwhile, components had accumulated hardcoded colors (`text-white`, `bg-white`, raw `oklch(... / alpha)` values in InfoTip, WaveLoader, homepage pulse/mark, admin/auth buttons), which made any theme flip impossible without a sweep.

## The choice

Dark theme is **adopted** (commit `c06dfe4`, 2026-11-06), implemented as a **class-driven semantic token swap**, not per-component `dark:` utilities:

- All colors are semantic vars (`--canvas`, `--ink`, `--accent`, …). Light values live in `:root`, dark values in `html.dark` (green-tinted neutrals ~hue 165; accent lightened to `oklch(0.72 0.15 264.2)` so #0021FF stays AA-legible on dark). One class on `<html>` flips the entire site — every surface (search, listings, collections, llms views, admin) adapts automatically.
- `@theme inline` maps Tailwind utilities to the vars; the `inline` keyword is required so utilities resolve at the element rather than freezing the `:root` light palette.
- Pre-paint inline script in `src/app.html` applies stored `localStorage.theme` (else OS `prefers-color-scheme`) before first paint — no flash — and syncs the `theme-color` meta (light `#F9FBFA`, dark `#1A2221`).
- Header toggle in `src/routes/+layout.svelte` (sun/moon, `aria-pressed`) flips the class, persists to `localStorage`, re-syncs the meta.
- `@custom-variant dark` is wired to the class, so `dark:` utilities remain available if ever needed.

## Alternatives considered

- **Tailwind `dark:` utilities per component** — rejected: duplicates every color decision across dozens of files and drifts from the token system.
- **Media-query-only (no toggle)** — rejected: users should be able to override OS preference; the toggle is cheap once tokens exist.
- **Svelte-level theme state / re-render** — rejected: CSS var swap is instant, SSR-safe, and needs no hydration to take effect.

## Rationale

Token swap converts dark mode from a per-component chore into a one-line class flip; it also forced the healthy cleanup of all hardcoded colors. The deferral in the instrument-grade ADR is thereby reversed.

## Consequences

- **Every future color must go through semantic tokens** — hardcoded `oklch`/`white`/`black` reintroduces light-only bugs (see the companion rule).
- Raw alpha/tints must be derived via `color-mix(in oklab, var(--token) N%, transparent)` rather than literal alpha colors.
- `color-scheme` is set per theme, so native scrollbars/inputs follow automatically.
- Accent contrast on dark required changing admin/auth buttons from `text-white` to theme-aware `text-canvas`.
