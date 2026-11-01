<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import LlmDoc from '$lib/components/LlmDoc.svelte';

	let { children } = $props();

	// llms-view toast: appears when the user switches to ?view=llm
	let toastVisible = $state(false);
	let wasLlm = false;
	let toastTimer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		const isLlm = page.url.searchParams.get('view') === 'llm';
		if (isLlm && !wasLlm) {
			toastVisible = true;
			clearTimeout(toastTimer);
			toastTimer = setTimeout(() => (toastVisible = false), 9000);
		}
		if (!isLlm) toastVisible = false;
		wasLlm = isLlm;
		return () => clearTimeout(toastTimer);
	});

	async function copyUrl() {
		try {
			await navigator.clipboard.writeText(page.url.href);
		} catch {
			/* clipboard unavailable — the URL is in the address bar anyway */
		}
		toastVisible = false;
	}

	const surfaces = [
		{ href: '/', label: 'search' },
		{ href: '/archive', label: 'archive' },
		{ href: '/compendium', label: 'compendium' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	const viewHref = (llm: boolean) => {
		const p = new URLSearchParams(page.url.searchParams);
		if (llm) p.set('view', 'llm');
		else p.delete('view');
		const qs = p.toString();
		return page.url.pathname + (qs ? `?${qs}` : '');
	};
	const isLlm = $derived(page.url.searchParams.get('view') === 'llm');
</script>

<div class="min-h-screen">
	<header
		class="sticky top-0 z-20 border-b border-ink/10 bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/75"
	>
		<div
			class="mx-auto flex h-12 max-w-[1400px] items-center gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 sm:px-10 lg:px-14"
		>
			<a href="/" class="shrink-0 font-mono text-[13px] font-semibold tracking-tight text-accent">
				productsear.ch
			</a>
			<nav class="flex shrink-0 gap-1.5" aria-label="surfaces">
				{#each surfaces as s (s.href)}
					<a
						href={s.href}
						class="rounded-full px-3 py-1 font-mono text-xs transition-colors duration-150 {isActive(s.href)
							? 'bg-ink text-canvas'
							: 'text-ink-soft hover:bg-ink/5 hover:text-ink'}"
					>
						{s.label}
					</a>
				{/each}
			</nav>
			<div
				class="ml-auto flex shrink-0 items-center rounded-full border border-ink/15 p-0.5 font-mono text-[11px]"
				role="tablist"
				aria-label="view"
			>
				<a
					role="tab" aria-selected={!isLlm}
					href={viewHref(false)}
					class="rounded-full px-2.5 py-1 transition-colors duration-150 {isLlm
						? 'text-ink-soft hover:text-ink'
						: 'bg-ink text-canvas'}"
				>
					humans
				</a>
				<a
					role="tab" aria-selected={isLlm}
					href={viewHref(true)}
					class="rounded-full px-2.5 py-1 transition-colors duration-150 {isLlm
						? 'bg-ink text-canvas'
						: 'text-ink-soft hover:text-ink'}"
				>
					llms
				</a>
			</div>
		</div>
	</header>

	{@render children()}

	{#if toastVisible}
		<div
			role="status"
			class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-5 py-3 font-mono text-xs text-canvas shadow-lg"
		>
			<span>This URL is ready for your LLM — copy &amp; paste it into the chat.</span>
			<button
				onclick={copyUrl}
				class="rounded-full border border-canvas/30 px-3 py-1 transition-colors hover:border-canvas/70"
			>copy URL</button>
			<button
				onclick={() => (toastVisible = false)}
				aria-label="dismiss"
				class="text-canvas/60 transition-colors hover:text-canvas"
			>×</button>
		</div>
	{/if}
</div>
