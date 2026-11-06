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

	// Bluesky intent — same share primitive as the feed cards
	function bskyHref(item: (typeof items)[number]): string {
		const url = item.body.listing
			? `https://productsear.ch/listings/${item.body.listing.id}`
			: `https://productsear.ch/listings/${listing.id}`;
		const text = `${item.body.headline}\n\n${url}`;
		return `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
	}
</script>

<svelte:head><title>{listing.title} · the drum · productsear.ch</title>
	<meta property="og:title" content={listing.title} />
	<meta property="og:description" content={listing.purpose ?? listing.excerpt ?? 'A listing from the productsear.ch corpus.'} />
	<meta property="og:image" content={`https://productsear.ch/api/feed/og/listing/${listing.id}`} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if data.llm}
	<LlmDoc md={data.llm} />
{:else}
	<div class="mx-auto max-w-[860px] px-6 py-10 sm:px-10 lg:px-14">
		<a href="/feed" class="font-mono text-[11px] text-ink-faint transition-colors hover:text-accent">← the drum</a>

		<!-- the listing plate: one bounded region, the page's figure -->
		<header class="mt-4 rounded-[10px] border border-ink/10 bg-surface px-5 py-5 sm:px-7 sm:py-6">
			<h1 class="break-words text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink">
				<a href={listing.url} target="_blank" rel="noopener" class="transition-colors duration-150 hover:text-accent">
					{listing.title}
				</a>
			</h1>
			<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-faint">
				<span>{listing.domain}</span>
				<span aria-hidden="true">·</span>
				<span>added {fmtDate(listing.created)}</span>
				<span aria-hidden="true">·</span>
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
				<p class="mt-4 text-[15px] leading-relaxed text-ink-soft">{listing.purpose}</p>
			{/if}
			{#if listing.howToUse || listing.whenToUse}
				<dl class="mt-4 space-y-1.5 border-l-2 border-accent/30 pl-4 font-mono text-[12px] leading-relaxed">
					{#if listing.howToUse}
						<div class="flex gap-3"><dt class="w-10 shrink-0 text-ink-faint">how</dt><dd class="min-w-0 text-ink-soft">{listing.howToUse}</dd></div>
					{/if}
					{#if listing.whenToUse}
						<div class="flex gap-3"><dt class="w-10 shrink-0 text-ink-faint">when</dt><dd class="min-w-0 text-ink-soft">{listing.whenToUse}</dd></div>
					{/if}
				</dl>
			{/if}
		</header>

		<!-- the stack: the listing's drum history on a spine (continuity) -->
		{#if items.length > 0}
			<section class="mt-10">
				<h2 class="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-faint">
					on the drum — {items.length} card{items.length === 1 ? '' : 's'}
				</h2>
				<div class="relative mt-4">
					<div aria-hidden="true" class="absolute bottom-4 left-[5px] top-4 w-px bg-ink/15"></div>
					<ol class="space-y-5">
						{#each items as item, i (item.id)}
							<li
								transition:fly={{ y: 8, duration: 180, delay: Math.min(i * 35, 200), easing: cubicOut }}
								class="relative pl-10"
							>
								<span
									aria-hidden="true"
									class="absolute left-0 top-8 h-[11px] w-[11px] rounded-full border-2 border-canvas bg-accent"
								></span>
								<article class="rounded-[10px] border border-ink/10 bg-surface px-5 py-5 transition-colors duration-150 hover:border-ink/25 sm:px-7 sm:py-6">
									<div class="flex items-baseline gap-3">
										<span class="rounded-full border border-ink/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
											{item.typeName ?? item.type}
										</span>
										<span class="font-mono text-[11px] text-ink-faint">{fmtDate(item.publishedAt ?? item.createdAt)}</span>
									</div>
									<p class="mt-3 break-words text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink">{item.body.headline}</p>
									{#if item.body.standfirst}
										<p class="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-soft">{item.body.standfirst}</p>
									{/if}
									{#each item.body.paragraphs ?? [] as p}
										<p class="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-soft">{p}</p>
									{/each}
									{#if item.body.question}
										<p class="mt-4 max-w-[65ch] font-mono text-[12px] text-accent">{item.body.question}</p>
									{/if}
									<div class="mt-5 flex items-center justify-between gap-4 border-t border-ink/10 pt-3">
										<a href="/feed" class="font-mono text-[11px] text-ink-faint transition-colors hover:text-accent">the drum ↗</a>
										<a
											href={bskyHref(item)}
											target="_blank"
											rel="noopener"
											class="font-mono text-[11px] text-ink-faint transition-colors hover:text-accent"
											title="Share this card on Bluesky"
										>
											share on bluesky ↗
										</a>
									</div>
								</article>
							</li>
						{/each}
					</ol>
				</div>
			</section>
		{/if}

		<!-- keep walking: the serendipity region -->
		{#if walk.length > 0}
			<section class="mt-10 rounded-[10px] border border-ink/10 bg-surface px-5 py-5 sm:px-7 sm:py-6">
				<h2 class="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-faint">keep walking</h2>
				<p class="mt-1 font-mono text-[11px] text-ink-faint">Embedding nearest neighbors — the serendipity layer, unranked.</p>
				<ul class="mt-4 space-y-1.5">
					{#each walk as n (n.id)}
						<li class="flex items-baseline gap-4 border-t border-ink/10 px-1 py-2 first:border-t-0 first:pt-0">
							<a
								href={`/listings/${n.id}`}
								class="min-w-0 flex-1 truncate text-sm text-ink transition-colors duration-150 hover:text-accent"
							>
								{n.title}
							</a>
							<span class="shrink-0 font-mono text-[11px] text-ink-faint">d={fmtDistance(n.distance)}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</div>
{/if}
