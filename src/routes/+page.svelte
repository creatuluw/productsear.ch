<script lang="ts">
	import { ExternalLink, Loader2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { marked } from 'marked';

	marked.setOptions({ gfm: true, breaks: true });

	let { data } = $props();

	type Source = {
		id: number;
		title: string;
		url: string;
		domain: string | null;
		rrf: number;
	};
	type SearchResult = {
		id: number;
		title: string;
		url: string;
		domain: string | null;
		excerpt: string | null;
		tags: string | null;
		purpose: string | null;
		category: string | null;
		rrf: number;
		snippet: string;
	};

	// query/mode are URL-managed: ?q=…&mode=ask — init from URL, sync back on change.
	// `synced` mirrors the last params we wrote ourselves, so the effect below only
	// reacts to external navigation (back/forward), not our own goto.
	const initialQ = page.url.searchParams.get('q') ?? '';
	const initialMode = page.url.searchParams.get('mode') === 'ask' ? 'ask' : 'search';
	let query = $state(initialQ);
	let mode = $state<'search' | 'ask'>(initialMode);
	let synced = { q: initialQ, mode: initialMode };

	let results = $state<SearchResult[]>([]);
	let answer = $state('');
	let askSources = $state<Source[]>([]);
	let loading = $state(false);
	let tookMs = $state<number | null>(null);
	let error_ = $state('');

	let debounce: ReturnType<typeof setTimeout> | null = null;
	let reduceMotion = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = mq.matches;
		const update = () => (reduceMotion = mq.matches);
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	});

	// teach the interface: real queries this corpus can answer
	const examples = [
		'voyage rate limit backfill',
		'cross-encoder rerank',
		'csrf origin adapter-node',
		'raindrop sync mirror'
	];

	// keep URL in sync with query/mode. push=true adds a history entry (submit/example),
	// replace (typing, mode switch) keeps history clean.
	function syncUrl(push: boolean) {
		const q = query.trim();
		if (q === synced.q && mode === synced.mode) return;
		synced = { q, mode };
		const p = new URLSearchParams();
		if (q) p.set('q', q);
		if (mode === 'ask') p.set('mode', 'ask');
		const qs = p.toString();
		goto(qs ? `/?${qs}` : '/', { replaceState: !push, noScroll: true, keepFocus: true });
	}

	// back/forward: adopt params from history and re-run
	$effect(() => {
		const q = page.url.searchParams.get('q') ?? '';
		const m = page.url.searchParams.get('mode') === 'ask' ? 'ask' : 'search';
		if (q === synced.q && m === synced.mode) return;
		synced = { q, mode: m };
		query = q;
		mode = m;
		results = [];
		answer = '';
		askSources = [];
		tookMs = null;
		error_ = '';
		if (q) m === 'search' ? runSearch() : runAsk();
	});

	onMount(() => {
		if (query.trim()) mode === 'search' ? runSearch() : runAsk();
	});

	async function runSearch(push = false) {
		syncUrl(push);
		const q = query.trim();
		if (!q) {
			results = [];
			tookMs = null;
			return;
		}
		loading = true;
		error_ = '';
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=20`);
			if (!res.ok) throw new Error(await res.text());
			const data = (await res.json()) as { results: SearchResult[]; tookMs: number };
			results = data.results;
			tookMs = data.tookMs;
		} catch (e) {
			error_ = e instanceof Error ? e.message : String(e);
			results = [];
		} finally {
			loading = false;
		}
	}

	async function runAsk(push = false) {
		syncUrl(push);
		const q = query.trim();
		if (!q) return;
		loading = true;
		error_ = '';
		answer = '';
		askSources = [];
		try {
			const res = await fetch('/api/ask', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ q })
			});
			if (!res.ok || !res.body) throw new Error(await res.text());

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const sep = buffer.indexOf('__SOURCES__');
				if (sep !== -1) {
					answer = buffer.slice(0, sep);
					const raw = buffer.slice(sep + '__SOURCES__'.length).trim();
					const parsed = JSON.parse(raw) as Source[];
					askSources = parsed;
					buffer = '';
					break;
				}
				answer = buffer;
			}
		} catch (e) {
			error_ = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	function onInput() {
		if (mode !== 'search') return; // ask runs on submit only
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(runSearch, 250);
	}

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (mode === 'search') runSearch(true);
		else runAsk(true);
	}

	function setMode(m: 'search' | 'ask') {
		mode = m;
		results = [];
		answer = '';
		askSources = [];
		tookMs = null;
		error_ = '';
		syncUrl(false);
	}

	function pickExample(ex: string) {
		if (mode !== 'search') setMode('search');
		query = ex;
		runSearch(true);
	}

	function host(url: string): string {
		try {
			return new URL(url).host;
		} catch {
			return url;
		}
	}

	function fmtSynced(iso: string | null): string {
		if (!iso) return '—';
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return '—';
		const hh = String(d.getUTCHours()).padStart(2, '0');
		const mm = String(d.getUTCMinutes()).padStart(2, '0');
		return `${hh}:${mm} UTC`;
	}

	const rowIn = (i: number) => ({
		y: reduceMotion ? 0 : 8,
		duration: reduceMotion ? 0 : 180,
		delay: reduceMotion ? 0 : Math.min(i * 35, 280),
		easing: cubicOut
	});
</script>

<svelte:head><title>productsear.ch — semantic</title></svelte:head>

<main class="mx-auto max-w-[1400px] px-6 py-14 sm:px-10 lg:px-14">
	<!-- Instrument readout: the signature. Live, transparent state = trust + proficiency. -->
	<dl
		class="mb-10 grid grid-cols-2 overflow-hidden rounded-[var(--radius)] border border-ink/10 sm:grid-cols-4"
	>
		<div class="border-b border-ink/10 px-4 py-3 sm:border-b-0 sm:border-r">
			<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">Corpus</dt>
			<dd class="mt-1.5 flex items-center gap-2 font-mono text-lg text-ink">
				<span class="status-dot" aria-hidden="true"></span>{data.bookmarkCount.toLocaleString()}
			</dd>
		</div>
		<div class="border-b border-ink/10 px-4 py-3 sm:border-b-0 sm:border-r">
			<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">Indexed</dt>
			<dd class="mt-1.5 font-mono text-lg text-ink">{fmtSynced(data.lastSynced)}</dd>
		</div>
		<div class="border-r border-ink/10 px-4 py-3">
			<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">Latency</dt>
			<dd class="mt-1.5 font-mono text-lg text-ink">{tookMs !== null ? `${tookMs}ms` : '—'}</dd>
		</div>
		<div class="px-4 py-3">
			<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">Pipeline</dt>
			<dd class="mt-1.5 font-mono text-lg text-ink">hybrid<span class="text-ink-faint"> · </span>rerank</dd>
		</div>
	</dl>

	<header class="mb-8">
		<p class="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">// semantic search</p>
		<h1 class="mt-2.5 text-[2rem] font-semibold leading-none tracking-[-0.025em] text-ink">
			productsear.ch
		</h1>
	</header>

	<!-- mode toggle: lowercase mono pills -->
	<div class="mb-6 flex gap-2">
		<button
			onclick={() => setMode('search')}
			class="rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors duration-150 {mode ===
			'search'
				? 'bg-ink text-canvas'
				: 'border border-ink/15 text-ink-soft hover:border-ink/35 hover:text-ink'}"
		>
			search
		</button>
		<button
			onclick={() => setMode('ask')}
			class="rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors duration-150 {mode ===
			'ask'
				? 'bg-ink text-canvas'
				: 'border border-ink/15 text-ink-soft hover:border-ink/35 hover:text-ink'}"
		>
			ask
		</button>
	</div>

	<form onsubmit={onSubmit} class="mb-8">
		<input
			bind:value={query}
			oninput={onInput}
			placeholder={mode === 'search' ? 'Search bookmarks…' : 'Ask anything…'}
			autocomplete="off"
			spellcheck={mode === 'search' ? false : true}
			class="w-full border-0 border-b-2 border-ink bg-transparent px-0 py-3 text-2xl font-medium tracking-[-0.01em] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint/70 focus:border-signal"
			style="caret-color: var(--color-signal)"
		/>
		<div class="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-faint">
			<span>
				{mode === 'search' ? 'semantic + full-text · ranked' : 'grounded answer over top results'}
			</span>
			<span>⏎ {mode}</span>
		</div>
	</form>

	{#if error_}
		<div
			class="mb-5 rounded-[var(--radius)] border border-danger/25 bg-danger/[0.06] px-4 py-3 text-sm text-danger"
		>
			{error_}
		</div>
	{/if}

	{#if mode === 'search'}
		{#if tookMs !== null}
			<p class="mb-3 font-mono text-[11px] text-ink-faint">
				{loading ? 'searching…' : `${results.length} result${results.length === 1 ? '' : 's'}`}
			</p>
		{/if}

		{#if results.length > 0}
			<ul class="grid grid-cols-1 gap-x-12 xl:grid-cols-2">
				{#each results as r, i (r.id)}
					<li
						transition:fly={rowIn(i)}
						class="group grid grid-cols-[2rem_1fr_auto] gap-4 rounded-[var(--radius)] border-t border-ink/10 px-3 py-5 transition-colors duration-150 hover:bg-ink/[0.018]"
					>
						<span class="pt-1 font-mono text-[11px] text-ink-faint">
							{String(i + 1).padStart(2, '0')}
						</span>
						<div class="min-w-0">
							<a href={r.url} target="_blank" rel="noopener" class="block">
								<span
									class="font-mono text-[11px] uppercase tracking-[0.06em] text-accent"
								>
									{r.domain ?? host(r.url)}
								</span>
								<ExternalLink
									size={10}
									class="ml-1 inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-60"
								/>
								<h3
									class="mt-0.5 font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-accent"
								>
									{r.title}
								</h3>
							</a>
							{#if r.snippet}
								<p class="mt-1.5 text-[15px] leading-relaxed text-ink-soft snippet">
									{@html r.snippet}
								</p>
							{/if}
							{#if r.purpose}
								<p class="mt-1 text-[13px] italic text-ink-faint">{r.purpose}</p>
							{/if}
							{#if r.tags}
								<div class="mt-2.5 flex flex-wrap gap-1.5">
									{#each r.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 6) as tag, ti (tag + ti)}
										<span
											class="rounded border border-ink/10 px-1.5 py-0.5 font-mono text-[10.5px] text-ink-faint"
											>{tag}</span
										>
									{/each}
								</div>
							{/if}
						</div>
						<span class="pt-1.5 text-right font-mono text-[11px] text-ink-faint">
							{r.rrf.toFixed(2)}
						</span>
					</li>
				{/each}
			</ul>
		{:else if !query && !loading && tookMs === null}
			<p class="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">try</p>
			<div class="flex flex-wrap gap-2">
				{#each examples as ex (ex)}
					<button
						onclick={() => pickExample(ex)}
						class="rounded-full border border-ink/12 px-3 py-1.5 font-mono text-[13px] text-ink-soft transition-colors duration-150 hover:border-ink/35 hover:text-ink"
					>
						{ex}
					</button>
				{/each}
			</div>
		{/if}
	{:else if loading || answer}
		<div class="rounded-[var(--radius)] border border-ink/10 bg-surface px-5 py-5">
			{#if loading && !answer}
				<div class="flex items-center gap-2 font-mono text-sm text-ink-soft">
					<Loader2 size={15} class="animate-spin" /> thinking…
				</div>
			{/if}
			<div class="md text-[15px] leading-relaxed text-ink">
				{#if answer}{@html marked.parse(answer)}{/if}{#if loading}<span class="text-signal">▋</span>{/if}
			</div>
			{#if askSources.length}
				<div class="mt-5 border-t border-ink/10 pt-4">
					<p class="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">Sources</p>
					<ul class="space-y-1">
						{#each askSources as s, i (s.id)}
							<li>
								<a
									href={s.url}
									target="_blank"
									rel="noopener"
									class="font-mono text-[13px] text-accent transition-colors hover:text-accent-hover hover:underline"
								>
									[{i + 1}] {s.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</main>

<style>
	.status-dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-success);
		box-shadow: 0 0 0 0 var(--color-success);
		animation: ps-pulse 2.6s ease-out infinite;
	}
	@keyframes ps-pulse {
		0% {
			box-shadow: 0 0 0 0 oklch(0.55 0.11 165 / 0.45);
		}
		70% {
			box-shadow: 0 0 0 7px oklch(0.55 0.11 165 / 0);
		}
		100% {
			box-shadow: 0 0 0 0 oklch(0.55 0.11 165 / 0);
		}
	}
	/* result snippets: highlight matches without a banned side-stripe */
	.snippet :global(mark) {
		background: oklch(0.68 0.14 70 / 0.22);
		color: var(--color-ink);
		border-radius: 2px;
		padding: 0 1px;
	}
	@media (prefers-reduced-motion: reduce) {
		.status-dot {
			animation: none;
		}
	}
</style>
