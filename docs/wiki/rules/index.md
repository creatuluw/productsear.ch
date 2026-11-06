# Rules

_Reusable heuristics, guidelines, and conventions will be listed here._

- [Corroborate product→repo matches with multi-signal checks; stars never validate homepage/npm links](./corroborate-product-repo-matches-with-multi-signal.md) - Guideline
- [Sweep every render path when renaming display vocabulary](./sweep-every-render-path-when-renaming-display.md) - **Guideline:** When renaming display vocabulary on a SvelteKit surface, sweep **every render path**, not just visible body copy…
- [Keep ?view=llm surfaces free of human UI chrome](./keep-view-llm-surfaces-free-of-human-ui-chrome.md) - **Guideline:** Any site-wide chrome added to `src/routes/+layout.svelte` — footers, mascots, banners, badges — must be **hidden on `?view=llm`…
- [Reverse-engineer hosted component bundles into plain CSS, never add the dependency](./reverse-engineer-hosted-component-bundles-into.md) - **Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the React…
- [Every ?view=llm branch must render an LLM document — including no-parameter fallbacks](./every-view-llm-branch-must-render-an-llm-document.md) - **Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must return the…
- [Rewrite delimiter-dense code blocks wholesale via the write path](./rewrite-delimiter-dense-code-blocks-wholesale-via.md) - Guideline
- [Guard min-content width on wrapping-sensitive text](./guard-min-content-width-on-wrapping-sensitive-text.md) - **Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_app:`)…
- [Diagnose search misses stage-by-stage before tuning](./diagnose-search-misses-stage-by-stage-before.md) - Guideline
- [Instrument-grade design principles; avoid banned tells](./instrument-grade-design-principles-avoid-banned.md) - Guideline
- [Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in](./skip-html-sanitizer-for-server-owned-llm-output.md) - When rendering model output as HTML on the client (e.g. ask-mode answers parsed
- [Pool-then-rerank with graceful fallback for retrieval](./pool-then-rerank-with-graceful-fallback-for.md) - Guideline
- [Sanitize text at the embedding API boundary](./sanitize-text-at-the-embedding-api-boundary.md) - Guideline
- [Validate generated SQL inserts with a rollback-wrapped dry run against the live DB](./validate-generated-sql-inserts-with-a-rollback-wrapped-dry-r.md) - **Guideline:** Before declaring a generated/hand-written INSERT or migration SQL file ready to run, execute it against the real database inside a single `BEGIN;
- [Prepare and dry-run the rollback script before generating derived rows](./prepare-and-dry-run-the-rollback-script-before-generating-de.md) - **Guideline:** When a bulk data mutation against `te9_dev` is committed for real (no rollback wrapper), write and dry-run-verify the undo script **before** gene
- [Check the index before committing; use pathspec-scoped commits in repos with pre-staged changes](./check-the-index-before-committing-use-pathspec-scoped-commit.md) - **Guideline:** Before running `git commit` in any repo — especially auxiliary/external repos like `E:\skills.te9.dev` whose indexes accumulate unrelated pre-sta
