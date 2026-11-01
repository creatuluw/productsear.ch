# Rules

_Reusable heuristics, guidelines, and conventions will be listed here._
- [Sanitize text at the embedding API boundary](./sanitize-text-at-the-embedding-api-boundary.md) - Guideline
- [Pool-then-rerank with graceful fallback for retrieval](./pool-then-rerank-with-graceful-fallback-for-retrieval.md) - Guideline
- [Skip HTML sanitizer for server-owned LLM output; add one if untrusted input flows in](./skip-html-sanitizer-for-server-owned-llm-output-add-one-if-u.md) - When rendering model output as HTML on the client (e.g. ask-mode answers parsed
- [Instrument-grade design principles; avoid banned tells](./instrument-grade-design-principles-avoid-banned-tells.md) - Guideline
- [Diagnose search misses stage-by-stage before tuning](./diagnose-search-misses-stage-by-stage-before-tuning.md) - Guideline
- [Guard min-content width on wrapping-sensitive text](./guard-min-content-width-on-wrapping-sensitive-text.md) - **Guideline**: wide monospace faces (Martian Mono is ~15px/char at 18px) and unbreakable tokens (repo-style titles like `owner/deepseek_ocr_app:`) set large **m
- [Rewrite delimiter-dense code blocks wholesale via the write path](./rewrite-delimiter-dense-code-blocks-wholesale-via-the-write-.md) - Guideline
- [Every ?view=llm branch must render an LLM document — including no-parameter fallbacks](./every-view-llm-branch-must-render-an-llm-document-including-.md) - **Guideline:** On any route honoring `?view=llm`, *every* code path — including the fallback branch where search params are absent — must return the LLM markdow
- [Reverse-engineer hosted component bundles into plain CSS, never add the dependency](./reverse-engineer-hosted-component-bundles-into-plain-css-nev.md) - **Guideline:** When a design reference is a hosted component bundle (21st.dev CDN, React component previews, similar), do **not** add the React dependency or po
