<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import LlmDoc from '$lib/components/LlmDoc.svelte';
	import ShieldCogCorner from '$lib/components/icons/ShieldCogCorner.svelte';

	let { children, data } = $props();

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

	// the feed link is a feature flag — admin can hide it (feed_settings.nav_enabled)
	const surfaces = $derived([
		{ href: '/', label: 'search' },
		{ href: '/archive', label: 'listings' },
		{ href: '/collections', label: 'collections' },
		...(data?.feedNav !== false ? [{ href: '/feed', label: 'the drum' }] : [])
	]);
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

	// theme: mirrors the class set pre-paint by the inline script in app.html
	let dark = $state(false);
	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch {
			/* storage unavailable — theme still applies for this session */
		}
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', dark ? '#1A2221' : '#F9FBFA');
	}
</script>

<div class="flex min-h-dvh flex-col">
	<header
		class="sticky top-0 z-20 border-b border-ink/10 bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/75"
	>
		{#snippet navPills()}
			{#each surfaces as s (s.href)}
				<a
					href={s.href}
					class="hit rounded-full px-2.5 py-1 font-mono text-xs transition-colors duration-150 lg:px-3 {isActive(s.href)
						? 'bg-ink text-canvas'
						: 'text-ink-soft hover:bg-ink/5 hover:text-ink'}"
				>
					{s.label}
				</a>
			{/each}
		{/snippet}
		<div class="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
			<!-- deck 1: wordmark + view cluster; wraps on very narrow phones so nothing is unreachable -->
			<div
				class="flex min-h-12 flex-wrap items-center gap-x-2 gap-y-1 py-1 sm:gap-3 sm:py-0 lg:h-12 lg:flex-nowrap lg:gap-4"
			>
				<a href="/" class="shrink-0 font-mono text-[13px] font-semibold tracking-tight text-accent">
					productsear.ch
				</a>
				<nav class="hidden shrink-0 gap-1.5 sm:flex" aria-label="surfaces">
					{@render navPills()}
				</nav>
				<div class="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
					<button
						type="button"
						onclick={toggleTheme}
						class="hit -mx-1 flex shrink-0 items-center p-2 text-ink-soft transition-colors hover:text-accent"
						aria-label={dark ? 'switch to light theme' : 'switch to dark theme'}
						aria-pressed={dark}
						title={dark ? 'switch to light theme' : 'switch to dark theme'}
					>
					{#if dark}
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="4.2" />
							<path
								d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6"
							/>
						</svg>
					{:else}
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
						</svg>
					{/if}
				</button>
				<a
					href="/admin"
					class="hit -mx-1 flex shrink-0 items-center p-2 text-ink-soft transition-colors hover:text-accent"
					aria-label="platform console"
					title="platform console"
				>
					<ShieldCogCorner size={15} />
				</a>
				<div
					class="flex shrink-0 items-center rounded-full border border-ink/15 p-0.5 font-mono text-[11px]"
					role="tablist"
					aria-label="view"
				>
				<a
					role="tab" aria-selected={!isLlm}
					href={viewHref(false)}
					class="hit rounded-full px-2 py-1 transition-colors duration-150 lg:px-2.5 {isLlm
						? 'text-ink-soft hover:text-ink'
						: 'bg-ink text-canvas'}"
				>
					humans
				</a>
				<a
					role="tab" aria-selected={isLlm}
					href={viewHref(true)}
					class="hit rounded-full px-2 py-1 transition-colors duration-150 lg:px-2.5 {isLlm
						? 'bg-ink text-canvas'
						: 'text-ink-soft hover:text-ink'}"
				>
						llms
					</a>
				</div>
			</div>
		</div>
		<!-- deck 2 (mobile only): surface nav as its own full-width row — nothing hidden behind scroll -->
		<nav
			class="flex flex-wrap gap-1 pb-1.5 sm:hidden"
			aria-label="surfaces"
		>
			{@render navPills()}
		</nav>
		</div>
	</header>

	<div class="flex-1">
		{@render children()}
	</div>

	{#if !isLlm}
		<footer>
			<div class="mx-auto max-w-[1400px] px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:px-14">
				<div class="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
					<p class="pt-4 font-mono text-[11px] text-ink-faint sm:pb-5">
						productsear.ch :: A product and information catalog curated by Patrick Tehubijuluw
					</p>
					<img
						src="/mascot-product-search.png"
						alt="product-search, the productsear.ch bookmark-ribbon mascot"
						width="163"
						height="256"
						class="h-20 w-auto self-end sm:h-28"
						loading="lazy"
					/>
				</div>
			</div>
		</footer>
	{/if}

	{#if toastVisible}
		<div
			role="status"
			class="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex w-max max-w-[calc(100vw-3rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[var(--radius)] bg-ink px-5 py-3 font-mono text-xs text-canvas shadow-lg sm:rounded-full"
		>
			<span>This URL is ready for your LLM — copy &amp; paste it into the chat.</span>
			<button
				onclick={copyUrl}
				class="hit rounded-full border border-canvas/30 px-3 py-1 transition-colors hover:border-canvas/70"
			>copy URL</button>
			<button
				onclick={() => (toastVisible = false)}
				aria-label="dismiss"
				class="hit text-canvas/60 transition-colors hover:text-canvas"
			>×</button>
		</div>
	{/if}
</div>
