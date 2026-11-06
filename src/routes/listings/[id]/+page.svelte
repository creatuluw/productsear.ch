<script lang="ts">
	import LlmDoc from '$lib/components/LlmDoc.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	const listing = $derived(data.listing);
	const items = $derived(data.items);
	const walk = $derived(data.walk);

	function fmtDate(iso: string | null): string {
		return iso ? iso.slice(0, 10) : '—';
	}

	function fmtDistance(d: number): string {
		return d.toFixed(3);
	}
</script>

<svelte:head><title>{listing.title} · the drum · productsear.ch</title></svelte:head>

{#if data.llm}
	<LlmDoc md={data.llm} />
{:else}
	<div class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<a href="/feed" class="font-mono text-[11px] text-ink-faint transition-colors hover:text-accent">← the drum</a>

		<header class="mt-4 border-b border-ink/10 pb-6">
			<h1 class="max-w-4xl text-[1.6rem] font-semibold tracking-[-0.025em] text-ink">
				<a href={listing.url} target="_blank" rel="noopener" class="transition-colors duration-150 hover:text-accent">
					{listing.title}
				</a>
			</h1>
			<div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-ink-faint">
				<span>{listing.domain ?? new URL(listing.url).hostname}</span>
				<span>added {fmtDate(listing.created)}</span>
				<a href={listing.url} target="_blank" rel="noopener" class="text-accent transition-colors hover:text-accent-hover">
					open the listing ↗
				</a>
			</div>
			{#if listing.archetypes.length > 0}
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each listing.archetypes as a (a)}
						<span class="rounded-full border border-ink/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
							{a}
						</span>
					{/each}
				</div>
			{/if}
			{#if listing.purpose}
				<p class="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">{listing.purpose}</p>
			{/if}
			{#if listing.howToUse || listing.whenToUse}
				<dl class="mt-4 max-w-3xl space-y-1 font-mono text-[12px]">
					{#if listing.howToUse}
						<div class="flex gap-3"><dt class="w-10 shrink-0 text-ink-faint">how</dt><dd class="min-w-0 text-ink-soft">{listing.howToUse}</dd></div>
					{/if}
					{#if listing.whenToUse}
						<div class="flex gap-3"><dt class="w-10 shrink-0 text-ink-faint">when</dt><dd class="min-w-0 text-ink-soft">{listing.whenToUse}</dd></div>
					{/if}
				</dl>
			{/if}
		</header>

		<section class="mt-8">
			<h2 class="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-faint">on the drum</h2>
			{#if items.length === 0}
				<p class="mt-3 font-mono text-[12px] text-ink-faint">No feed items for this listing yet.</p>
			{:else}
				<ol class="mt-2">
					{#each items as item, i (item.id)}
						<li
							transition:fly={{ y: 8, duration: 180, delay: Math.min(i * 35, 200), easing: cubicOut }}
							class="border-t border-ink/10 px-2 py-4 transition-colors duration-150 hover:bg-ink/[0.018]"
						>
							<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
								<span class="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
									{item.typeName ?? item.type}
								</span>
								<span class="font-mono text-[11px] text-ink-faint">{fmtDate(item.publishedAt ?? item.createdAt)}</span>
							</div>
							<p class="mt-2 text-base font-medium text-ink">{item.body.headline}</p>
							{#if item.body.standfirst}
								<p class="mt-1 max-w-3xl text-sm leading-relaxed text-ink-soft">{item.body.standfirst}</p>
							{/if}
							{#each item.body.paragraphs ?? [] as p}
								<p class="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{p}</p>
							{/each}
							{#if item.body.question}
								<p class="mt-2 font-mono text-[12px] text-accent">{item.body.question}</p>
							{/if}
						</li>
					{/each}
				</ol>
			{/if}
		</section>

		{#if walk.length > 0}
			<section class="mt-10 border-t border-ink/10 pt-6">
				<h2 class="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-faint">keep walking</h2>
				<p class="mt-1 font-mono text-[11px] text-ink-faint">Embedding nearest neighbors — the serendipity layer, unranked.</p>
				<ul class="mt-3 max-w-3xl space-y-1.5">
					{#each walk as n (n.id)}
						<li class="flex items-baseline gap-3">
							<a
								href={`/listings/${n.id}`}
								class="min-w-0 truncate text-sm text-ink transition-colors duration-150 hover:text-accent"
							>
								{n.title}
							</a>
							<span class="hidden shrink-0 font-mono text-[11px] text-ink-faint sm:inline">
								d={fmtDistance(n.distance)}
							</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
{/if}
