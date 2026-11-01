<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>compendium — productsear.ch</title></svelte:head>

{#if data.llm}
	<main class="mx-auto max-w-[900px] px-6 py-10 sm:px-10">
		<h1 class="mb-6 font-mono text-sm text-ink-soft">/compendium — llms view</h1>
		<pre class="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-ink">{data.llm}</pre>
	</main>
{:else}
	<h1 class="sr-only">compendium — the corpus by archetype</h1>
	<main class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<div class="mb-8 flex items-baseline justify-between">
			<h2 class="text-[2rem] font-semibold leading-none tracking-[-0.025em] text-ink">compendium</h2>
			<p class="font-mono text-[11px] text-ink-soft">{data.groups.length} archetypes · multi-entry</p>
		</div>

		<ul class="grid grid-cols-1 gap-x-12 sm:grid-cols-2 xl:grid-cols-3">
			{#each data.groups as g (g.slug)}
				<li class="border-t border-ink/10">
					<a href={`/compendium/${g.slug}`} class="group flex items-baseline justify-between gap-4 py-3.5 transition-colors duration-150">
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
