<script lang="ts">
	import { enhance } from '$app/forms';
	import { Drum, Pencil, Play, RotateCcw, Trash2 } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const inputClass =
		'w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent';
	const btnClass =
		'inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 font-mono text-xs font-semibold text-canvas transition-colors hover:bg-accent-hover';
	const chipBtn =
		'rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] transition-colors hover:bg-ink/5';

	let editingId = $state<string | null>(null);
	let lastDrawn = $state<string | null>(null);

	$effect(() => {
		if (form?.drawn) lastDrawn = form.drawn;
	});

	function fmtDate(iso: string | null): string {
		return iso ? iso.slice(0, 16).replace('T', ' ') : '—';
	}
</script>

<header class="mb-8">
	<div class="flex items-center gap-3">
		<span class="text-accent"><Drum size={22} /></span>
		<div>
			<h1 class="font-mono text-base font-semibold tracking-tight">the drum</h1>
			<p class="font-mono text-[11px] text-ink-faint">
				corpus-drafted feed — {data.items.length} items · cadence {data.settings.cadenceHours}h ·
				next draw {data.due.due ? 'due now' : fmtDate(data.due.nextDrawAt)}
			</p>
		</div>
		<form method="POST" action="?/drawNow" use:enhance class="ml-auto">
			<button type="submit" class={btnClass}><Play size={13} /> draw now</button>
		</form>
	</div>
	{#if lastDrawn}
		<p class="mt-2 font-mono text-[11px] text-success">drew: {lastDrawn}</p>
	{/if}
</header>

{#if form?.error}
	<p class="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
		{form.error}
	</p>
{/if}

<!-- settings -->
<div class="mb-6 rounded-lg border border-ink/10 bg-surface p-5">
	<p class="mb-3 font-mono text-[10px] uppercase tracking-wide text-ink-faint">settings</p>
	<form method="POST" action="?/settings" use:enhance class="grid gap-3 sm:grid-cols-[140px_1fr] sm:items-start">
		<label class="block">
			<span class="mb-1 block font-mono text-[10px] text-ink-faint">cadence (hours)</span>
			<input name="cadence_hours" type="number" min="1" max="720" value={data.settings.cadenceHours} class={inputClass} />
		</label>
		<label class="block">
			<span class="mb-1 block font-mono text-[10px] text-ink-faint">round-robin type order (one slug per line)</span>
			<textarea
				name="type_order"
				rows="5"
				spellcheck="false"
				class="{inputClass} resize-y font-mono text-xs"
			>{(data.settings.typeOrder.length > 0 ? data.settings.typeOrder : data.defaultOrder).join('\n')}</textarea>
		</label>
		<label class="flex items-center gap-2 font-mono text-xs text-ink-soft">
			<input type="checkbox" name="digest_enabled" checked={data.settings.digestEnabled} class="accent-[var(--accent)]" />
			the digest (email edition via utobo) — currently dark by default
		</label>
		<button type="submit" class={btnClass}>save settings</button>
	</form>
</div>

<!-- queue -->
<div class="rounded-lg border border-ink/10 bg-surface">
	{#if data.items.length === 0}
		<p class="p-8 text-center font-mono text-xs text-ink-faint">the drum hasn't drawn anything yet — hit "draw now"</p>
	{:else}
		<ul class="divide-y divide-ink/5">
			{#each data.items as item (item.id)}
				{@const isEditing = editingId === item.id}
				<li class="p-4">
					<div class="flex flex-wrap items-baseline gap-2">
						<span class="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
							{item.typeName}
						</span>
						{#if item.status === 'published'}
							<span class="rounded-full bg-success/15 px-2 py-0.5 font-mono text-[10px] text-success">published</span>
						{:else}
							<span class="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] text-ink-faint">draft</span>
						{/if}
						{#if item.requiresApproval}
							<span class="rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[10px] text-signal">gated</span>
						{/if}
						<span class="font-mono text-[10px] text-ink-faint">{fmtDate(item.createdAt)}</span>
					</div>

					<div class="mt-2 min-w-0">
						{#if isEditing}
							<form method="POST" action="?/save" use:enhance class="space-y-2">
								<input type="hidden" name="id" value={item.id} />
								<input name="headline" value={item.body.headline} class="{inputClass} font-medium" />
								<textarea name="standfirst" rows="2" placeholder="standfirst" class="{inputClass} resize-y text-sm">{item.body.standfirst ?? ''}</textarea>
								<textarea name="paragraphs" rows="3" placeholder="body paragraphs — blank line between them" class="{inputClass} resize-y font-mono text-xs">{(item.body.paragraphs ?? []).join('\n\n')}</textarea>
								<input name="question" value={item.body.question ?? ''} placeholder="reader question (optional)" class={inputClass} />
								<div class="flex gap-2">
									<button type="submit" class={btnClass}>save</button>
									<button type="button" class={chipBtn} onclick={() => (editingId = null)}>
										<RotateCcw size={12} /> cancel
									</button>
								</div>
							</form>
						{:else}
							<p class="text-sm font-medium text-ink">{item.body.headline}</p>
							{#if item.body.standfirst}
								<p class="mt-0.5 line-clamp-2 text-xs text-ink-soft">{item.body.standfirst}</p>
							{/if}
						{/if}
					</div>

					<div class="mt-3 flex flex-wrap items-center gap-2">
						<button type="button" class={chipBtn} onclick={() => (editingId = isEditing ? null : item.id)} title="inline editor">
							<span class="inline-flex items-center gap-1"><Pencil size={12} /> {isEditing ? 'close' : 'edit'}</span>
						</button>
						<form method="POST" action="?/toggleApproval" use:enhance>
							<input type="hidden" name="id" value={item.id} />
							<input type="hidden" name="requires_approval" value={item.requiresApproval ? '0' : '1'} />
							<button type="submit" class={chipBtn} title="approval dial — gated items stay drafts until published">
								{item.requiresApproval ? 'ungate' : 'gate'}
							</button>
						</form>
						{#if item.status === 'published'}
							<form method="POST" action="?/retract" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class={chipBtn}>retract</button>
							</form>
						{:else}
							<form method="POST" action="?/publish" use:enhance>
								<input type="hidden" name="id" value={item.id} />
								<button type="submit" class={chipBtn + ' border-success/40 text-success hover:bg-success/10'}>publish</button>
							</form>
						{/if}
						<a href={`/listings/${item.listingId}`} class={chipBtn} title="open the listing's stack page">stack ↗</a>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={item.id} />
							<button
								type="submit"
								aria-label="delete item"
								class="rounded-full border border-danger/30 p-1.5 text-danger transition-colors hover:bg-danger/10"
							>
								<Trash2 size={13} />
							</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
