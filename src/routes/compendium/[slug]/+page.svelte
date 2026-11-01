<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import LlmDoc from '$lib/components/LlmDoc.svelte';

	let { data } = $props();

	const totalPages = $derived(Math.max(1, Math.ceil(data.group.n / data.pageSize)));

	function goToPage(e: MouseEvent) {
		// keep default link navigation (URL state) and return the viewport to the top
		window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	}

	const href = (p: number) => `/compendium/${data.group.slug}${p > 1 ? `?page=${p}` : ''}`;
</script>

<svelte:head><title>{data.group.name} — compendium — productsear.ch</title></svelte:head>

{#if data.llm}
		<LlmDoc md={data.llm} />
	{:else}
	<h1 class="sr-only">{data.group.name} — compendium group</h1>
	<main class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<div class="mb-8">
			<a href="/compendium" class="font-mono text-[11px] text-ink-soft transition-colors hover:text-accent">← compendium</a>
			<div class="mt-2 flex items-baseline justify-between">
				<h2 class="text-[2rem] font-semibold leading-none tracking-[-0.025em] text-ink">
					{data.group.name}
				</h2>
				<p class="font-mono text-[11px] text-ink-soft">{data.group.n} entries</p>
			</div>
		</div>

		<ul class="grid grid-cols-1 gap-4 xl:grid-cols-2">
			{#each data.entries as e, i (e.id)}
				<li
					transition:fly={{ y: 8, duration: 180, delay: Math.min(i * 35, 280), easing: cubicOut }}
					class="rounded-[var(--radius)] border border-ink/10 bg-surface px-5 py-4 transition-colors duration-150 hover:border-ink/25"
				>
					<a href={e.url} target="_blank" rel="noopener" class="group block">
						<span class="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
							{e.domain ?? ''}
						</span>
						<h3 class="mt-0.5 break-words font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-accent">
							{e.title}
						</h3>
					</a>
					<dl class="mt-3 space-y-1.5 text-[13.5px] leading-relaxed">
						{#if e.purpose}
							<div class="flex gap-3">
								<dt class="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint pt-1">what</dt>
								<dd class="break-words text-ink-soft">{e.purpose}</dd>
							</div>
						{/if}
						{#if e.howToUse}
							<div class="flex gap-3">
								<dt class="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint pt-1">how</dt>
								<dd class="break-words text-ink-soft">{e.howToUse}</dd>
							</div>
						{/if}
						{#if e.whenToUse}
							<div class="flex gap-3">
								<dt class="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint pt-1">when</dt>
								<dd class="break-words text-ink-soft">{e.whenToUse}</dd>
							</div>
						{/if}
					</dl>
					<div class="mt-3 flex items-center justify-between gap-4">
						{#if e.tags}
							<div class="flex flex-wrap gap-1.5">
								{#each e.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4) as tag, ti (tag + ti)}
									<span class="rounded border border-ink/10 px-1.5 py-0.5 font-mono text-[10.5px] text-ink-faint">{tag}</span>
								{/each}
							</div>
						{/if}
						<span class="ml-auto shrink-0 font-mono text-[10.5px] text-ink-faint">
							{e.created ? e.created.slice(0, 10) : ''}
						</span>
					</div>
				</li>
			{/each}
		</ul>

		{#if totalPages > 1}
			<nav class="mt-8 flex items-center justify-center gap-3 font-mono text-xs" aria-label="pages">
				{#if data.page > 1}
					<a href={href(data.page - 1)} onclick={goToPage}
						class="rounded border border-ink/15 px-2.5 py-1 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink">‹ prev</a>
				{/if}
				<span class="text-ink-faint">page {data.page} / {totalPages}</span>
				{#if data.page < totalPages}
					<a href={href(data.page + 1)} onclick={goToPage}
						class="rounded border border-ink/15 px-2.5 py-1 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink">next ›</a>
				{/if}
			</nav>
		{/if}
	</main>
{/if}
