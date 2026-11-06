<script lang="ts">
	import { enhance } from '$app/forms';
	import { Blocks, Plus, Trash2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const inputClass =
		'w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent';
</script>

<header class="mb-8">
	<div class="flex items-center gap-3">
		<span class="text-accent"><Blocks size={22} /></span>
		<div>
			<h1 class="font-mono text-base font-semibold tracking-tight">extensions</h1>
			<p class="font-mono text-[11px] text-ink-faint">
				platform add-ons — register capabilities, toggle them on/off ({data.rows.length})
			</p>
		</div>
	</div>
</header>

{#if form?.error}
	<p class="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
		{form.error}
	</p>
{/if}

<div class="mb-6 rounded-lg border border-ink/10 bg-surface p-5">
	<p class="mb-3 font-mono text-[10px] uppercase tracking-wide text-ink-faint">register extension</p>
	<form method="POST" action="?/create" use:enhance class="flex flex-col gap-3 sm:flex-row">
		<input name="name" required placeholder="name — e.g. site-indexer" class="{inputClass} sm:max-w-xs" />
		<input name="description" placeholder="what it does (optional)" class="{inputClass} flex-1" />
		<button
			type="submit"
			class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
		>
			<Plus size={14} /> create
		</button>
	</form>
</div>

<div class="rounded-lg border border-ink/10 bg-surface">
	{#if data.rows.length === 0}
		<p class="p-8 text-center font-mono text-xs text-ink-faint">no extensions yet</p>
	{:else}
		<ul class="divide-y divide-ink/5">
			{#each data.rows as row (row.id)}
				<li class="flex flex-wrap items-center gap-3 p-4">
					<div class="min-w-0 flex-1">
						<p class="flex items-center gap-2 text-sm font-semibold">
							{row.name}
							{#if row.enabled}
								<span class="rounded-full bg-success/15 px-2 py-0.5 font-mono text-[10px] text-success">on</span>
							{:else}
								<span class="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] text-ink-faint">off</span>
							{/if}
						</p>
						<p class="truncate font-mono text-[11px] text-ink-faint">
							{row.slug}{#if row.description} — {row.description}{/if}
						</p>
					</div>
					<form method="POST" action="?/toggle" use:enhance>
						<input type="hidden" name="id" value={row.id} />
						<button
							type="submit"
							class="rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] transition-colors hover:bg-ink/5"
						>
							{row.enabled ? 'disable' : 'enable'}
						</button>
					</form>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={row.id} />
						<button
							type="submit"
							aria-label="delete {row.name}"
							class="rounded-full border border-danger/30 p-1.5 text-danger transition-colors hover:bg-danger/10"
						>
							<Trash2 size={14} />
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</div>
