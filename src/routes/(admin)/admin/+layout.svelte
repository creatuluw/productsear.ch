<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import ShieldCogCorner from '$lib/components/icons/ShieldCogCorner.svelte';
	import { LogOut } from 'lucide-svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const sections = [
		{ href: '/admin', label: 'overview' },
		{ href: '/admin/extensions', label: 'extensions' },
		{ href: '/admin/agents', label: 'agents' },
		{ href: '/admin/settings', label: 'settings' },
		{ href: '/admin/features', label: 'features' }
	];

	const isActive = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);

	async function signOut() {
		await authClient.signOut();
		await goto('/admin/login');
	}
</script>

<svelte:head><title>admin · productsear.ch</title></svelte:head>

{#if data.denied}
	<div class="mx-auto my-24 w-full max-w-md px-4">
		<div class="rounded-lg border border-danger/30 bg-danger/5 p-8 text-center">
			<span class="mx-auto mb-4 block w-fit text-danger"><ShieldCogCorner size={30} /></span>
			<h1 class="font-mono text-sm font-semibold">access denied</h1>
			<p class="mt-2 font-mono text-[11px] leading-relaxed text-ink-soft">
				You are signed in, but this account is not on the ADMIN_EMAILS allowlist.
				Ask the platform owner to add your address, then sign out and back in.
			</p>
			<button
				type="button"
				onclick={signOut}
				class="mt-5 inline-flex items-center gap-2 rounded-md border border-ink/15 px-3 py-1.5 font-mono text-xs transition-colors hover:bg-ink/5"
			>
				<LogOut size={13} /> sign out
			</button>
		</div>
	</div>
{:else}
	<div class="border-b border-ink/10 bg-surface">
		<div
			class="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3 sm:px-10 lg:px-14"
		>
			<div class="flex items-center gap-2.5">
				<span class="text-accent"><ShieldCogCorner size={20} /></span>
				<span class="font-mono text-[13px] font-semibold tracking-tight">platform console</span>
			</div>
			<nav class="flex flex-wrap gap-1.5" aria-label="admin sections">
				{#each sections as s (s.href)}
					<a
						href={s.href}
						class="rounded-full px-3 py-1 font-mono text-xs transition-colors duration-150 {isActive(
							s.href
						)
							? 'bg-ink text-canvas'
							: 'text-ink-soft hover:bg-ink/5 hover:text-ink'}"
					>
						{s.label}
					</a>
				{/each}
			</nav>
			<div class="ml-auto flex items-center gap-3">
				<span class="hidden font-mono text-[11px] text-ink-faint sm:inline">{data.user?.email}</span>
				<button
					type="button"
					onclick={signOut}
					class="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] transition-colors hover:bg-ink/5"
				>
					<LogOut size={12} /> sign out
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-[1100px] px-6 py-8 sm:px-10">
		{@render children()}
	</div>
{/if}
