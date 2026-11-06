<script lang="ts">
	import ShieldCogCorner from '$lib/components/icons/ShieldCogCorner.svelte';
	import { Blocks, Bot, Cog, Flag } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const s = $derived(data.stats);

	const cards = $derived([
		{
			label: 'listings',
			value: s.listings.toLocaleString('en-US'),
			note: `${s.embedPct}% embedded · ${s.analyzePct}% analyzed`
		},
		{ label: 'extensions', value: `${s.extensions.enabled}/${s.extensions.total}`, note: 'enabled / total' },
		{ label: 'agents', value: `${s.agents.enabled}/${s.agents.total}`, note: 'enabled / total' },
		{ label: 'feature flags', value: `${s.features.enabled}/${s.features.total}`, note: 'enabled / total' },
		{ label: 'settings', value: String(s.settings), note: 'key/value entries' }
	]);

	const quickLinks = [
		{ href: '/admin/extensions', label: 'extensions', Icon: Blocks },
		{ href: '/admin/agents', label: 'agents', Icon: Bot },
		{ href: '/admin/settings', label: 'settings', Icon: Cog },
		{ href: '/admin/features', label: 'features', Icon: Flag }
	];
</script>

<header class="mb-8">
	<div class="flex items-center gap-3">
		<span class="text-accent"><ShieldCogCorner size={28} /></span>
		<div>
			<h1 class="font-mono text-base font-semibold tracking-tight">overview</h1>
			<p class="font-mono text-[11px] text-ink-faint">corpus vitals + platform controls at a glance</p>
		</div>
	</div>
</header>

<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
	{#each cards as c (c.label)}
		<div class="rounded-lg border border-ink/10 bg-surface p-4">
			<p class="font-mono text-[10px] uppercase tracking-wide text-ink-faint">{c.label}</p>
			<p class="mono mt-1.5 text-2xl font-semibold tabular-nums">{c.value}</p>
			<p class="mt-1 font-mono text-[10px] text-ink-faint">{c.note}</p>
		</div>
	{/each}
</div>

<div class="mt-8">
	<p class="mb-3 font-mono text-[10px] uppercase tracking-wide text-ink-faint">manage</p>
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each quickLinks as l (l.href)}
			<a
				href={l.href}
				class="group flex items-center gap-3 rounded-lg border border-ink/10 bg-surface p-4 transition-colors hover:border-accent/40"
			>
				<span class="text-ink-soft transition-colors group-hover:text-accent"><l.Icon size={18} /></span>
				<span class="font-mono text-xs">{l.label}</span>
			</a>
		{/each}
	</div>
</div>
