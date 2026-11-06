// The LLM usage skill, served at /skill.md (host0 pattern) and distilled into
// the ?view=llm preamble. Kept in sync with E:\skills.te9.dev\productsear.ch\SKILL.md
// — this copy is the served source of truth for the site.

export const SKILL_MD = `# productsear.ch — semantic tool search

Find named, working solutions (libraries, packages, SaaS, patterns) for a
concrete problem — before hand-rolling code or picking the first Google hit.

## Quick start

\`\`\`bash
curl -s "https://productsear.ch/api/search?q=<urlencoded query>" --max-time 20
\`\`\`

No API key, no auth. JSON is the default output; add \`&format=md\` (or send
\`Accept: text/markdown\`) to get the same results as paste-ready markdown.
Each result: \`title\`, \`url\`, \`domain\`, \`excerpt\`,
\`purpose\` (what it does), \`category\`, \`tags\`, \`rerankScore\` (0–1 relevance).

## Query pattern (the important part)

Query **the problem shape**, not the marketing name — short noun phrases work
best (2–4 words):

- \`url to markdown\` — converters/readers
- \`ocr pdf\` — document extraction
- \`rate limiter redis\` — middleware

Bad queries: full sentences, code snippets, error messages. If results are
weak, rephrase as \`[job-to-be-done] [tech/domain]\`.

## Honest results

Results are reranked by a cross-encoder and **cut at a relevance floor**: the
\`total\` field is the honest count of strong matches. If \`total\` is small,
refine the query — the padding has been removed on purpose.

Pagination: 20 per page, \`&page=N\` (1-based, \`count\`/\`total\` tell you the range).

## Workflow

1. **Search** — 1–3 query variants (synonyms, different angles)
2. **Triage** — read \`purpose\` + \`category\`; shortlist 2–4 candidates
3. **Verify** — fetch candidate URLs to confirm: working, maintained, license
4. **Decide** — one line per option: name, what it does, why (not) a fit

Verification is mandatory — snippets regularly describe abandoned projects.

## Limits & pacing

- No key, no documented rate limit; observed ~1.5s latency
- ≤6 queries per task, ≤2 in parallel — refine, don't spam
- 20 results per page; refine the query rather than paging past weak matches

## Other surfaces

- \`/archive?page=N\` — every entry, newest first (JSON or ?view=llm markdown)
- \`/collections\` — the corpus grouped by ~30 archetypes (AI agent frameworks,
  RAG & search, web scraping, video & motion, …), each entry with what it
  does, how to use it, and when to use it
- Append \`?view=llm\` to any page for paste-ready markdown of its content
`;
