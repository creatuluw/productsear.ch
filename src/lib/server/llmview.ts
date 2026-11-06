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

// ── The Drum (feed) ─────────────────────────────────────────────────────────

interface FeedItemLike {
	id: string;
	type: string;
	publishedAt: string | null;
	createdAt: string;
	body: {
		headline: string;
		standfirst?: string;
		listing?: { id: number; title: string; url: string; domain: string | null; created?: string | null } | null;
		items?: Array<{ id?: number; label: string; note?: string; url?: string }>;
		paragraphs?: string[];
		question?: string;
	};
	signals: Record<string, unknown>;
}

interface DueInfoLike {
	due: boolean;
	nextType: string | null;
	lastDrawAt: string | null;
	nextDrawAt: string | null;
	cadenceHours: number;
	typeOrder: string[];
}

/** Markdown for the /feed drum surface — stream + rotation state. */
export function feedLlmView(items: FeedItemLike[], due: DueInfoLike): string {
	const head = [
		llmPreamble('/feed'),
		'',
		'# the drum — the corpus feed',
		'',
		`A feed of item types, one draw every ${due.cadenceHours}h (fixed round-robin). ` +
			`Last draw: ${due.lastDrawAt ? fmtDate(due.lastDrawAt) : 'never'} · ` +
			`next draw: ${due.nextDrawAt ? fmtDate(due.nextDrawAt) : 'due now'} (${due.due ? 'DUE' : 'waiting'}) · ` +
			`next type: ${due.nextType ?? '—'}.`,
		''
	];
	if (items.length === 0) {
		return [...head, 'The drum has not drawn yet.'].join('\n');
	}
	const body = items.map((item) => {
		const lines = [
			`## ${item.type} · ${fmtDate(item.publishedAt ?? item.createdAt)}`,
			`**${item.body.headline}**`
		];
		if (item.body.listing) {
			lines.push(
				`- listing: ${item.body.listing.title} — <${item.body.listing.url}> · stack: <https://productsear.ch/listings/${item.body.listing.id}>`
			);
		}
		if (item.body.standfirst) lines.push(`- ${item.body.standfirst}`);
		for (const p of item.body.paragraphs ?? []) lines.push(`- ${p}`);
		for (const li of item.body.items ?? []) {
			lines.push(`- ${li.label}${li.note ? ` (${li.note})` : ''}${li.url ? ` — <${li.url}>` : ''}`);
		}
		if (item.body.question) lines.push(`- question for the reader: ${item.body.question}`);
		return lines.join('\n');
	});
	return [...head, ...body].join('\n');
}

/** Markdown for a listing stack page — the listing, its feed items, its Walk. */
export function listingStackLlmView(stack: {
	listing: {
		id: number;
		title: string;
		url: string;
		domain: string | null;
		excerpt: string | null;
		created: string | null;
		archetypes: string[];
		purpose: string | null;
		howToUse: string | null;
		whenToUse: string | null;
	};
	items: FeedItemLike[];
	walk: Array<{ id: number; title: string; url: string; domain: string | null; distance: number }>;
}): string {
	const l = stack.listing;
	const head = [
		llmPreamble(`/listings/${l.id}`),
		'',
		`# listing · ${l.title}`,
		'',
		`- url: <${l.url}>${l.domain ? ` · domain: ${l.domain}` : ''}${l.created ? ` · added: ${fmtDate(l.created)}` : ''}`,
		`- archetypes: ${l.archetypes.length > 0 ? l.archetypes.join(', ') : '—'}`,
		`- what: ${l.purpose ?? '—'}`,
		`- how: ${l.howToUse ?? '—'}`,
		`- when: ${l.whenToUse ?? '—'}`,
		''
	];
	const onDrum = stack.items.length
		? [
				'## On the drum',
				'',
				...stack.items.map(
					(item) =>
						`- ${item.type} · ${fmtDate(item.publishedAt ?? item.createdAt)} — **${item.body.headline}**${
							item.body.standfirst ? ` · ${item.body.standfirst}` : ''
						}`
				),
				''
			]
		: [];
	const walk = stack.walk.length
		? [
				'## Keep walking — embedding nearest neighbors',
				'',
				...stack.walk.map(
					(n) =>
						`- ${n.title} — <https://productsear.ch/listings/${n.id}> · raw distance ${n.distance.toFixed(3)}`
				),
				''
			]
		: [];
	return [...head, ...onDrum, ...walk].join('\n');
}

/** Markdown for /feed/methodology — the drum's trust surface ("how this drum works"). */
export function methodologyLlmView(): string {
	const typeLines = [
		'- **One Save** — one listing, one paragraph, one question to the reader',
		'- **Target-User Pitch** — who a listing is for, voiced by a synthetic persona drafted from corpus analysis',
		'- **Two Futures** — your Tuesday without it vs. with it',
		'- **Ambition Path** — several listings chained into a route toward one ambition',
		'- **The Pulse** — archetype drift and rising domains from the save stream (the data section)',
		'- **Resurrections** — a save untouched for months gets a second life',
		'- **The Walk** — a trail of listings connected by raw embedding hops, no rerank',
		'- **The Tombola** — drawn from the last 10 saves, picked by corpus signals',
		'- **The Floor** — aggregated zero-result search themes; raw queries are never published',
		'- **Impress the Boss** — the artifact a listing produces for the role that benefits'
	];
	return [
		llmPreamble('/feed/methodology'),
		'',
		'# how this drum works',
		'',
		'The drum is the corpus narrating itself. Every card is machine-drafted from',
		'the saved corpus — embeddings, archetype classifications, analysis metadata,',
		'timestamps, and search-miss signals. No human writes the first version; a',
		'human curator can edit, gate, retract, or delete any card before or after it',
		'goes out.',
		'',
		'## Editorial honesty',
		'',
		'- Every card carries its **type tag** — the angle it takes on the corpus.',
		'- Pitch voices are **synthetic personas** drafted from analysis data, not human testimonials.',
		'- Impress-the-Boss artifacts carry an **origin tag** — described-from-analysis until real captures exist.',
		'- The Floor publishes **aggregated themes only**, never raw queries.',
		'- Draws run on a fixed round-robin, one card every 48h (admin-configurable), gated by the cadence clock.',
		'',
		'## The ten card types',
		'',
		...typeLines,
		''
	].join('\n');
}
