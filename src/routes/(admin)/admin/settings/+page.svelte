<script lang="ts">
	import { enhance } from '$app/forms';
	import { Cog, Plus, Trash2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const inputClass =
		'w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent';
</script>

<header class="mb-8">
	<div class="flex items-center gap-3">
		<span class="text-accent"><Cog size={22} /></span>
		<div>
			<h1 class="font-mono text-base font-semibold tracking-tight">settings</h1>
			<p class="font-mono text-[11px] text-ink-faint">
				key/value configuration — readable via getSetting() ({data.rows.length})
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
	<p class="mb-3 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
		add or update (existing key = overwrite)
	</p>
	<form method="POST" action="?/upsert" use:enhance class="space-y-3">
		<div class="flex flex-col gap-3 sm:flex-row">
			<input name="key" required placeholder="key — e.g. site.tagline" class="{inputClass} font-mono sm:max-w-xs" />
			<input name="value" required placeholder="value" class="{inputClass} flex-1" />
		</div>
		<input name="description" placeholder="what it controls (optional)" class={inputClass} />
		<button
			type="submit"
			class="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-semibold text-canvas transition-colors hover:bg-accent-hover"
		>
			<Plus size={14} /> save
		</button>
	</form>
</div>

<div class="rounded-lg border border-ink/10 bg-surface">
	{#if data.rows.length === 0}
		<p class="p-8 text-center font-mono text-xs text-ink-faint">no settings yet</p>
	{:else}
		<ul class="divide-y divide-ink/5">
			{#each data.rows as row (row.key)}
				<li class="flex flex-wrap items-center gap-3 p-4">
					<div class="min-w-0 flex-1">
						<p class="font-mono text-xs font-semibold">{row.key}</p>
						{#if row.description}
							<p class="font-mono text-[10px] text-ink-faint">{row.description}</p>
						{/if}
					</div>
					<form method="POST" action="?/update" use:enhance class="flex flex-1 items-center gap-2 sm:max-w-md">
						<input type="hidden" name="key" value={row.key} />
						<input name="value" value={row.value} required class="{inputClass} flex-1 font-mono text-xs" />
						<button
							type="submit"
							class="shrink-0 rounded-md border border-ink/15 px-3 py-1.5 font-mono text-[11px] transition-colors hover:bg-ink/5"
						>
							save
						</button>
					</form>
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
