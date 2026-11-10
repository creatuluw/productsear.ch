<script lang="ts">
	import LlmDoc from '$lib/components/LlmDoc.svelte';
	import { ARCHETYPES } from '$lib/archetypes';

	let { data } = $props();

	const nArchetypes = ARCHETYPES.length;
</script>

<svelte:head><title>collections — productsear.ch</title>
	<meta
		name="description"
		content={`The corpus rolled up into ${nArchetypes} archetypes — curated collections of developer tools, digital products and open-source projects, each listing with purpose/how/when metadata.`}
	/>
	<link rel="canonical" href="https://productsear.ch/collections" />
	<meta property="og:title" content="collections — productsear.ch" />
	<meta
		property="og:description"
		content={`The corpus rolled up into ${nArchetypes} curated collections.`}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://productsear.ch/collections" />
	<meta property="og:image" content="https://productsear.ch/api/og/home?v=1" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if data.llm}
		<LlmDoc md={data.llm} />
	{:else}
	<h1 class="sr-only">collections — the listings by archetype</h1>
	<main class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<div class="mb-8 flex items-baseline justify-between">
			<h2 class="text-[2rem] font-semibold leading-none tracking-[-0.025em] text-ink">collections</h2>
			<p class="font-mono text-[11px] text-ink-soft">{data.groups.length} archetypes · multi-entry</p>
		</div>

		<ul class="grid grid-cols-1 gap-x-12 sm:grid-cols-2 xl:grid-cols-3">
			{#each data.groups as g (g.slug)}
				<li class="border-t border-ink/10">
					<a href={`/collections/${g.slug}`} class="group flex items-baseline justify-between gap-4 py-3.5 transition-colors duration-150">
						<span class="font-semibold tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-accent">
							{g.name}
						</span>
						<span class="font-mono text-[13px] text-ink-faint">{g.n}</span>
					</a>
				</li>
			{/each}
		</ul>
	</main>
{/if}
