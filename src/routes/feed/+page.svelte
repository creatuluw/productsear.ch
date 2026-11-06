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

	function fmtTime(iso: string | null): string {
		return iso ? iso.slice(11, 16) : '';
	}
</script>

<svelte:head><title>the drum · productsear.ch</title></svelte:head>

{#if data.llm}
	<LlmDoc md={data.llm} />
{:else}
	<div class="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-14">
		<header class="mb-8">
			<h1 class="text-[2rem] font-semibold tracking-[-0.025em] text-ink">the drum</h1>
			<p class="mt-1 max-w-2xl text-sm text-ink-soft">
				One draw every {due.cadenceHours}h — a feed of item types, each showing how a listing can change or
				enrich a life and its ambitions. The corpus drafts, the drum keeps time.
			</p>
			<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-ink-faint">
				<span>next draw: <span class="text-ink-soft">{nextDrawLabel}</span></span>
				<span>last draw: <span class="text-ink-soft">{fmtDate(due.lastDrawAt)} {fmtTime(due.lastDrawAt)}</span></span>
				<span>next type: <span class="text-ink-soft">{due.nextTypeName ?? '—'}</span></span>
				<a href="/feed/methodology" class="text-ink-faint underline decoration-ink/20 underline-offset-2 transition-colors hover:text-accent">
					how this drum works
				</a>
			</div>
		</header>

		{#if items.length === 0}
			<div class="border-t border-ink/10 px-2 py-16 text-center font-mono text-[13px] text-ink-faint">
				The drum hasn't drawn yet — the first items arrive with the next due draw.
			</div>
		{:else}
			<ol class="border-t border-ink/10">
				{#each items as item, i (item.id)}
					<li
						transition:fly={{ y: 8, duration: 180, delay: Math.min(i * 35, 280), easing: cubicOut }}
						class="border-b border-ink/10 px-2 py-6 transition-colors duration-150 hover:bg-ink/[0.018]"
					>
						<div class="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<span class="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
								{item.typeName}
							</span>
							<span class="font-mono text-[11px] text-ink-faint">{fmtDate(item.publishedAt ?? item.createdAt)}</span>
						</div>

						{#if item.body.listing}
							<a
								href={`/listings/${item.body.listing.id}`}
								class="text-lg font-medium tracking-tight text-ink transition-colors duration-150 hover:text-accent"
							>
								{item.body.headline}
							</a>
							{#if item.body.listing.domain}
								<span class="ml-2 hidden font-mono text-[11px] text-ink-faint sm:inline">{item.body.listing.domain}</span>
							{/if}
						{:else}
							<span class="text-lg font-medium tracking-tight text-ink">{item.body.headline}</span>
						{/if}

						{#if item.body.standfirst}
							<p class="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-soft">{item.body.standfirst}</p>
						{/if}

						{#if item.body.items?.length}
							<ul class="mt-3 max-w-3xl space-y-1 font-mono text-[12px] text-ink-soft">
								{#each item.body.items as li, j (j)}
									<li class="flex items-baseline gap-2">
										<span class="shrink-0 text-accent">▸</span>
										<span class="min-w-0">{li.label}{#if li.note}<span class="text-ink-faint"> — {li.note}</span>{/if}</span>
									</li>
								{/each}
							</ul>
						{/if}

						{#each item.body.paragraphs ?? [] as p}
							<p class="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{p}</p>
						{/each}

						{#if item.body.question}
							<p class="mt-3 max-w-3xl font-mono text-[12px] text-accent">{item.body.question}</p>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</div>
{/if}
