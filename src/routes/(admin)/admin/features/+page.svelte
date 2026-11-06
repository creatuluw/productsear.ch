<script lang="ts">
	import { enhance } from '$app/forms';
	import { Flag, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const inputClass =
		'w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent';
</script>

<header class="mb-8">
	<div class="flex items-center gap-3">
		<span class="text-accent"><Flag size={22} /></span>
		<div>
			<h1 class="font-mono text-base font-semibold tracking-tight">features</h1>
			<p class="font-mono text-[11px] text-ink-faint">
				feature flags — readable via getFlag() ({data.rows.filter((r) => r.enabled).length}/
				{data.rows.length} enabled)
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
	<p class="mb-3 font-mono text-[10px] uppercase tracking-wide text-ink-faint">create flag</p>
	<form method="POST" action="?/create" use:enhance class="flex flex-col gap-3 sm:flex-row">
		<input name="label" required placeholder="label — e.g. Ask mode" class="{inputClass} sm:max-w-xs" />
		<input name="key" placeholder="key (optional, slugified from label)" class="{inputClass} flex-1 font-mono" />
		<input name="description" placeholder="what it gates (optional)" class="{inputClass} flex-1" />
		<button
			type="submit"
			class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-semibold text-canvas transition-colors hover:bg-accent-hover"
		>
			<Plus size={14} /> create
		</button>
	</form>
</div>

<div class="rounded-lg border border-ink/10 bg-surface">
	{#if data.rows.length === 0}
		<p class="p-8 text-center font-mono text-xs text-ink-faint">no feature flags yet</p>
	{:else}
		<ul class="divide-y divide-ink/5">
			{#each data.rows as row (row.key)}
				<li class="flex flex-wrap items-center gap-3 p-4">
					<form method="POST" action="?/toggle" use:enhance>
						<input type="hidden" name="key" value={row.key} />
						<button
							type="submit"
							class="shrink-0 {row.enabled ? 'text-success' : 'text-ink-faint'}"
							aria-label="{row.enabled ? 'disable' : 'enable'} {row.key}"
							title="{row.enabled ? 'disable' : 'enable'}"
						>
							{#if row.enabled}
								<ToggleRight size={22} />
							{:else}
								<ToggleLeft size={22} />
							{/if}
						</button>
					</form>
					<div class="min-w-0 flex-1">
						<p class="flex items-center gap-2 text-sm font-semibold">
							{row.label}
							<span class="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] text-ink-soft">{row.key}</span>
						</p>
						{#if row.description}
							<p class="font-mono text-[11px] text-ink-faint">{row.description}</p>
						{/if}
					</div>
					<span
						class="rounded-full px-2.5 py-0.5 font-mono text-[10px] {row.enabled
							? 'bg-success/15 text-success'
							: 'bg-ink/5 text-ink-faint'}"
					>
						{row.enabled ? 'on' : 'off'}
					</span>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="key" value={row.key} />
						<button
							type="submit"
							aria-label="delete {row.key}"
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
