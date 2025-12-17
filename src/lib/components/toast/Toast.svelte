<script lang="ts">
	import type { Toast as ToastType } from '$lib/types/toast.types';
	import { fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-svelte';
	import { slideDown } from '$lib/utils/transitions';

	interface Props {
		toast: ToastType;
		onDismiss: (id: string) => void;
	}

	let { toast, onDismiss }: Props = $props();

	const IconComponents = {
		success: CheckCircle,
		error: XCircle,
		info: Info,
		warning: AlertTriangle
	};

	const Icon = $derived(IconComponents[toast.type]);
</script>

<div 
	class="toast {toast.type}" 
	role="status" 
	aria-live="polite" 
	transition:fly={{ y: -20, duration: 300, easing: elasticOut }}
>
	<div class="icon-wrapper">
		<Icon size={20} />
	</div>
	<p>{toast.message}</p>
	<button class="close" onclick={() => onDismiss(toast.id)} aria-label={i18n.t.toast.close}>
		<X size={16} />
	</button>
	<div class="progress-bar"></div>
</div>

<style>
	.toast {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--xs);
		min-width: 300px;
		max-width: 500px;
		padding: var(--xs) var(--sm);
		border-radius: var(--radius-in);
		background: var(--surface);
		box-shadow: var(--shadow-lg);
		border-left: 4px solid transparent;
		overflow: hidden;
	}

	.toast.success {
		border-left-color: var(--success);
		background: color-mix(in srgb, var(--success) 8%, var(--surface));
	}

	.toast.error {
		border-left-color: var(--error);
		background: color-mix(in srgb, var(--error) 8%, var(--surface));
	}

	.toast.warning {
		border-left-color: var(--warning);
		background: color-mix(in srgb, var(--warning) 8%, var(--surface));
	}

	.toast.info {
		border-left-color: var(--brand-primary);
		background: color-mix(in srgb, var(--brand-primary) 8%, var(--surface));
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		animation: iconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.toast.success .icon-wrapper {
		color: var(--success);
	}

	.toast.error .icon-wrapper {
		color: var(--error);
	}

	.toast.warning .icon-wrapper {
		color: var(--warning);
	}

	.toast.info .icon-wrapper {
		color: var(--brand-primary);
	}

	p {
		flex: 1;
		margin: 0;
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
	}

	.close {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lg);
		height: var(--lg);
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--radius-in);
		cursor: pointer;
		flex-shrink: 0;
		color: var(--text-secondary);
		transition: all var(--fast);
	}

	.close:hover {
		background: var(--bg);
		color: var(--text-primary);
	}

	.close:active {
		transform: scale(0.95);
	}

	.progress-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 3px;
		width: 100%;
		transform-origin: left;
		animation: progressShrink 3s linear forwards;
	}

	.toast.success .progress-bar {
		background: var(--success);
	}

	.toast.error .progress-bar {
		background: var(--error);
	}

	.toast.warning .progress-bar {
		background: var(--warning);
	}

	.toast.info .progress-bar {
		background: var(--brand-primary);
	}

	@keyframes iconPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes progressShrink {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
</style>
