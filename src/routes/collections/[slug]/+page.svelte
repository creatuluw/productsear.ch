<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import LlmDoc from '$lib/components/LlmDoc.svelte';

	let { data } = $props();

	const totalPages = $derived(Math.max(1, Math.ceil(data.group.n / data.pageSize)));

	function goToPage(e: MouseEvent) {
		// keep default link navigation (URL state) and return the viewport to the top
		window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	}

	const href = (p: number) => `/collections/${data.group.slug}${p > 1 ? `?page=${p}` : ''}`;

	// card accordion: visible = title + what + first tag + date; details expand on demand
	const tagList = (tags: string | null) =>
		tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
	let openIds = $state<Set<number>>(new Set());
	const toggle = (id: number) => {
		const next = new Set(openIds);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		openIds = next;
	};
</script>

<svelte:head><title>{data.group.name} — collections — productsear.ch</title></svelte:head>

{#if data.llm}
		<LlmDoc md={data.llm} />
	{:else}
	<h1 class="sr-only">{data.group.name} — collections group</h1>
	<main class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<div class="mb-8">
			<a href="/collections" class="font-mono text-[11px] text-ink-soft transition-colors hover:text-accent">← collections</a>
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
					class="flex flex-col rounded-[var(--radius)] border border-ink/10 bg-surface px-5 py-4 transition-colors duration-150 hover:border-ink/25"
				>
					<div class="flex items-baseline justify-between gap-4">
						<a href={e.url} target="_blank" rel="noopener" class="group min-w-0">
							<span class="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
								{e.domain ?? ''}
							</span>
							<h3 class="mt-0.5 break-words font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-accent">
								{e.title}
							</h3>
						</a>
						<span class="shrink-0 font-mono text-[10.5px] text-ink-faint">
							{e.created ? e.created.slice(0, 10) : ''}
						</span>
					</div>
					{#if e.purpose}
						<dl class="mt-3 text-[13.5px] leading-relaxed">
							<div class="flex gap-3">
								<dt class="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint pt-1">what</dt>
								<dd class="break-words text-ink-soft">{e.purpose}</dd>
							</div>
						</dl>
					{/if}
					{#if openIds.has(e.id)}
						<div id={`details-${e.id}`} transition:slide={{ duration: 180, easing: cubicOut }} class="mt-3">
							<dl class="space-y-1.5 text-[13.5px] leading-relaxed">
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
							{#if tagList(e.tags).length > 1}
								<div class="mt-3 flex flex-wrap gap-1.5">
									{#each tagList(e.tags).slice(1) as tag, ti (tag + ti)}
										<span class="rounded border border-ink/10 px-1.5 py-0.5 font-mono text-[10.5px] text-ink-faint">{tag}</span>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
					{#if tagList(e.tags)[0] || e.howToUse || e.whenToUse || tagList(e.tags).length > 1}
						<div class="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-3">
							{#if tagList(e.tags)[0]}
								<span class="rounded border border-ink/10 px-1.5 py-0.5 font-mono text-[10.5px] text-ink-faint">{tagList(e.tags)[0]}</span>
							{/if}
							{#if e.howToUse || e.whenToUse || tagList(e.tags).length > 1}
								<button
									type="button"
									class="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-accent transition-all duration-150 hover:opacity-80"
									aria-expanded={openIds.has(e.id)}
									aria-controls={openIds.has(e.id) ? `details-${e.id}` : undefined}
									onclick={() => toggle(e.id)}
								>
									details
									<span class="inline-block text-[15px] leading-none transition-transform duration-150" class:rotate-180={openIds.has(e.id)}>▾</span>
								</button>
							{/if}
						</div>
					{/if}
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
