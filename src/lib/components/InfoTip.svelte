<script lang="ts">
	let { text, align = 'center', children }: { text: string; align?: 'left' | 'center' | 'right'; children?: import('svelte').Snippet } = $props();
	const id = $props.id();
</script>

<span class="tip" tabindex="0" aria-describedby={id}>
	{@render children?.()}
	<span class="tipbox {align}" role="tooltip" id={id}>{text}</span>
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
	.tip:focus {
		color: var(--color-ink);
		text-decoration-color: var(--color-ink-soft);
	}
	.tip:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: 2px;
	}
	.tipbox {
		position: absolute;
		bottom: calc(100% + 9px);
		left: 50%;
		transform: translateX(-50%);
		z-index: 30;
		width: max-content;
		max-width: min(300px, 78vw);
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
		opacity: 0;
		pointer-events: none;
		transition: opacity 150ms ease;
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
	.tip:focus-visible .tipbox {
		opacity: 1;
	}
</style>
