---
type: Learning
title: "LLM usage skill lives outside the repo (E:\skills.te9.dev\productsear.ch\SKILL.md) and must stay in sync"
description: The fact
tags: [skill-md, sync, llms-view]
timestamp: "2026-11-01T00:50:46.877Z"
---

# LLM usage skill lives outside the repo (E:\skills.te9.dev\productsear.ch\SKILL.md) and must stay in sync

## The fact

The repo contains **no copy** of the LLM-facing usage guide for the search API. It lives at `E:\skills.te9.dev\productsear.ch\SKILL.md` — query patterns, triage/verify workflow, and limits (including "20 results per page; there is no pagination").

## Gotchas

- That limits line goes **stale** when the redesign ships pagination — updating SKILL.md is an explicit part of the shipping step.
- After the redesign the guide is dual-homed: served at `productsear.ch/skill.md` and distilled into the llms-view preamble. Any change to search API behavior (pagination, result counts) must be reflected in **three places**: SKILL.md, the `/skill.md` route, and the preamble.

## Source

- `E:\skills.te9.dev\productsear.ch\SKILL.md` (external to this repo)
