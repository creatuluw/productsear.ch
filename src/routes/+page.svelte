<script lang="ts">
	import { Search, Sparkles, ExternalLink, Loader2 } from 'lucide-svelte';

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

	let query = $state('');
	let mode = $state<'search' | 'ask'>('search');

	let results = $state<SearchResult[]>([]);
	let answer = $state('');
	let askSources = $state<Source[]>([]);
	let loading = $state(false);
	let tookMs = $state<number | null>(null);
	let error_ = $state('');

	let debounce: ReturnType<typeof setTimeout> | null = null;

	async function runSearch() {
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

	async function runAsk() {
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
		if (mode === 'search') runSearch();
		else runAsk();
	}

	function setMode(m: 'search' | 'ask') {
		mode = m;
		results = [];
		answer = '';
		askSources = [];
		tookMs = null;
		error_ = '';
	}

	function host(url: string): string {
		try {
			return new URL(url).host;
		} catch {
			return url;
		}
	}
</script>

<svelte:head><title>productsear.ch — semantic bookmark search</title></svelte:head>

<main class="mx-auto max-w-3xl px-4 py-12">
	<header class="mb-9 text-center">
		<h1
			class="mb-2 text-balance text-3xl font-medium tracking-[-0.02em] text-ink md:text-[2.75rem] md:leading-[1.05]"
		>
			productsear.ch
		</h1>
		<p class="tracking-wide text-muted">Semantic search over 2,270 bookmarks</p>
	</header>

	<div class="mb-5 flex justify-center gap-2">
		<button
			class="rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors duration-200"
			class:bg-primary={mode === 'search'}
			class:text-primary-fg={mode === 'search'}
			class:bg-cream={mode !== 'search'}
			class:text-ink={mode !== 'search'}
			onclick={() => setMode('search')}
		>
			<Search size={14} class="mr-1 inline-block" /> Search
		</button>
		<button
			class="rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors duration-200"
			class:bg-primary={mode === 'ask'}
			class:text-primary-fg={mode === 'ask'}
			class:bg-cream={mode !== 'ask'}
			class:text-ink={mode !== 'ask'}
			onclick={() => setMode('ask')}
		>
			<Sparkles size={14} class="mr-1 inline-block" /> Ask
		</button>
	</div>

	<form onsubmit={onSubmit} class="mb-6">
		<input
			bind:value={query}
			oninput={onInput}
			placeholder={mode === 'search'
				? 'Search bookmarks…'
				: 'Ask anything, e.g. "SaaS ideas from these packages"'}
			class="chrome-border w-full rounded-xl border border-ink/10 bg-cream/[0.5] px-4 py-3.5 text-base text-ink placeholder:text-muted/70 shadow-sm outline-none transition focus:bg-cream/80"
		/>
	</form>

	{#if error_}
		<div class="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
			{error_}
		</div>
	{/if}

	{#if mode === 'search'}
		{#if tookMs !== null}
			<p class="mb-3 font-mono text-xs tracking-wide text-muted">
				{loading ? 'Searching…' : `${results.length} results in ${tookMs}ms`}
			</p>
		{/if}
		<ul class="space-y-3">
			{#each results as r (r.id)}
				<li
					class="group rounded-lg border border-ink/10 bg-cream/[0.03] p-4 transition-all duration-200 hover:-translate-y-px hover:border-ink/15 hover:bg-cream/[0.07]"
				>
					<a href={r.url} target="_blank" rel="noopener">
						<div class="flex items-center gap-1 font-mono text-xs tracking-wide text-muted">
							<span>{r.domain ?? host(r.url)}</span>
							<ExternalLink size={11} class="opacity-0 transition group-hover:opacity-100" />
						</div>
						<h3
							class="mt-1 font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-primary"
						>
							{r.title}
						</h3>
					</a>
					{#if r.snippet}
						<p class="mt-1.5 text-sm leading-relaxed text-ink/80">
							{@html r.snippet}
						</p>
					{/if}
					{#if r.purpose}
						<p class="mt-1.5 text-sm italic text-muted">{r.purpose}</p>
					{/if}
					{#if r.tags}
						<div class="mt-2.5 flex flex-wrap gap-1">
							{#each r.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 6) as tag, i (tag + i)}
								<span
									class="rounded-full border border-ink/10 bg-ink/[0.03] px-2 py-0.5 font-mono text-xs tracking-wide text-muted"
									>{tag}</span
								>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else if loading || answer}
		<div class="chrome-border rounded-xl border border-ink/10 bg-cream/[0.03] p-5">
			{#if loading && !answer}
				<div class="flex items-center gap-2 font-mono text-sm tracking-wide text-muted">
					<Loader2 size={16} class="animate-spin" /> Thinking…
				</div>
			{/if}
			<div class="whitespace-pre-wrap text-sm leading-relaxed text-ink">
				{answer}{#if loading}<span class="animate-pulse text-primary">▋</span>{/if}
			</div>
			{#if askSources.length}
				<div class="mt-4 border-t border-ink/10 pt-3">
					<p class="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
						Sources
					</p>
					<ul class="space-y-1">
						{#each askSources as s, i (s.id)}
							<li>
								<a
									href={s.url}
									target="_blank"
									rel="noopener"
									class="font-mono text-sm tracking-wide text-primary hover:underline"
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
