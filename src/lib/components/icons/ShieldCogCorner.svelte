<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	// `ShieldCogCorner` is not part of the upstream lucide set (verified against
	// lucide-svelte 1.0.1 — the newest release at the time of writing). This
	// component composes lucide's own `shield` + `cog` path data, drawn in
	// lucide's stroke style (24×24 grid, currentColor, round caps/joins), so it
	// sits seamlessly next to real lucide icons.
	interface Props extends SVGAttributes<SVGSVGElement> {
		size?: number | string;
	}

	let { size = 24, class: className = '', ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	role="img"
	aria-label="shield with corner cog"
	{...rest}
>
	<!-- lucide `shield` -->
	<path
		d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
	/>
	<!-- background knockout so the corner cog reads as a clean notch in the outline -->
	<circle cx="17.9" cy="17.9" r="5.9" fill="var(--color-canvas, #fff)" stroke="none" />
	<!-- lucide `cog`, scaled 0.45 into the bottom-right corner (stroke 4.4 ≈ 2 after scale) -->
	<g transform="translate(17.9 17.9) scale(0.45) translate(-12 -12)" stroke-width="4.4">
		<path d="M11 10.27 7 3.34" />
		<path d="m11 13.73-4 6.93" />
		<path d="M12 22v-2" />
		<path d="M12 2v2" />
		<path d="M14 12h8" />
		<path d="m17 20.66-1-1.73" />
		<path d="m17 3.34-1 1.73" />
		<path d="M2 12h2" />
		<path d="m20.66 17-1.73-1" />
		<path d="m20.66 7-1.73 1" />
		<path d="m3.34 17 1.73-1" />
		<path d="m3.34 7 1.73 1" />
		<circle cx="12" cy="12" r="2" />
		<circle cx="12" cy="12" r="8" />
	</g>
</svg>
