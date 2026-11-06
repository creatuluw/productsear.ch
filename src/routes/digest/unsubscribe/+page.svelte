<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>unsubscribe · the drum</title></svelte:head>

{#if data.removed}
	<div class="mx-auto max-w-xl px-6 py-24 text-center">
		<p class="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-faint">the drum</p>
		<h1 class="mt-3 text-xl font-semibold tracking-tight text-ink">Unsubscribed.</h1>
		<p class="mt-2 text-sm leading-relaxed text-ink-soft">
			No more digests — the drum keeps turning without you.
			<a href="/feed" class="text-accent underline underline-offset-2">Change of heart?</a>
		</p>
	</div>
{:else}
	<div class="mx-auto max-w-xl px-6 py-24 text-center">
		<p class="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-faint">the drum</p>
		<h1 class="mt-3 text-xl font-semibold tracking-tight text-ink">Nothing to do here.</h1>
		<p class="mt-2 text-sm leading-relaxed text-ink-soft">
			This unsubscribe link is invalid or already used.
		</p>
	</div>
{/if}
