---
description: Pick the next work item from .changes/ and implement it end-to-end
argument-hint: "[item-id]"
changes-template: v7
---
# /next — work from the .changes folder

Target item: ${1:-next open item by priority}

You are working in a project that keeps its backlog in the `.changes/` folder.
Follow these steps exactly.

1. Read `.changes/index.json`. If it is missing or clearly stale (mentions
   files that do not exist, or omits files in `.changes/items/`), recompute
   it by scanning `.changes/items/*.md` and use that instead.
2. SELECT the next item: the target item above wins if it names a real
   item id; otherwise among items with `status: open`, pick the one with
   the lowest `priority` number; ties broken by earliest `created`. Skip
   items with `status: blocked`.
3. Optionally BUNDLE: if the selected item has `bundle_with` ids, or you see
   other open items that are clearly compatible (same files/area, one
   coherent change), you may take up to 2 additional items into this run.
   State the bundle and why. Never bundle `blocked` items.
4. ANNOUNCE: state the picked item id + title (and bundle, if any).
5. Set every picked item to `status: in-progress` (update only the
   `status` and `updated` fields in its frontmatter; preserve everything
   else, including unknown keys), then regenerate `.changes/index.json`.
6. IMPLEMENT the work described in the item's Requirements, meeting its
   Acceptance Criteria. Follow the project's existing conventions.
7. CLOSE each completed item: set `status: review` and `updated` (the
   developer's agent review gate decides when it becomes `done`). If an item
   turned out impossible or wrong, set it back to `status: open` (or
   `blocked` if waiting on something) and append a `## Notes` line
   explaining why.
8. RE-CLASSIFY each closed item: read its `archetype` and `surface`
   frontmatter and check them against what you ACTUALLY built. If the work
   drifted (a "feature" turned into a refactor, the surface moved), update
   those two fields in the item's frontmatter — values ONLY from
   `.changes/taxonomy.json`. If they still hold, leave them untouched.
9. LOG each completed item: create `.changes/logs/<ID>.md` (or, when the
   item id carries a user prefix like `ptw-AA0003`, the per-user folder
   `.changes/logs/ptw/ptw-AA0003.md`) with YAML
   frontmatter — `item`, `title`, `archetype`, `surface`, `date` (ISO-8601
   UTC), optional `agent` (your name) — and a body summarizing what
   changed (files, behavior). Use the item's re-checked `archetype` and
   `surface` from step 8 so log and item agree. If a run completed
   bundled items, write one log file per item and mention the bundle in
   each body.
10. CHAT each picked item: write `.changes/chats/<ID>.md` (per-user folder
   rule as for logs: `.changes/chats/ptw/ptw-AA0003.md`) — a distilled
   transcript of this conversation's work on that item. YAML frontmatter
   (`item`, `date` ISO-8601 UTC, `agent` = your name), body alternating:
   - `## User` — every developer message of this session VERBATIM, in order
     (starting with the /next prompt). Never paraphrase, never omit.
   - `## Agent` — your own turns compressed to what mattered for the result:
     key decisions and why, direction changes after a follow-up, progress
     milestones, final outcome. A few bullets per stretch — no tool
     narration, no code dumps.
   Rewrite the whole file at close (and after significant follow-ups) so it
   always covers the full conversation so far.
11. METRICS each picked item: write `.changes/llms/<ID>.json` (filename =
   the full item id, e.g. `.changes/llms/ptw-AA0003.json`) — session
   telemetry as ONE JSON object, no prose:
   {"task_id": "<ID>", "user_messages": <count of developer messages>,
   "llm_messages": <count of your turns>, "start_session": "<ISO-8601 UTC>",
   "end_session": "<ISO-8601 UTC>", "tokens_in": <input tokens>,
   "tokens_out": <output tokens>, "subject_tags": ["t1","t2","t3"],
   "files_changed": <count of existing files modified>,
   "new_files_created": <count of files created>,
   "diff_lines_added": <count>, "diff_lines_removed": <count>}.
   `subject_tags` is EXACTLY 3 short lowercase topic tags naming what the
   task was about (e.g. ["auth","jwt","login"]). Derive token counts
   from your own context display or best estimate; derive diff line counts
   from `git diff --stat` / `git diff --numstat` of this session's commits.
   Overwrite the file if it exists (one per task id).
12. Regenerate `.changes/index.json` a final time. Report: items closed,
   classifications re-checked or corrected, log, chat and metrics files
   written.

If a previous run left an item `in-progress` at step 2, prefer resuming it
before selecting a new one; if you cannot, set it back to `open` with a
`## Notes` line first. Never create files under `.changes/items/` — item
creation belongs to the developer's app. Never edit `.changes/taxonomy.json`.
