---
type: Learning
title: pi loads every standalone .md in .agents/skills/ as a skill named after its parent dir; slash commands live in .pi/prompts/
description: "Two related facts about how pi loads project-level agent config, discovered 2026-11-06 while fixing a `commands` collision warning:"
tags: [pi, skills, slash-commands, yaml, agent-config]
timestamp: "2026-11-06T08:10:11.416Z"
---

# pi loads every standalone .md in .agents/skills/ as a skill named after its parent dir; slash commands live in .pi/prompts/

Two related facts about how pi loads project-level agent config, discovered 2026-11-06 while fixing a `commands` collision warning:

## 1. Standalone `.md` files in `.agents/skills/` become skills named after their parent directory

pi treats every standalone `.md` file (not just `SKILL.md`) under `.agents/skills/` as a skill. A file **without `name:` frontmatter falls back to the parent directory name**. So `prompt.md`, `yo.md`, and `autoresearch.md` all inside `.agents/skills/commands/` each resolved to skill `"commands"` → collision, first-discovered wins, the rest skipped with a warning.

Loose `.md` files with **no frontmatter at all** (e.g. a README) are silently skipped — harmless.

## 2. Slash-command templates belong in `.pi/prompts/`, not `.agents/skills/`

Claude-Code-style command templates (`$ARGUMENTS`, "# /foo Command" titles) are **not skills** — pi's native home for project slash commands is `.pi/prompts/`. Each `.md` file there becomes `/filename`. Consequences:

- `prompt.md` → `/prompt`, `yo.md` → `/yo`, etc., with real `$ARGUMENTS` substitution they never had as skills.
- **Subfolders inside `.pi/prompts/` are not scanned** — safe place for reference docs (e.g. `references/PROMPT_ENGINEERING_GUIDE.md`) that shouldn't become bogus commands.
- Internal `@path` include references in command files must be updated when moving files.

## Related gotcha

Unquoted colons in frontmatter `description:` broke YAML parsing again — this time in a **prompt template** (`autoresearch.md`), not just SKILL.md (see [[skill-skill-md-description-must-quote-colons-to]]). The rule generalizes: quote any frontmatter `description:` containing `: `, in `.agents/skills/*/SKILL.md` *and* `.pi/prompts/*.md`.

Verification: pi's own loaders report `project commands`, `diagnostics`, and `skill collisions` — all clean after the fix (`/reload` to pick up).
