// ?view=llm builders: paste-ready markdown twins of each surface, prefixed
// with a compact usage preamble distilled from the skill doc.

import type { SearchResponse } from './search';

export function llmPreamble(currentUrl: string): string {
	return `# productsear.ch — semantic tool search

You are reading the LLM view of \`${currentUrl}\` — a curated corpus of 3.7k+
tools/libraries, each with purpose, how-to-use and when-to-use metadata.
This document is paste-ready reference data plus instructions.

## Instructions

1. Treat the entries below as search results: shortlist 2–4, don't trust snippets alone.
2. **Verify before adopting**: fetch each candidate URL and confirm it is working,
   maintained, and license-compatible. Snippets regularly describe abandoned projects.
3. Search deeper at any time: \`GET https://productsear.ch/api/search?q=<problem-shape>\`
   — 2–4 word noun phrases ("url to markdown", "ocr pdf"), never full sentences.
   \`total\` is the honest count of strong matches; there is no padding.
4. Browse by archetype: \`/collections/<slug>\` (e.g. /collections/rag-search) lists
   what/how/when per entry. Append \`?view=llm\` to any page for this markdown form.
5. Decide per candidate: name, what it does, why (not) a fit — one line each.
`;
}

function fmtDate(iso: string | null): string {
	return iso ? iso.slice(0, 10) : '—';
}

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
		return [...head, 'No strong matches. Rephrase as `[job-to-be-done] [tech/domain]`.'].join('\n');
	}
	const rows = res.results.map(
		(r, i) =>
			`${(res.page - 1) * res.pageSize + i + 1}. **${r.title}** — <${r.url}>\n` +
			`   - purpose: ${r.purpose ?? r.excerpt ?? '—'}\n` +
			`   - category: ${r.category ?? '—'}${r.tags ? ` · tags: ${r.tags}` : ''}\n` +
			`   - relevance: ${r.rerankScore?.toFixed(2) ?? '—'}`
	);
	return [...head, ...rows].join('\n');
}

export function archiveLlmView(
	rows: { title: string; url: string; category: string | null; archetypes: string[]; created: string | null }[],
	page: number,
	total: number,
	pageSize: number
): string {
	const head = [
		llmPreamble('/archive'),
		'',
		`# archive — all entries, newest first`,
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
