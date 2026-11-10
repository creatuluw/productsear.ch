<script lang="ts">
	import { page } from '$app/state';

	// Branded 404/500 — correct status code comes from the server; this page
	// explains what happened and offers a way forward (spec.website Resilience).
</script>

<svelte:head><title>{page.status} · productsear.ch</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-[860px] px-6 py-16 sm:px-10">
	<p class="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
		error {page.status}
	</p>
	<h1 class="mt-3 text-[2rem] font-semibold tracking-[-0.025em] text-ink">
		{page.error?.message ?? (page.status === 404 ? 'not found' : 'something went wrong')}
	</h1>
	<p class="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
		{#if page.status === 404}
			This URL doesn't match anything in the corpus or the site's own surfaces. Try the
			search, or browse everything.
		{:else}
			The server hit an unexpected condition. It has been noted — try again in a moment.
		{/if}
	</p>
	<div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px]">
		<a href="/" class="text-accent transition-colors hover:text-accent-hover">search the corpus</a>
		<span aria-hidden="true" class="text-ink-faint">·</span>
		<a href="/archive" class="text-accent transition-colors hover:text-accent-hover">all listings</a>
		<span aria-hidden="true" class="text-ink-faint">·</span>
		<a href="/collections" class="text-accent transition-colors hover:text-accent-hover">collections</a>
	</div>
</div>
