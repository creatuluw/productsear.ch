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

<main class="mx-auto w-full max-w-[900px] min-w-0 px-4 py-8 sm:px-10 sm:py-10">
	<section
		class="overflow-hidden rounded-[var(--radius)] border border-ink/12 bg-surface"
		aria-label="machine-readable document"
	>
		<header
			class="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-2.5 font-mono text-[11px] text-ink-soft"
		>
			<span class="flex min-w-0 items-center gap-2">
				<span class="inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--color-success)]" aria-hidden="true"></span>
				<span class="truncate">machine view · text/markdown · {page.url.pathname}</span>
			</span>
			<a
				href={rawHref}
				target="_blank"
				rel="noopener"
				class="shrink-0 underline underline-offset-2 transition-colors hover:text-accent"
			>raw .md ↗</a>
		</header>
		<article class="md md-machine px-5 py-5 sm:px-6">
			<!-- markdown is generated server-side from our own data; contains query echoes -->
			{@html html}
		</article>
	</section>
</main>
