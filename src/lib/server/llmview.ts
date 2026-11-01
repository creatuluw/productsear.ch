// ?view=llm builders: paste-ready markdown twins of each surface, prefixed
// with a compact usage preamble distilled from the skill doc.

import type { SearchResponse } from './search';

export function llmPreamble(currentUrl: string): string {
	return `> productsear.ch — semantic tool search (3.7k+ curated tools/libraries).
> API: \`GET /api/search?q=<problem-shape>\` → ${'`purpose`'}+${'`category`'} per result, relevance-floored.
> Query the problem shape ("url to markdown", "ocr pdf"), not sentences. Verify before adopting.
> This page: ${currentUrl} — paste it whole into your LLM collaboration.`;
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

export function compendiumIndexLlmView(groups: { slug: string; name: string; n: number }[]): string {
	const head = [
		llmPreamble('/compendium'),
		'',
		'# compendium — the corpus by archetype',
		''
	];
	const body = groups.map((g) => `- ${g.name} (${g.n}) — /compendium/${g.slug}`);
	return [...head, ...body].join('\n');
}

export function compendiumGroupLlmView(
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
		llmPreamble(`/compendium/${group.slug}`),
		'',
		`# compendium · ${group.name}`,
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
