<script>
	import { slide } from 'svelte/transition';
	import Button from '../ui/Button.svelte';
	import SearchBar from '../search/SearchBar.svelte';
	import GPSIcon from '$lib/icons/GPSIcon.svelte';
	import ProfileIcon from '$lib/icons/ProfileIcon.svelte';

	let start = $state(false);

	$effect(() => {
		start = true;
	});
</script>

{#if start}
	<footer transition:slide={{ axis: 'y' }}>
		<Button variant="icon">
			<ProfileIcon />
		</Button>
		<SearchBar />
		<Button variant="icon">
			<GPSIcon />
		</Button>
	</footer>
{/if}

<style>
	footer {
		z-index: var(--z-dock, 2);
		position: fixed;
		bottom: 0;
		display: flex;
		gap: var(--gap-1);
		width: 100%;
		padding: var(--padd-component);
		padding-top: var(--sm);
		background: var(--color-surface-100);
		border-radius: var(--radius-3) var(--radius-3) 0 0;
		box-shadow: var(--shadow-black, 0px 0px 20px 4px rgba(0, 0, 0, 0.25));

		@media (min-width: 896px) {
			left: var(--xs);
			bottom: var(--xs);
			max-width: calc(var(--md) * 20);
			padding-top: var(--xs);
			border-radius: var(--radius-3);
		}
	}
</style>
