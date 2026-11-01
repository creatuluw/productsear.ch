<script lang="ts">
	import { marked } from 'marked';
	import { page } from '$app/state';

	let { md } = $props();

	marked.setOptions({ gfm: true, breaks: true });
	const html = $derived(marked.parse(md, { async: false }));

	const rawHref = $derived.by(() => {
		const p = new URLSearchParams(page.url.searchParams);
		p.set('raw', '1');
		return page.url.pathname + '?' + p.toString();
	});
</script>

<main class="mx-auto max-w-[900px] px-6 py-10 sm:px-10">
	<div class="mb-6 flex items-center justify-between font-mono text-[11px] text-ink-faint">
		<span>{page.url.pathname} — llms view · rendered</span>
		<a href={rawHref} class="underline underline-offset-2 transition-colors hover:text-accent">raw .md</a>
	</div>
	<article class="md">
		<!-- markdown is generated server-side from our own data; contains query echoes -->
		{@html html}
	</article>
</main>
