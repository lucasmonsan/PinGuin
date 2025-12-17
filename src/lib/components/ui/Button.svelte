<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLButtonAttributes {
		children: Snippet;
		radius?: 'in' | 'out';
		variant?: 'ghost' | 'outline' | 'icon' | 'primary' | 'secondary' | '';
		invisible?: boolean;
	}

	let { children, variant = '', radius = 'in', invisible = false, ...rest }: Props = $props();
</script>

<button class="{variant} {radius}" class:invisible data-invisible={invisible} {...rest}>
	{@render children()}
</button>

<style>
	button {
		--btn-bg: var(--surface);
		--btn-color: var(--text-primary);
		--btn-bg-hover: var(--surface-hover, #f5f5f5);
		--btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--xxs);
		min-width: var(--xl);
		min-height: var(--xl);
		padding: var(--xs) var(--sm);
		font-weight: 600;
		font-size: var(--sm);
		border: none;
		cursor: pointer;
		user-select: none;
		-moz-user-select: none;
		-webkit-tap-highlight-color: transparent;
		background: var(--btn-bg);
		color: var(--btn-color);
		box-shadow: var(--btn-shadow);
		transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);

		&.in {
			border-radius: var(--radius-in);
		}

		&.out {
			border-radius: var(--radius-out);
		}

		/* Primary */
		&.primary {
			--btn-bg: var(--brand-primary);
			--btn-color: white;
			--btn-bg-hover: var(--brand-secondary);
			--btn-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
		}

		&.primary:hover:not(:disabled) {
			background: var(--btn-bg-hover);
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
		}

		&.primary:active:not(:disabled) {
			transform: translateY(0);
			box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
		}

		/* Secondary */
		&.secondary {
			--btn-bg: var(--bg-2);
			--btn-color: var(--text-primary);
			--btn-bg-hover: var(--bg);
			--btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		}

		&.secondary:hover:not(:disabled) {
			background: var(--btn-bg-hover);
			transform: translateY(-1px);
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
		}

		/* Outline */
		&.outline {
			--btn-bg: transparent;
			--btn-color: var(--text-primary);
			--btn-shadow: none;
			border: 2px solid var(--border-color);
		}

		&.outline:hover:not(:disabled) {
			border-color: var(--brand-primary);
			background: rgba(99, 102, 241, 0.05);
		}

		/* Icon */
		&.icon {
			--btn-bg: var(--surface);
			--btn-color: var(--text-primary);
			--btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			width: var(--xxxl);
			height: var(--xxxl);
			padding: 0;
			min-width: var(--xxxl);
			min-height: var(--xxxl);
		}

		&.icon:hover:not(:disabled):not(.invisible) {
			background: rgba(99, 102, 241, 0.1);
			transform: scale(1.05);
			animation: buttonPulse 0.3s ease;
		}

		&.icon:active:not(:disabled) {
			transform: scale(0.95);
		}

		/* Ghost */
		&.ghost {
			--btn-bg: transparent;
			--btn-color: var(--text-primary);
			--btn-shadow: none;
			padding: 0;
			border-radius: 0;
			min-width: auto;
			min-height: auto;
		}

		&.ghost:hover:not(:disabled):not(.invisible) {
			background: rgba(0, 0, 0, 0.05);
			border-radius: var(--radius-in);
		}

		/* Invisible - sem hover visível */
		&.invisible,
		&[data-invisible='true'] {
			--btn-bg: transparent;
			--btn-shadow: none;
		}

		&.invisible:hover:not(:disabled),
		&[data-invisible='true']:hover:not(:disabled) {
			background: transparent !important;
			box-shadow: none !important;
			transform: none !important;
		}

		/* Default hover */
		&:not(.ghost):not(.icon):not(.primary):not(.secondary):not(.outline):hover:not(:disabled):not(.invisible) {
			transform: translateY(-1px);
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
			background: rgba(99, 102, 241, 0.05);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			transform: none !important;
		}
	}

	@keyframes buttonPulse {
		0% {
			box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(99, 102, 241, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
		}
	}
</style>
