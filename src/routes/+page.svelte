<script lang="ts">
	import { ExternalLink } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import LlmDoc from '$lib/components/LlmDoc.svelte';
	import WaveLoader from '$lib/components/WaveLoader.svelte';
	import InfoTip from '$lib/components/InfoTip.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';

	let { data } = $props();

	// structured data: WebSite + SearchAction (sitelinks searchbox) + WebApplication
	const homeJsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': 'https://productsear.ch/#website',
				url: 'https://productsear.ch/',
				name: 'productsear.ch',
				description:
					'Semantic search over a curated corpus of developer tools, digital products and open-source projects.',
				potentialAction: {
					'@type': 'SearchAction',
					target: {
						'@type': 'EntryPoint',
						urlTemplate: 'https://productsear.ch/?q={search_term_string}'
					},
					'query-input': 'required name=search_term_string'
				}
			},
			{
				'@type': 'WebApplication',
				'@id': 'https://productsear.ch/#app',
				name: 'productsear.ch',
				url: 'https://productsear.ch/',
				applicationCategory: 'SearchApplication',
				operatingSystem: 'Web',
				description:
					'Natural-language search over a curated corpus of developer tools, digital products and open-source projects.',
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
			}
		]
	};

	type SearchResult = {
		id: number;
		title: string;
		url: string;
		domain: string | null;
		snippet: string;
		purpose: string | null;
		tags: string | null;
		rerankScore: number | null;
	};

	const initialQ = page.url.searchParams.get('q') ?? '';
	const initialPage = Math.max(1, Number(page.url.searchParams.get('page') ?? 1) || 1);
	let query = $state(initialQ);
	let synced = { q: initialQ, page: initialQ ? initialPage : 1 };

	let results = $state<SearchResult[]>([]);
	let total = $state(0);
	let pageNum = $state(initialQ ? initialPage : 1);
	let poolLimited = $state(false);
	let loading = $state(false);
	let tookMs = $state<number | null>(null);
	let error_ = $state('');
	// system drawer: engine-room readout (vital signs + retrieval method) —
	// auto-opens while a search executes, auto-hides when results are returned
	let drawerOpen = $state(false);

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

	const examples = ['url to markdown', 'ocr pdf', 'agent framework', 'video editing tool'];

	// teach the interface: real queries this corpus can answer — kept from the corpus's own lore
	function syncUrl(push: boolean) {
		const q = query.trim();
		const p = new URLSearchParams();
		if (q) {
			p.set('q', q);
			if (pageNum > 1) p.set('page', String(pageNum));
		}
		if (q === synced.q && (q === '' || pageNum === synced.page)) return;
		synced = { q, page: q ? pageNum : 1 };
		const qs = p.toString();
		goto(qs ? `/?${qs}` : '/', { replaceState: !push, noScroll: true, keepFocus: true });
	}

	async function runSearch(push = false) {
		syncUrl(push);
		const q = query.trim();
		if (!q) {
			results = [];
			total = 0;
			tookMs = null;
			return;
		}
		loading = true;
		error_ = '';
		drawerOpen = true;
		try {
			const res = await fetch(
				`/api/search?q=${encodeURIComponent(q)}&page=${pageNum}`
			);
			if (!res.ok) throw new Error(await res.text());
			const data = (await res.json()) as {
				results: SearchResult[];
				total: number;
				page: number;
				poolLimited: boolean;
				tookMs: number;
			};
			results = data.results;
			total = data.total;
			poolLimited = data.poolLimited;
			tookMs = data.tookMs;
		} catch (e) {
			error_ = e instanceof Error ? e.message : String(e);
			results = [];
		} finally {
			loading = false;
			drawerOpen = false;
		}
	}

	function onInput() {
		if (debounce) clearTimeout(debounce);
		pageNum = 1;
		debounce = setTimeout(() => runSearch(), 250);
	}

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		pageNum = 1;
		runSearch(true);
	}

	function pickExample(ex: string) {
		query = ex;
		pageNum = 1;
		runSearch(true);
	}

	function setPage(n: number, e: MouseEvent) {
		e.preventDefault();
		pageNum = n;
		runSearch(true);
		// jump straight to the top so the latency gauge (wave loader) is in view while the page loads
		window.scrollTo({ top: 0, behavior: 'auto' });
	}

	// back/forward: adopt params from history and re-run
	$effect(() => {
		const q = page.url.searchParams.get('q') ?? '';
		const p = Math.max(1, Number(page.url.searchParams.get('page') ?? 1) || 1);
		if (q === synced.q && (q === '' || p === synced.page)) return;
		synced = { q, page: q ? p : 1 };
		query = q;
		pageNum = q ? p : 1;
		results = [];
		tookMs = null;
		error_ = '';
		if (q) runSearch();
	});

	onMount(() => {
		if (query.trim()) runSearch();
	});

	// ts_headline often echoes the title back; showing both is noise.
	// Suppress the snippet when it largely duplicates the title.
	function snippetOf(r: SearchResult): string {
		const strip = (t: string) => t.replace(/<[^>]+>/g, '').toLowerCase();
		const snip = strip(r.snippet);
		const title = strip(r.title);
		if (!snip) return '';
		if (title.includes(snip.slice(0, 40)) || snip.includes(title.slice(0, 40))) return '';
		return r.snippet;
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
		return `${String(d.getUTCFullYear())}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
	}

	const totalPages = $derived(Math.max(1, Math.ceil(total / 20)));

	const rowIn = (i: number) => ({
		y: reduceMotion ? 0 : 8,
		duration: reduceMotion ? 0 : 180,
		delay: reduceMotion ? 0 : Math.min(i * 35, 280),
		easing: cubicOut
	});
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') drawerOpen = false; }} />

<svelte:head>
	<title>productsear.ch — semantic tool search</title>
	<meta
		name="description"
		content={`Semantic search over ${data.bookmarkCount.toLocaleString('en-US')} hand-picked developer tools, digital products and open-source projects. Describe the problem — get listings that solve it, each with purpose, how and when metadata.`}
	/>
	<link rel="canonical" href="https://productsear.ch/" />
	<meta property="og:title" content="productsear.ch — semantic tool search" />
	<meta
		property="og:description"
		content="Describe the problem you are trying to solve — the corpus answers with listings that solve it."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://productsear.ch/" />
	<meta property="og:image" content="https://productsear.ch/api/og/home?v=1" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<JsonLd data={homeJsonLd} />
</svelte:head>

{#if data.llm}
		<LlmDoc md={data.llm} />
	{:else}
	<h1 class="sr-only">productsear.ch — semantic tool search</h1>
	<main class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<!-- the instrument's primary control -->
		<form onsubmit={onSubmit} class="mb-6" role="search">
			<div class="relative">
				<input
					bind:value={query}
					oninput={onInput}
					placeholder="search the listings — problem shape, not sentences"
					autocomplete="off"
					spellcheck="false"
					class="w-full border-0 border-b-2 border-ink bg-transparent py-3 pr-10 text-2xl font-medium tracking-[-0.01em] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint/70 focus:border-accent"
					style="caret-color: var(--color-accent)"
				/>
				{#if query}
					<button
						type="button"
						aria-label="clear query"
						onclick={() => {
							query = '';
							pageNum = 1;
							runSearch(true);
						}}
						class="hit absolute right-0 top-1/2 -translate-y-1/2 p-2 font-mono text-lg text-ink-faint transition-colors hover:text-ink"
					>×</button>
				{/if}
			</div>
		</form>


		{#if error_}
			<div class="mb-5 rounded-[var(--radius)] border border-danger/25 bg-danger/[0.06] px-4 py-3 text-sm text-danger">
				{error_}
			</div>
		{/if}

		<!-- the instrument narrates its own state (the busy signal lives in the latency gauge) -->
		{#if query && tookMs !== null && !loading}
			<p class="mb-3 break-words font-mono text-[11px] text-ink-soft">
				{total === 0
						? 'no strong matches'
						: `${total} strong match${total === 1 ? '' : 'es'}${poolLimited ? ' · candidate pool exhausted' : ' · stopped at the quality floor'}`}
				{#if tookMs !== null}<span class="text-ink-faint"> · {tookMs}ms</span>{/if}
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
							{String((pageNum - 1) * 20 + i + 1).padStart(2, '0')}
						</span>
						<div class="min-w-0">
							<a href={r.url} target="_blank" rel="noopener" class="block">
								<span class="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
									{r.domain ?? host(r.url)}
								</span>
								<ExternalLink
									size={10}
									class="ml-1 inline-block opacity-0 transition-opacity duration-150 group-hover:opacity-60"
								/>
								<h3
									class="mt-0.5 break-words font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-accent"
								>
									{r.title}
								</h3>
							</a>
							{#if snippetOf(r)}
								<p class="mt-1.5 break-words text-[15px] leading-relaxed text-ink-soft snippet">
									{@html snippetOf(r)}
								</p>
							{/if}
							{#if r.purpose}
								<p class="mt-1 break-words text-[13px] italic text-ink-faint">{r.purpose}</p>
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
							{r.rerankScore?.toFixed(2) ?? '—'}
						</span>
					</li>
				{/each}
			</ul>

			{#if totalPages > 1}
				<nav class="mt-8 flex items-center justify-center gap-3 font-mono text-xs" aria-label="pages">
					{#if pageNum > 1}
						<a
							href={`/?q=${encodeURIComponent(query)}${pageNum - 1 > 1 ? `&page=${pageNum - 1}` : ''}`}
							onclick={(e) => setPage(pageNum - 1, e)}
							class="hit rounded border border-ink/15 px-2.5 py-1 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
						>‹ prev</a>
					{/if}
					<span class="text-ink-faint">page {pageNum} / {totalPages}</span>
					{#if pageNum < totalPages}
						<a
							href={`/?q=${encodeURIComponent(query)}&page=${pageNum + 1}`}
							onclick={(e) => setPage(pageNum + 1, e)}
							class="hit rounded border border-ink/15 px-2.5 py-1 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
						>next ›</a>
					{/if}
				</nav>
			{/if}
		{:else if !query && !loading && tookMs === null}
			<p class="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">try</p>
			<div class="flex flex-wrap gap-2">
				{#each examples as ex (ex)}
					<button
						onclick={() => pickExample(ex)}
						class="hit rounded-full border border-ink/12 px-3 py-1.5 font-mono text-[13px] text-ink-soft transition-colors duration-150 hover:border-ink/35 hover:text-ink"
					>
						{ex}
					</button>
				{/each}
			</div>

			{#if data.drum?.items?.length}
				<section class="mt-12" in:fly={{ y: 8, duration: 240, delay: 120, easing: cubicOut }}>
					<div class="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
						<p class="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">the drum — latest</p>
						<a href="/feed" class="hit font-mono text-[11px] text-ink-faint transition-colors hover:text-accent">open the drum →</a>
					</div>
					<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{#each data.drum.items as card, i (card.id)}
							<div
								in:fly={{ y: 8, duration: 180, delay: 180 + Math.min(i * 60, 240), easing: cubicOut }}
								class="min-w-0 rounded-[10px] border border-ink/10 bg-surface px-5 py-4 transition-colors duration-150 hover:border-ink/25"
							>
								<span class="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
									{card.typeName}
								</span>
								<h3 class="mt-2.5 break-words text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">
									{#if card.listingId}
										<a href={`/listings/${card.listingId}`} class="transition-colors duration-150 hover:text-accent">{card.headline}</a>
									{:else}
										{card.headline}
									{/if}
								</h3>
								{#if card.standfirst}
									<p class="mt-1.5 line-clamp-2 break-words text-[13px] leading-relaxed text-ink-soft">{card.standfirst}</p>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/if}
		{:else if query && !loading && total === 0 && tookMs !== null}
			<div class="rounded-[var(--radius)] border border-ink/10 bg-surface px-5 py-4">
				<p class="text-[15px] text-ink-soft">
					No strong matches. Rephrase as
					<code class="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[13px] text-ink">[job-to-be-done] [tech/domain]</code>
					— e.g. <button class="text-accent underline underline-offset-2" onclick={() => pickExample('url to markdown')}>url to markdown</button>
					rather than a full sentence.
				</p>
			</div>
		{/if}
	</main>

	<!-- system drawer: the engine-room readout — vital signs + retrieval method.
		Opens while a search executes, hides when results return; the corner chip
		reopens it anytime. -->
	{#if drawerOpen}
		<aside
			id="system-drawer"
			role="region"
			aria-label="system readout"
			transition:fly={{ y: reduceMotion ? 0 : 80, duration: reduceMotion ? 0 : 220, easing: cubicOut }}
			class="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-canvas shadow-[0_-6px_24px_color-mix(in_oklab,var(--ink)_12%,transparent)]"
		>
			<div class="mx-auto max-w-[1400px] px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-10 lg:px-14">
				<div class="flex items-center justify-between">
					<p class="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">system</p>
					<button
						type="button"
						onclick={() => (drawerOpen = false)}
						aria-label="close system readout"
						class="hit rounded border border-ink/15 px-2 py-1 font-mono text-[11px] text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
					>▾ close</button>
				</div>

				<dl class="mb-8 grid grid-cols-2 rounded-[var(--radius)] border border-ink/10 md:grid-cols-5">
				<div class="border-b border-r border-ink/10 px-4 py-3 md:border-b-0">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
						<InfoTip text="Total searchable entries — every saved page with title, URL, and purpose/how/when metadata." align="left">listings</InfoTip>
					</dt>
					<dd class="mt-1.5 flex items-center gap-2 font-mono text-base text-ink lg:text-lg">
						<span class="status-dot" aria-hidden="true"></span>{data.bookmarkCount.toLocaleString()}
					</dd>
				</div>
				<div class="border-b border-ink/10 px-3 py-3 sm:px-4 md:border-b-0 md:border-r">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
						<InfoTip text="Listings created in Raindrop within the last 30 days — click to browse them with their creation dates.">last 30 days</InfoTip>
					</dt>
					<dd class="mt-1.5 font-mono text-base sm:text-lg">
						<a href="/archive?last=30" class="group/tile inline-flex items-baseline gap-1 font-mono text-ink transition-colors duration-150 hover:text-accent">
							+{data.recentCount.toLocaleString()}
							<span aria-hidden="true" class="text-[11px] text-ink-faint transition-transform duration-150 group-hover/tile:translate-x-0.5">→</span>
						</a>
					</dd>
				</div>
				<div class="border-b border-r border-ink/10 px-3 py-3 sm:px-4 md:border-b-0">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
						<InfoTip text="When the collection was last synced into the search database.">synced</InfoTip>
					</dt>
					<dd class="mt-1.5 font-mono text-base text-ink lg:text-lg">{fmtSynced(data.lastSynced)}</dd>
				</div>
				<div class="border-b border-ink/10 px-3 py-3 sm:px-4 md:border-b-0 md:border-r">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
						<InfoTip text="Share of entries enriched with purpose / how / when metadata by the analysis pass.">analyzed</InfoTip>
					</dt>
					<dd class="mt-1.5 font-mono text-base text-ink lg:text-lg">
						{Math.round((data.analyzedCount / Math.max(1, data.bookmarkCount)) * 100)}<span class="text-ink-faint">%</span>
					</dd>
				</div>
				<div class="col-span-2 min-w-0 px-3 py-3 sm:px-4 md:col-span-1">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
						<InfoTip text="Round-trip search time for your last query — retrieval, fusion, and rerank combined." align="right">latency</InfoTip>
					</dt>
					<dd class="mt-1.5 flex min-w-0 items-center font-mono text-base text-ink lg:text-lg">
						{#if loading}
							<WaveLoader />
						{:else}
							{tookMs !== null ? `${tookMs}ms` : '—'}
						{/if}
					</dd>
				</div>
			</dl>

				<p class="mt-3 font-mono text-[11px] text-ink-faint">
					<InfoTip text="Hybrid retrieval: vector similarity over Voyage embeddings fused with Postgres full-text match — reciprocal rank fusion merges both rankings." align="left">semantic + full-text</InfoTip>
					<span class="mx-1.5">·</span>
					<InfoTip text="Top candidates are re-scored against your query by a cross-encoder (Voyage rerank-2.5-lite) for the final ordering.">cross-encoder reranked</InfoTip>
					<span class="mx-1.5">·</span>
					<InfoTip text="Results below a calibrated relevance floor (0.45) are dropped as noise — counts are honest, never padded.">relevance-floored</InfoTip>
				</p>
			</div>
		</aside>
	{:else}
		<button
			type="button"
			onclick={() => (drawerOpen = true)}
			aria-expanded={drawerOpen}
			aria-controls="system-drawer"
			class="hit fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-30 flex items-center gap-1.5 rounded-full border border-ink/15 bg-canvas/90 px-3 py-1.5 font-mono text-[11px] text-ink-soft backdrop-blur transition-colors hover:border-ink/40 hover:text-ink"
		>
			system <span aria-hidden="true">▴</span>
		</button>
	{/if}{/if}

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
			box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-success) 45%, transparent);
		}
		70% {
			box-shadow: 0 0 0 7px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}
	.snippet :global(mark) {
		background: color-mix(in oklab, var(--color-signal) 22%, transparent);
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
