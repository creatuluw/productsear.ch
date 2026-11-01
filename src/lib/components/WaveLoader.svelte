<!--
  Symmetric wave loader — reverse-engineered from 21st.dev loading-ui/symmetric-wave.

  The original ships five mirrored @keyframes assigned to cells [1,2,3,4,5,5,4,3,2,1].
  Equivalent, simpler: ONE pulse keyframe peaking at 50%, plus mirrored negative
  animation-delays — cell peaks [0, .125, .25, .375, .5, .5, .375, .25, .125, 0] of the
  cycle give delay = (peak − 0.5) × duration, so pulses travel edge→center and back,
  symmetrically. Color ramps gray → accent (#0021FF) toward the center; each char is a
  vertical gradient (lighter top) with a soft glow that fades in/out with the pulse.
-->
<span class="wave-loader" role="status" aria-label="loading">
	{#each Array(10) as _}<i>░</i>{/each}
	<span class="sr-only">loading</span>
</span>

<style>
	.wave-loader {
		--wave-duration: 2s;
		display: inline-flex;
		height: 1em;
		max-width: 100%;
		overflow: hidden;
		font-size: 0.875em;
		line-height: 1;
		user-select: none;
	}
	/* the dim ░ track each lit █ rises out of */
	.wave-loader i {
		position: relative;
		display: flex;
		width: 1ch;
		height: 100%;
		align-items: center;
		justify-content: center;
		font-style: normal;
		color: var(--color-ink-faint);
		opacity: 0.35;
	}
	.wave-loader i::before {
		content: '█';
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(180deg, color-mix(in oklch, var(--c) 45%, white), var(--c));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: 0 0 6px color-mix(in oklch, var(--c) 55%, transparent);
		opacity: 0;
		animation: wave-pulse var(--wave-duration) linear infinite;
	}
	/* gray → accent ramp, mirrored from both edges to the center */
	.wave-loader i:nth-child(1)::before,
	.wave-loader i:nth-child(10)::before {
		--c: oklch(0.8 0.012 264);
	}
	.wave-loader i:nth-child(2)::before,
	.wave-loader i:nth-child(9)::before {
		--c: oklch(0.7 0.04 264);
	}
	.wave-loader i:nth-child(3)::before,
	.wave-loader i:nth-child(8)::before {
		--c: oklch(0.6 0.1 264);
	}
	.wave-loader i:nth-child(4)::before,
	.wave-loader i:nth-child(7)::before {
		--c: oklch(0.52 0.2 264);
	}
	.wave-loader i:nth-child(5)::before,
	.wave-loader i:nth-child(6)::before {
		--c: var(--color-accent);
	}
	/* mirrored negative delays turn one pulse into the symmetric wave */
	.wave-loader i:nth-child(1)::before,
	.wave-loader i:nth-child(10)::before {
		animation-delay: calc(var(--wave-duration) * -0.5);
	}
	.wave-loader i:nth-child(2)::before,
	.wave-loader i:nth-child(9)::before {
		animation-delay: calc(var(--wave-duration) * -0.375);
	}
	.wave-loader i:nth-child(3)::before,
	.wave-loader i:nth-child(8)::before {
		animation-delay: calc(var(--wave-duration) * -0.25);
	}
	.wave-loader i:nth-child(4)::before,
	.wave-loader i:nth-child(7)::before {
		animation-delay: calc(var(--wave-duration) * -0.125);
	}
	@keyframes wave-pulse {
		0%,
		12.5% {
			opacity: 0;
		}
		25% {
			opacity: 0.3;
		}
		37.5% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
		62.5% {
			opacity: 0.6;
		}
		75% {
			opacity: 0.3;
		}
		87.5%,
		100% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wave-loader i::before {
			animation: none;
			opacity: 0.45;
		}
	}
</style>
