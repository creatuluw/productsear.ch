---
type: Learning
title: Skill SKILL.md description must quote colons to avoid YAML nested-mapping errors
description: "In `.agents/skills/*/SKILL.md`, a plain-scalar `description:` value containing `: ` (colon-space — e.g. from embedded text like `Triggers:` or `Use when:`) caus"
timestamp: "2026-07-04T11:15:21.125Z"
---

# Skill SKILL.md description must quote colons to avoid YAML nested-mapping errors

In `.agents/skills/*/SKILL.md`, a plain-scalar `description:` value containing `: ` (colon-space — e.g. from embedded text like `Triggers:` or `Use when:`) causes pi's loader to reject the file with `Nested mappings are not allowed in compact mappings at line 2, column 14`. The same happens for unquoted values containing embedded `"..."`.

**Fix:** wrap the `description` value in single quotes and strip inner double-quotes. Single quotes are safe because these descriptions never contain `'`.

**Two other loader gotchas seen in the same pass:**
- `name:` must be lowercase a-z, 0-9, hyphens only — `name: Course Creator` fails ("invalid characters").
- Duplicate `name:` values across skill dirs collide; the first one found wins and the rest are silently skipped. Give each variant a unique `name:` (e.g. `deep-research-v2`, `deep-research-v3`) so all load.

Run pi's skill-list check after editing frontmatter to confirm all skills load.
