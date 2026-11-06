<script lang="ts">
	let { text, align = 'center', children }: { text: string; align?: 'left' | 'center' | 'right'; children?: import('svelte').Snippet } = $props();
	const id = $props.id();

	// touch adaptation: coarse pointers get no hover, so a tap toggles the tip open
	let open = $state(false);
	let boxEl = $state<HTMLSpanElement | null>(null);

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		open = !open;
		if (open) clamp();
		else if (boxEl) boxEl.style.translate = '';
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open = !open;
			if (open) clamp();
		}
	}

	// keep the open box inside the viewport on narrow screens: shift it left by the
	// amount it pokes past the right edge. `translate` composes with the centering
	// transform, so center/left/right anchoring all keep working.
	function clamp() {
		requestAnimationFrame(() => {
			if (!boxEl) return;
			boxEl.style.translate = '';
			const pad = 10;
			const over = boxEl.getBoundingClientRect().right - (window.innerWidth - pad);
			if (over > 0) boxEl.style.translate = `${-over}px 0`;
		});
	}
</script>

<span
	class="tip hit"
	class:open
	tabindex="0"
	role="button"
	aria-describedby={id}
	aria-expanded={open}
	onclick={toggle}
	onkeydown={onKey}
>
	{@render children?.()}
	<span class="tipbox {align}" role="tooltip" id={id} bind:this={boxEl}>{text}</span>
</span>

<style>
	.tip {
		position: relative;
		display: inline-flex;
		cursor: help;
		text-decoration: underline dotted;
		text-decoration-color: var(--color-ink-faint);
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
		transition: color 150ms ease;
	}
	.tip:hover,
	.tip:focus,
	.tip.open {
		color: var(--color-ink);
		text-decoration-color: var(--color-ink-soft);
	}
	.tip:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: 2px;
	}
	/* closed boxes are display:none — an opacity-0 box still occupies scroll space
	   and caused horizontal overflow on narrow screens */
	.tipbox {
		position: absolute;
		bottom: calc(100% + 9px);
		left: 50%;
		transform: translateX(-50%);
		display: none;
		z-index: 30;
		width: max-content;
		max-width: min(300px, calc(100vw - 1.5rem));
		padding: 0.55rem 0.75rem;
		border-radius: var(--radius);
		background: var(--color-ink);
		color: var(--color-canvas);
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 400;
		font-variant-numeric: tabular-nums;
		line-height: 1.65;
		text-align: left;
		letter-spacing: 0.01em;
		text-transform: none;
		text-decoration: none;
		white-space: normal;
		box-shadow: 0 6px 20px color-mix(in oklab, var(--ink) 28%, transparent);
	}
	.tipbox.left {
		left: 0;
		transform: none;
	}
	.tipbox.right {
		left: auto;
		right: 0;
		transform: none;
	}
	.tip:hover .tipbox,
	.tip:focus .tipbox,
	.tip:focus-visible .tipbox,
	.tip.open .tipbox {
		display: block;
		animation: tip-in 150ms ease;
	}
	@keyframes tip-in {
		from {
			opacity: 0;
		}
	}
</style>
