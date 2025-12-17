<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		circle?: boolean;
		className?: string;
	}

	let { width = '100%', height = '1rem', circle = false, className = '' }: Props = $props();
</script>

<div
	class="skeleton {className}"
	class:circle
	style:width
	style:height
	role="status"
	aria-label="Carregando..."
></div>

<style>
	.skeleton {
		background: linear-gradient(
			90deg,
			var(--bg-2) 0%,
			var(--surface) 50%,
			var(--bg-2) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s ease-in-out infinite;
		border-radius: var(--radius-in);
	}

	.skeleton.circle {
		border-radius: 50%;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>

