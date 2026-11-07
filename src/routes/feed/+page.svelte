<script lang="ts">
	import LlmDoc from '$lib/components/LlmDoc.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	const items = $derived(data.items);
	const due = $derived(data.due);

	const nextDrawLabel = $derived(
		due.due
			? 'due now'
			: due.nextDrawAt
				? new Date(due.nextDrawAt).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
				: 'due now'
	);

	function fmtDate(iso: string | null): string {
		return iso ? iso.slice(0, 10) : '—';
	}

	// items drawn within the last 2 days wear the NEW label in the card corner
	const FRESH_MS = 2 * 24 * 60 * 60 * 1000;
	function isNew(item: (typeof items)[number]): boolean {
		const iso = item.publishedAt ?? item.createdAt;
		if (!iso) return false;
		const t = Date.parse(iso);
		return !Number.isNaN(t) && Date.now() - t < FRESH_MS;
	}

	function fmtTime(iso: string | null): string {
		return iso ? iso.slice(11, 16) : '';
	}

	// Bluesky caches link cards per-URL — the utm param gives each share a fresh
	// cache key so the current og:image always unfurls (also a Plausible referral)
	function bskyHref(item: (typeof items)[number]): string {
		const url = item.body.listing
			? `https://productsear.ch/listings/${item.body.listing.id}?utm_source=bsky`
			: 'https://productsear.ch/feed?utm_source=bsky';
		const text = `${item.body.headline}\n\n${url}`;
		return `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
	}

	// digest opt-in (spec slice E) — public endpoint, inline feedback
	let digestEmail = $state('');
	let digestState = $state<'idle' | 'sending' | 'done' | 'error'>('idle');
	let digestError = $state('');
	async function subscribeDigest(e: SubmitEvent) {
		e.preventDefault();
		if (digestState === 'sending') return;
		digestState = 'sending';
		digestError = '';
		try {
			const res = await fetch('/api/digest/subscribe', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email: digestEmail })
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as { error?: string };
				throw new Error(body.error || `HTTP ${res.status}`);
			}
			digestState = 'done';
			digestEmail = '';
		} catch (err) {
			digestState = 'error';
			digestError = err instanceof Error ? err.message : String(err);
		}
	}

</script>

<svelte:head>
	<title>the drum · productsear.ch</title>
	<!-- corpus-readout cards share this URL on Bluesky — give it its own OG card -->
	<meta property="og:title" content="the drum — productsear.ch" />
	<meta property="og:description" content="One draw every 48h — a feed of item types, each showing how a listing can change or enrich a life and its ambitions. The corpus drafts, the drum keeps time." />
	<meta property="og:image" content="https://productsear.ch/api/feed/og/drum?v=2" />
	<meta property="og:url" content="https://productsear.ch/feed" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if data.llm}
	<LlmDoc md={data.llm} />
{:else}
	<div class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<!-- header: three grouped regions — identity, readout, digest -->
		<header class="max-w-[820px]">
			<h1 class="text-[2rem] font-semibold tracking-[-0.025em] text-ink">the drum</h1>
			<p class="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
				One draw every {due.cadenceHours}h — a feed of item types, each showing how a listing can change or
				enrich a life and its ambitions. The corpus drafts, the drum keeps time.
			</p>

			<!-- readout: one bounded region, three divided cells (common region);
				stacks on phones so the timestamps are never truncated away -->
			<dl class="mt-6 grid grid-cols-1 divide-y divide-ink/10 rounded-[var(--radius)] border border-ink/10 bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
				<div class="px-4 py-3">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">next draw</dt>
					<dd class="mt-1 font-mono text-[12px] text-ink" title={nextDrawLabel}>{nextDrawLabel}</dd>
				</div>
				<div class="px-4 py-3">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">last draw</dt>
					<dd class="mt-1 font-mono text-[12px] text-ink">{fmtDate(due.lastDrawAt)} {fmtTime(due.lastDrawAt)}</dd>
				</div>
				<div class="px-4 py-3">
					<dt class="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">next type</dt>
					<dd class="mt-1 font-mono text-[12px] text-ink">{due.nextTypeName ?? '—'}</dd>
				</div>
			</dl>

			<!-- digest opt-in + methodology: one balanced row (symmetry) -->
			<form onsubmit={subscribeDigest} class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
				{#if digestState === 'done'}
					<p class="font-mono text-[11px] text-success">You're in — the next digest has your name on it.</p>
				{:else}
					<input
						type="email"
						bind:value={digestEmail}
						placeholder="you@ elsewhere — get the digest by email"
						class="min-w-0 flex-1 rounded-full border border-ink/15 bg-canvas px-4 py-1.5 font-mono text-[12px] text-ink outline-none transition-colors placeholder:text-ink-faint/70 focus:border-accent sm:max-w-xs"
					/>
					<button
						type="submit"
						disabled={digestState === 'sending' || !digestEmail.trim()}
						class="shrink-0 rounded-full bg-ink px-4 py-1.5 font-mono text-[11px] font-semibold text-canvas transition-colors hover:bg-ink/80 disabled:opacity-40"
					>
						{digestState === 'sending' ? '…' : 'get the digest'}
					</button>
				{/if}
				<a href="/feed/methodology" class="hit ml-auto font-mono text-[11px] text-ink-faint underline decoration-ink/20 underline-offset-2 transition-colors hover:text-accent">
					how this drum works
				</a>
			</form>
			{#if digestState === 'error'}
				<p class="mt-1 font-mono text-[11px] text-danger">{digestError}</p>
			{/if}
		</header>

		<!-- the stream: a continuity spine + bounded card regions -->
		<div class="relative mt-10 max-w-[860px]">
			<!-- the spine: the drum's timeline, one continuous thread -->
			<div aria-hidden="true" class="absolute bottom-4 left-[5px] top-4 w-px bg-ink/15"></div>

			{#if items.length === 0}
				<article class="relative ml-10 rounded-[10px] border border-ink/10 bg-surface px-5 py-6 text-center sm:px-7 sm:py-8">
					<p class="font-mono text-[12px] text-ink-faint">
						The drum hasn't drawn yet — the first items arrive with the next due draw.
					</p>
				</article>
			{:else}
				<ol class="space-y-5">
					{#each items as item, i (item.id)}
						<li
							transition:fly={{ y: 8, duration: 180, delay: Math.min(i * 35, 280), easing: cubicOut }}
							class="relative pl-10"
						>
							<!-- node: punches through the spine (closure) -->
							<span
								aria-hidden="true"
								class="absolute left-0 top-8 h-[11px] w-[11px] rounded-full border-2 border-canvas bg-accent"
							></span>

							<!-- card: a bounded region (common region + closure) -->
							<article class="relative rounded-[10px] border border-ink/10 bg-surface px-5 py-5 transition-colors duration-150 hover:border-ink/25 sm:px-7 sm:py-6">
							{#if isNew(item)}
								<!-- live-state green: drawn within the last 2 days -->
								<span
									class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink sm:right-4 sm:top-4"
								>
									<span class="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true"></span>
									new
								</span>
							{/if}
								<!-- eyebrow: type + date, tight pair (proximity) -->
								<div class="flex items-baseline gap-3">
									<span class="rounded-full border border-ink/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
										{item.typeName}
									</span>
									<span class="font-mono text-[11px] text-ink-faint">{fmtDate(item.publishedAt ?? item.createdAt)}</span>
								</div>

								<!-- figure: the headline stands alone (figure-ground) -->
								{#if item.body.listing}
									<h2 class="mt-3 break-words text-[22px] font-semibold leading-snug tracking-[-0.015em] text-ink">
										<a href={`/listings/${item.body.listing.id}`} class="transition-colors duration-150 hover:text-accent">
											{item.body.headline}
										</a>
									</h2>
									{#if item.body.listing.domain}
										<p class="mt-1 font-mono text-[11px] text-ink-faint">{item.body.listing.domain}</p>
									{/if}
								{:else}
									<h2 class="mt-3 break-words text-[22px] font-semibold leading-snug tracking-[-0.015em] text-ink">
										{item.body.headline}
									</h2>
								{/if}

								<!-- body: one measure, one rhythm (prägnanz) -->
								{#if item.body.standfirst}
									<p class="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-soft">{item.body.standfirst}</p>
								{/if}

								{#if item.body.items?.length}
									<ul class="mt-4 max-w-[65ch] space-y-1.5 border-l-2 border-accent/30 pl-4 font-mono text-[12px] leading-relaxed text-ink-soft">
										{#each item.body.items as li, j (j)}
											<li class="flex min-w-0 items-baseline gap-2">
												<span class="shrink-0 text-accent">▸</span>
												<span class="min-w-0">{li.label}{#if li.note}<span class="text-ink-faint"> — {li.note}</span>{/if}</span>
											</li>
										{/each}
									</ul>
								{/if}

								{#each item.body.paragraphs ?? [] as p}
									<p class="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-soft">{p}</p>
								{/each}

								{#if item.body.question}
									<p class="mt-4 max-w-[65ch] font-mono text-[12px] text-accent">{item.body.question}</p>
								{/if}

								<!-- actions: separated region, balanced pair (proximity + symmetry) -->
								<div class="mt-5 flex items-center justify-between gap-4 border-t border-ink/10 pt-3">
									{#if item.body.listing}
										<a
											href={`/listings/${item.body.listing.id}`}
											class="hit font-mono text-[11px] text-ink-faint transition-colors hover:text-accent"
											title="open the listing's stack page"
										>
											open stack ↗
										</a>
									{:else}
										<span class="font-mono text-[11px] text-ink-faint/60">a corpus readout</span>
									{/if}
									<a
										href={bskyHref(item)}
										target="_blank"
										rel="noopener"
										class="hit font-mono text-[11px] text-ink-faint transition-colors hover:text-accent"
										title="Share this card on Bluesky"
									>
										share on bluesky ↗
									</a>
								</div>
							</article>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</div>
{/if}
