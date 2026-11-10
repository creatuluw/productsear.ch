<script lang="ts">
	// JSON-LD structured data for search engines and AI agents (schema.org).
	// Server-owned data only; `<` is escaped so no script-close breakout is
	// possible through titles or copy.
	type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

	let { data }: { data: JsonLdData } = $props();

	const payload = $derived(JSON.stringify(data).replace(/</g, '\\u003c'));
</script>

{@html `<script type="application/ld+json">${payload}</script>`}
