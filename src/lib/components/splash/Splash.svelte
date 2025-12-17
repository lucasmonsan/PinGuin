<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Loader2 } from 'lucide-svelte';
	import LogoIcon from '$lib/icons/LogoIcon.svelte';

	interface Props {
		show: boolean;
	}

	let { show = true }: Props = $props();
</script>

{#if show}
	<div class="splash" transition:fade={{ duration: 400 }}>
		<div class="content">
			<div class="logo">
				<LogoIcon />
			</div>
			<div class="loader">
				<Loader2 size={32} class="animate-spin" />
			</div>
		</div>
	</div>
{/if}

<style>
	.splash {
		position: fixed;
		inset: 0;
		z-index: var(--z-splash);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg);
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--xl);
	}

	.logo {
		width: 120px;
		height: 120px;
		color: var(--brand-primary);
		animation: pulse 2s ease-in-out infinite;
	}

	.loader {
		color: var(--brand-primary);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.03);
		}
	}
</style>

