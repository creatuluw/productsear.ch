<script lang="ts">
	import { goto } from '$app/navigation';
	import ShieldCogCorner from '$lib/components/icons/ShieldCogCorner.svelte';
	import { authClient } from '$lib/auth-client';

	let mode = $state<'signin' | 'signup'>('signin');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state('');
	let busy = $state(false);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (busy) return;
		error = '';
		busy = true;
		try {
			const res =
				mode === 'signin'
					? await authClient.signIn.email({ email, password })
					: await authClient.signUp.email({
							email,
							password,
							name: name.trim() || email.split('@')[0]
						});
			if (res.error) {
				error = res.error.message ?? 'Authentication failed.';
				return;
			}
			await goto('/admin', { invalidateAll: true });
		} catch {
			error = 'Unexpected error — is the auth database reachable?';
		} finally {
			busy = false;
		}
	}
</script>

<div class="mx-auto my-20 w-full max-w-sm px-4">
	<div class="rounded-lg border border-ink/10 bg-surface p-7 shadow-sm">
		<div class="mb-6 flex items-center gap-3">
			<span class="text-accent"><ShieldCogCorner size={26} /></span>
			<div>
				<h1 class="font-mono text-sm font-semibold tracking-tight">platform console</h1>
				<p class="font-mono text-[11px] text-ink-faint">productsear.ch admin area</p>
			</div>
		</div>

		<div
			class="mb-6 flex rounded-full border border-ink/15 p-0.5 font-mono text-[11px]"
			role="tablist"
			aria-label="auth mode"
		>
			<button
				type="button"
				role="tab"
				aria-selected={mode === 'signin'}
				class="flex-1 rounded-full px-3 py-1 transition-colors duration-150 {mode === 'signin'
					? 'bg-ink text-canvas'
					: 'text-ink-soft hover:text-ink'}"
				onclick={() => {
					mode = 'signin';
					error = '';
				}}
			>
				sign in
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={mode === 'signup'}
				class="flex-1 rounded-full px-3 py-1 transition-colors duration-150 {mode === 'signup'
					? 'bg-ink text-canvas'
					: 'text-ink-soft hover:text-ink'}"
				onclick={() => {
					mode = 'signup';
					error = '';
				}}
			>
				sign up
			</button>
		</div>

		<form class="space-y-4" onsubmit={submit}>
			{#if mode === 'signup'}
				<label class="block">
					<span class="mb-1 block font-mono text-[11px] uppercase tracking-wide text-ink-faint">name</span>
					<input
						type="text"
						bind:value={name}
						autocomplete="name"
						placeholder="Patrick"
						class="w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
					/>
				</label>
			{/if}
			<label class="block">
				<span class="mb-1 block font-mono text-[11px] uppercase tracking-wide text-ink-faint">email</span>
				<input
					type="email"
					bind:value={email}
					required
					autocomplete="email"
					placeholder="you@productsear.ch"
					class="w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block font-mono text-[11px] uppercase tracking-wide text-ink-faint">password</span>
				<input
					type="password"
					bind:value={password}
					required
					minlength={8}
					autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
					placeholder="min. 8 characters"
					class="w-full rounded-md border border-ink/15 bg-canvas px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
				/>
			</label>

			{#if error}
				<p class="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
					{error}
				</p>
			{/if}

			<button
				type="submit"
				disabled={busy}
				class="w-full rounded-md bg-accent px-3 py-2 font-mono text-xs font-semibold text-canvas transition-colors hover:bg-accent-hover disabled:opacity-60"
			>
				{busy ? 'working…' : mode === 'signin' ? 'sign in' : 'create admin account'}
			</button>
		</form>

		<p class="mt-5 font-mono text-[10px] leading-relaxed text-ink-faint">
			Access is restricted to the ADMIN_EMAILS allowlist — sign-up requests from
			any other address are rejected server-side.
		</p>
	</div>
</div>
