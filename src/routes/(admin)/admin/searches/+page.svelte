<script lang="ts">
	import { Search } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function fmtTime(iso: string): string {
		return iso.slice(5, 16).replace('T', ' ');
	}
</script>

<header class="mb-8">
	<div class="flex items-center gap-3">
		<span class="text-accent"><Search size={22} /></span>
		<div>
			<h1 class="font-mono text-base font-semibold tracking-tight">searches</h1>
			<p class="font-mono text-[11px] text-ink-faint">
				what people are searching for — every search lands in te9_dev.search_logs
			</p>
		</div>
	</div>
</header>

<!-- readout: three counters, one bounded region -->
<dl class="mb-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-3">
	<div class="bg-surface px-4 py-3">
		<dt class="font-mono text-[10px] uppercase tracking-wide text-ink-faint">last 24h</dt>
		<dd class="mt-1 font-mono text-lg text-ink">{data.stats.today}</dd>
	</div>
	<div class="bg-surface px-4 py-3">
		<dt class="font-mono text-[10px] uppercase tracking-wide text-ink-faint">last 7 days</dt>
		<dd class="mt-1 font-mono text-lg text-ink">{data.stats.last7d}</dd>
	</div>
	<div class="bg-surface px-4 py-3">
		<dt class="font-mono text-[10px] uppercase tracking-wide text-ink-faint">zero-result · 7d</dt>
		<dd class="mt-1 font-mono text-lg {data.stats.zero7d > 0 ? 'text-danger' : 'text-ink'}">{data.stats.zero7d}</dd>
	</div>
</dl>

<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<!-- top queries -->
	<section class="rounded-lg border border-ink/10 bg-surface">
		<h2 class="border-b border-ink/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
			top queries · 7 days
		</h2>
		{#if data.top.length === 0}
			<p class="p-6 text-center font-mono text-xs text-ink-faint">no searches logged yet</p>
		{:else}
			<ul class="divide-y divide-ink/5">
				{#each data.top as t (t.query)}
					<li class="flex min-w-0 items-baseline gap-3 px-4 py-2">
						<span class="shrink-0 font-mono text-[11px] text-accent">{t.n}×</span>
						<span class="min-w-0 flex-1 truncate font-mono text-xs text-ink" title={t.query}>{t.query}</span>
						<span class="shrink-0 font-mono text-[10px] text-ink-faint">{t.sources}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<!-- top misses -->
	<section class="rounded-lg border border-ink/10 bg-surface">
		<h2 class="border-b border-ink/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
			top zero-result queries · 7 days
		</h2>
		{#if data.topMisses.length === 0}
			<p class="p-6 text-center font-mono text-xs text-ink-faint">no misses — every query hit</p>
		{:else}
			<ul class="divide-y divide-ink/5">
				{#each data.topMisses as t (t.query)}
					<li class="flex min-w-0 items-baseline gap-3 px-4 py-2">
						<span class="shrink-0 font-mono text-[11px] text-danger">{t.n}×</span>
						<span class="min-w-0 flex-1 truncate font-mono text-xs text-ink" title={t.query}>{t.query}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>

<!-- recent stream -->
<section class="mt-6 rounded-lg border border-ink/10 bg-surface">
	<h2 class="border-b border-ink/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
		recent searches · last 50
	</h2>
	{#if data.recent.length === 0}
		<p class="p-8 text-center font-mono text-xs text-ink-faint">nothing logged yet</p>
	{:else}
		<ul class="divide-y divide-ink/5">
			{#each data.recent as r (r.id)}
				<li class="flex min-w-0 items-baseline gap-3 px-4 py-2">
					<span class="shrink-0 font-mono text-[10px] text-ink-faint">{fmtTime(r.created_at)}</span>
					<span class="shrink-0 rounded-full border border-ink/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-ink-soft">{r.source}</span>
					<span class="min-w-0 flex-1 truncate font-mono text-xs text-ink" title={r.query}>{r.query}</span>
					<span class="shrink-0 font-mono text-[10px] {r.results === 0 ? 'text-danger' : 'text-ink-faint'}">{r.results} hits · {r.took_ms ?? '—'}ms</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>
