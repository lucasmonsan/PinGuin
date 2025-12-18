<script lang="ts">
	import { AlertCircle } from 'lucide-svelte';
	import { authState } from '$lib/stores/auth.svelte';
	import { localDataStore } from '$lib/stores/localData.svelte';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import { slide } from 'svelte/transition';

	function handleLogin() {
		goto('https://auth.monsan.duckdns.org');
	}

	const totalItems = $derived(localDataStore.getTotalCount());
	const showBanner = $derived(!authState.user && localDataStore.hasLocalData());
</script>

{#if showBanner}
	<div class="offline-banner" transition:slide>
		<div class="banner-content">
			<AlertCircle size={18} />
			<span class="message">
				{i18n.t.offline?.banner || 'Você está no modo offline.'}
				<strong>{i18n.t.offline?.loginPrompt || 'Faça login'}</strong>
				{i18n.t.offline?.savePrompt || 'para salvar seus dados permanentemente.'}
			</span>
			<span class="count">{totalItems}</span>
		</div>
		<button onclick={handleLogin} class="login-btn">
			{i18n.t.buttons?.login || 'Login'}
		</button>
	</div>
{/if}

<style>
	.offline-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-header);
		background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
		color: white;
		padding: var(--xs) var(--sm);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sm);
		box-shadow: var(--shadow-md);
		font-size: var(--sm);
	}

	.banner-content {
		display: flex;
		align-items: center;
		gap: var(--xs);
		flex: 1;
	}

	.message {
		flex: 1;
	}

	.message strong {
		font-weight: 700;
		text-decoration: underline;
	}

	.count {
		background: rgba(255, 255, 255, 0.3);
		padding: 2px 8px;
		border-radius: var(--radius-in);
		font-weight: 600;
		font-size: var(--xs);
	}

	.login-btn {
		background: white;
		color: #e67e22;
		border: none;
		padding: var(--xxs) var(--sm);
		border-radius: var(--radius-in);
		font-weight: 600;
		cursor: pointer;
		transition: all var(--fast);
		font-size: var(--sm);
	}

	.login-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 640px) {
		.offline-banner {
			flex-direction: column;
			align-items: stretch;
			gap: var(--xs);
		}

		.banner-content {
			flex-direction: column;
			align-items: flex-start;
		}

		.login-btn {
			width: 100%;
		}
	}
</style>
