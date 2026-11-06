// ?view=llm builders: paste-ready markdown twins of each surface, prefixed
// with a compact usage preamble distilled from the skill doc.

import type { SearchResponse } from './search';

export function llmPreamble(currentUrl: string): string {
	return `# productsear.ch — semantic tool search

You are reading the LLM view of \`${currentUrl}\` — a curated corpus of 3.7k+
tools/libraries, each with purpose, how-to-use and when-to-use metadata.
This document is paste-ready reference data plus instructions.

## Search the API — any LLM can call it directly, right now

\`\`\`
GET https://productsear.ch/api/search?q=<2-4 word noun phrase>
\`\`\`

**Try it: <https://productsear.ch/api/search?q=llm>**

- No key, no auth — works from any LLM, agent, or script.
- Default output is JSON. For markdown (this format), add \`&format=md\` or send
  \`Accept: text/markdown\`.
- Query the problem shape with short noun phrases ("url to markdown", "ocr pdf",
  "rate limiter redis") — never full sentences.
- \`total\` is the honest count of strong matches; there is no padding.
- Full usage guide: <https://productsear.ch/skill.md>

## Instructions

1. Treat the entries below as search results: shortlist 2–4, don't trust snippets alone.
2. **Verify before adopting**: fetch each candidate URL and confirm it is working,
   maintained, and license-compatible. Snippets regularly describe abandoned projects.
3. Browse by archetype: \`/collections/<slug>\` (e.g. /collections/rag-search) lists
   what/how/when per entry. Append \`?view=llm\` to any page for this markdown form.
4. Decide per candidate: name, what it does, why (not) a fit — one line each.
`;
}

function fmtDate(iso: string | null): string {
	return iso ? iso.slice(0, 10) : '—';
}

function searchRows(res: SearchResponse): string[] {
	return res.results.map(
		(r, i) =>
			`${(res.page - 1) * res.pageSize + i + 1}. **${r.title}** — <${r.url}>\n` +
			`   - purpose: ${r.purpose ?? r.excerpt ?? '—'}\n` +
			`   - category: ${r.category ?? '—'}${r.tags ? ` · tags: ${r.tags}` : ''}\n` +
			`   - relevance: ${r.rerankScore?.toFixed(2) ?? '—'}`
	);
}

const NO_MATCHES = 'No strong matches. Rephrase as `[job-to-be-done] [tech/domain]`.';

export function searchLlmView(q: string, res: SearchResponse, tookMs: number): string {
	const head = [
		llmPreamble(`/ ?q=${encodeURIComponent(q)}`),
		'',
		`# search: "${q}"`,
		'',
		`${res.total} strong match${res.total === 1 ? '' : 'es'} (relevance floor applied) · ${tookMs}ms · page ${res.page} of ${Math.max(1, Math.ceil(res.total / res.pageSize))}`,
		''
	];
	if (res.results.length === 0) {
		return [...head, NO_MATCHES].join('\n');
	}
	return [...head, ...searchRows(res)].join('\n');
}

/** Compact markdown for GET /api/search (format=md or Accept: text/markdown). */
export function searchApiMd(q: string, res: SearchResponse, tookMs: number): string {
	const head = [
		`# productsear.ch — search results for "${q}"`,
		'',
		`${res.total} strong match${res.total === 1 ? '' : 'es'} (relevance floor applied) · ${tookMs}ms · page ${res.page} of ${Math.max(1, Math.ceil(res.total / res.pageSize))}`,
		'',
		'Shortlist 2–4, then **verify each URL before adopting** — snippets regularly describe',
		'abandoned projects. Refine with 2–4 word noun phrases, e.g. `ocr pdf`, `url to markdown`.',
		'Full usage guide: <https://productsear.ch/skill.md>',
		''
	];
	if (res.results.length === 0) {
		return [...head, NO_MATCHES].join('\n');
	}
	return [...head, ...searchRows(res)].join('\n');
}

export function archiveLlmView(
	rows: { title: string; url: string; category: string | null; archetypes: string[]; created: string | null }[],
	page: number,
	total: number,
	pageSize: number,
	last30 = false
): string {
	const head = [
		llmPreamble(last30 ? '/archive?last=30' : '/archive'),
		'',
		last30
			? '# archive — listings created in Raindrop in the last 30 days, newest first'
			: '# archive — all entries, newest first',
		'',
		`${total} entries · page ${page} of ${Math.max(1, Math.ceil(total / pageSize))}`,
		''
	];
	const body = rows.map(
		(r) =>
			`- ${fmtDate(r.created)} **${r.title}** — <${r.url}>\n` +
			`  ${r.archetypes.join(', ')}${r.category ? ` · raw: ${r.category}` : ''}`
	);
	return [...head, ...body].join('\n');
}

export function collectionsIndexLlmView(groups: { slug: string; name: string; n: number }[]): string {
	const head = [
		llmPreamble('/collections'),
		'',
		'# collections — the corpus by archetype',
		''
	];
	const body = groups.map((g) => `- ${g.name} (${g.n}) — /collections/${g.slug}`);
	return [...head, ...body].join('\n');
}

export function collectionsGroupLlmView(
	group: { slug: string; name: string; n: number },
	entries: {
		title: string;
		url: string;
		purpose: string | null;
		howToUse: string | null;
		whenToUse: string | null;
		category: string | null;
		created: string | null;
	}[]
): string {
	const head = [
		llmPreamble(`/collections/${group.slug}`),
		'',
		`# collections · ${group.name}`,
		'',
		`${group.n} entries`,
		''
	];
	const body = entries.map(
		(e) =>
			`## ${e.title}\n` +
			`- url: <${e.url}>\n` +
			`- what: ${e.purpose ?? '—'}\n` +
			`- how: ${e.howToUse ?? '—'}\n` +
			`- when: ${e.whenToUse ?? '—'}\n` +
			`- raw category: ${e.category ?? '—'} · added: ${fmtDate(e.created)}`
	);
	return [...head, ...body].join('\n');
}
