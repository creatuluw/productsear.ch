<script lang="ts">
	import LlmDoc from '$lib/components/LlmDoc.svelte';

	let { data } = $props();
</script>

<svelte:head><title>how this drum works · productsear.ch</title></svelte:head>

<LlmDoc md={data.md} />
