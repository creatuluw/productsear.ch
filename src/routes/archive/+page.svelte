<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { ARCHETYPE_BY_SLUG } from '$lib/archetypes';

	let { data } = $props();

	// group rows by month headline: 2026-11 · 2026-10 · … (continuity on one axis)
	const groups = $derived.by(() => {
		const m = new Map<string, typeof data.entries>();
		for (const e of data.entries) {
			const k = e.created ? e.created.slice(0, 7) : 'undated';
			if (!m.has(k)) m.set(k, []);
			m.get(k)!.push(e);
		}
		return [...m.entries()];
	});

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.pageSize)));
	const href = (p: number) => `/archive${p > 1 ? `?page=${p}` : ''}`;
</script>

<svelte:head><title>archive — productsear.ch</title></svelte:head>

{#if data.llm}
	<main class="mx-auto max-w-[900px] px-6 py-10 sm:px-10">
		<h1 class="mb-6 font-mono text-sm text-ink-soft">/archive — llms view</h1>
		<pre class="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-ink">{data.llm}</pre>
	</main>
{:else}
	<h1 class="sr-only">archive — all entries, newest first</h1>
	<main class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<div class="mb-8 flex items-baseline justify-between">
			<h2 class="text-[2rem] font-semibold leading-none tracking-[-0.025em] text-ink">archive</h2>
			<p class="font-mono text-[11px] text-ink-soft">
				{data.total.toLocaleString()} entries · newest first
			</p>
		</div>

		<div class="border-l border-ink/10 pl-6">
			{#each groups as [month, entries] (month)}
				<section class="mb-8">
					<h3 class="mb-3 border-l-2 border-ink/20 pl-4 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
						{month}
					</h3>
					<ul>
						{#each entries as e, i (e.id)}
							<li
								transition:fly={{ y: 8, duration: 180, delay: Math.min(i * 35, 280), easing: cubicOut }}
								class="group flex items-baseline gap-4 border-t border-ink/10 px-2 py-2.5 transition-colors duration-150 hover:bg-ink/[0.018]"
							>
								<span class="w-20 shrink-0 font-mono text-[11px] text-ink-faint">
									{e.created ? e.created.slice(0, 10) : '—'}
								</span>
								<a
									href={e.url}
									target="_blank"
									rel="noopener"
									class="min-w-0 flex-1 truncate font-medium text-ink transition-colors duration-150 group-hover:text-accent"
								>
									{e.title}
								</a>
								<span class="hidden w-44 shrink-0 truncate text-right font-mono text-[11px] text-ink-faint sm:block">
									{e.domain ?? ''}
								</span>
								<span class="hidden w-56 shrink-0 truncate text-right font-mono text-[11px] text-ink-faint lg:block">
									{#each e.archetypes.slice(0, 2) as s, si (s + si)}{ARCHETYPE_BY_SLUG.get(s)?.name ?? s}{si === 0 && e.archetypes.length > 1 ? ' · ' : ''}{/each}
								</span>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>

		{#if totalPages > 1}
			<nav class="mt-8 flex items-center justify-center gap-3 font-mono text-xs" aria-label="pages">
				{#if data.page > 1}
					<a href={href(data.page - 1)}
						class="rounded border border-ink/15 px-2.5 py-1 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink">‹ prev</a>
				{/if}
				<span class="text-ink-faint">page {data.page} / {totalPages}</span>
				{#if data.page < totalPages}
					<a href={href(data.page + 1)}
						class="rounded border border-ink/15 px-2.5 py-1 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink">next ›</a>
				{/if}
			</nav>
		{/if}
	</main>
{/if}
