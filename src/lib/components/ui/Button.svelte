<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		variant?: 'ghost' | 'outline' | 'icon' | '';
	}

	let { children, variant = '', ...rest }: Props = $props();
</script>

<button class={variant} {...rest}>
	{@render children()}
</button>

<style>
	button {
		position: relative;
		display: flex;
		background: var(--color-primary);
		border-radius: var(--radius-2);
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		-moz-user-select: none;

		&.icon {
			min-width: var(--xl);
			max-width: var(--xl);
			min-height: var(--xl);
			max-height: var(--xl);
			background: transparent;
		}
	}
</style>
