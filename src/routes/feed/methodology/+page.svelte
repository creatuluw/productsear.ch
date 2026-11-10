<script lang="ts">
	import LlmDoc from '$lib/components/LlmDoc.svelte';

	let { data } = $props();
</script>

<svelte:head><title>how this drum works · productsear.ch</title>
	<meta
		name="description"
		content="How The Drum drafts: corpus-derived item types, the 48h rotation, and how each card is generated from listing metadata."
	/>
	<link rel="canonical" href="https://productsear.ch/feed/methodology" />
</svelte:head>

<LlmDoc md={data.md} />
