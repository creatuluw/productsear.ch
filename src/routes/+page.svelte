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

<main class="mx-auto max-w-3xl px-4 py-10">
	<header class="mb-8 text-center">
		<h1 class="text-3xl font-bold tracking-tight">productsear.ch</h1>
		<p class="text-[var(--color-muted)] mt-1">Semantic search over 2,270 bookmarks</p>
	</header>

	<div class="mb-4 flex justify-center gap-2">
		<button
			class="rounded-full px-4 py-1.5 text-sm font-medium transition"
			class:bg-accent={mode === 'search'}
			class:text-accent-fg={mode === 'search'}
			class:bg-surface={mode !== 'search'}
			onclick={() => setMode('search')}
		>
			<Search size={14} class="mr-1 inline-block" /> Search
		</button>
		<button
			class="rounded-full px-4 py-1.5 text-sm font-medium transition"
			class:bg-accent={mode === 'ask'}
			class:text-accent-fg={mode === 'ask'}
			class:bg-surface={mode !== 'ask'}
			onclick={() => setMode('ask')}
		>
			<Sparkles size={14} class="mr-1 inline-block" /> Ask
		</button>
	</div>

	<form onsubmit={onSubmit} class="mb-6">
		<input
			bind:value={query}
			oninput={onInput}
			placeholder={mode === 'search' ? 'Search bookmarks…' : 'Ask anything, e.g. "SaaS ideas from these packages"'}
			class="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base shadow-sm outline-none focus:border-[var(--color-accent)]"
		/>
	</form>

	{#if error_}
		<div class="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
			{error_}
		</div>
	{/if}

	{#if mode === 'search'}
		{#if tookMs !== null}
			<p class="mb-3 text-xs text-[var(--color-muted)]">
				{loading ? 'Searching…' : `${results.length} results in ${tookMs}ms`}
			</p>
		{/if}
		<ul class="space-y-3">
			{#each results as r (r.id)}
				<li class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
					<a href={r.url} target="_blank" rel="noopener" class="group">
						<div class="flex items-center gap-1 text-xs text-[var(--color-muted)]">
							<span>{r.domain ?? host(r.url)}</span>
							<ExternalLink size={11} class="opacity-0 transition group-hover:opacity-100" />
						</div>
						<h3 class="mt-0.5 font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
							{r.title}
						</h3>
					</a>
					{#if r.snippet}
						<p class="mt-1 text-sm text-[var(--color-text)] opacity-80">
							{@html r.snippet}
						</p>
					{/if}
					{#if r.purpose}
						<p class="mt-1.5 text-sm italic text-[var(--color-muted)]">{r.purpose}</p>
					{/if}
					{#if r.tags}
						<div class="mt-2 flex flex-wrap gap-1">
							{#each r.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 6) as tag, i (tag + i)}
								<span class="rounded-full bg-[var(--color-border)] px-2 py-0.5 text-xs">{tag}</span>
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else if loading || answer}
		<div class="prose-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
			{#if loading && !answer}
				<div class="flex items-center gap-2 text-sm text-[var(--color-muted)]">
					<Loader2 size={16} class="animate-spin" /> Thinking…
				</div>
			{/if}
			<div class="whitespace-pre-wrap text-sm leading-relaxed">
				{answer}{#if loading}<span class="animate-pulse">▋</span>{/if}
			</div>
			{#if askSources.length}
				<div class="mt-4 border-t border-[var(--color-border)] pt-3">
					<p class="mb-2 text-xs font-semibold uppercase text-[var(--color-muted)]">Sources</p>
					<ul class="space-y-1">
						{#each askSources as s, i (s.id)}
							<li>
								<a
									href={s.url}
									target="_blank"
									rel="noopener"
									class="text-sm text-[var(--color-accent)] hover:underline"
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
