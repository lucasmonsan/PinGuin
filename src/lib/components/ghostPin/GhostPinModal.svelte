<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { MapPin, Plus, AlertTriangle } from 'lucide-svelte';
	import { ghostPinState } from '$lib/stores/ghostPin.svelte';
	import { navigationService } from '$lib/services/navigation.service';
	import { authState } from '$lib/stores/auth.svelte';
	import { haptics } from '$lib/utils/haptics';
	import { toast } from '$lib/components/toast/toast.svelte';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import { validation } from '$lib/utils/validation';
	import Button from '../ui/Button.svelte';
	import { getCategoryIcon } from '$lib/config/categories';
	import { createFocusTrap } from '$lib/utils/focusTrap';
	import { handleEscapeKey } from '$lib/utils/keyboard';
	import { onMount } from 'svelte';

	let modalElement: HTMLDivElement;

	onMount(() => {
		if (!modalElement) return;

		const trap = createFocusTrap(modalElement);
		const escapeHandler = handleEscapeKey(handleCancel);
		return () => {
			trap.destroy();
			escapeHandler.destroy();
		};
	});

	function handleCreateNew() {
		if (!validation.isValidCoordinates(ghostPinState.latitude, ghostPinState.longitude)) {
			toast.error(i18n.t.errors.invalidCoordinates || 'Coordenadas inválidas');
			ghostPinState.clear();
			return;
		}
		if (!authState.user) {
			toast.error(i18n.t.errors.loginRequired);
			ghostPinState.clear();
			return;
		}

		// Passa coords via query params
		const params = new URLSearchParams({
			lat: ghostPinState.latitude.toString(),
			lng: ghostPinState.longitude.toString()
		});

		haptics.medium();
		ghostPinState.clear();
		// Limpar marcador visual do mapa
		import('$lib/components/map/map.svelte').then(({ mapState }) => {
			mapState.clearGhostPin();
		});
		goto(`/pins/new?${params}`);
	}

	function handleSelectExisting(pinId: string) {
		haptics.light();
		ghostPinState.clear();
		navigationService.openPin(pinId, true);
	}

	function handleCancel() {
		haptics.light();
		ghostPinState.clear();
		// Limpar marcador visual do mapa
		import('$lib/components/map/map.svelte').then(({ mapState }) => {
			mapState.clearGhostPin();
		});
	}
</script>

{#if ghostPinState.showGhost}
	<button class="overlay" onclick={handleCancel} transition:fade={{ duration: 200 }} aria-label="Fechar"></button>

	<div bind:this={modalElement} class="ghost-modal" transition:fly={{ y: 500, duration: 300 }} role="dialog" aria-modal="true" aria-labelledby="ghost-pin-title">
		{#if ghostPinState.nearbyPins.length > 0}
			<!-- Aviso de pins próximos -->
			<div class="warning-section">
				<div class="warning-icon">
					<AlertTriangle size={24} />
				</div>
				<h2 id="ghost-pin-title" class="visually-hidden">{i18n.t.ghostPin.nearbyFound}</h2>
				<h3>{i18n.t.ghostPin.nearbyFound}</h3>
				<p>
					{i18n.t.ghostPin.nearbyFoundDesc.replace('{count}', ghostPinState.nearbyPins.length.toString())}
				</p>
				{#if ghostPinState.loadingAddress}
					<p class="address-loading">{i18n.t.ghostPin.loadingAddress}</p>
				{:else if ghostPinState.address}
					<p class="address-text"><strong>{ghostPinState.address}</strong></p>
				{/if}
			</div>

			<!-- Lista de pins próximos -->
			<div class="nearby-list">
				{#each ghostPinState.nearbyPins as pin (pin.id)}
					{@const CategoryIcon = getCategoryIcon(pin.category?.name || 'other')}
					<button class="nearby-item" onclick={() => handleSelectExisting(pin.id)}>
						<div class="nearby-icon" style="background-color: {pin.category?.color || '#7f8c8d'};">
							<CategoryIcon size={18} color="white" />
						</div>
						<div class="nearby-info">
							<strong>{pin.name}</strong>
							<small>{i18n.t.categories[pin.category?.name || 'other'] || pin.category?.name || i18n.t.categories.other}</small>
						</div>
					</button>
				{/each}
			</div>

			<!-- Botão criar novo -->
			<Button variant="primary" onclick={handleCreateNew} disabled={ghostPinState.loadingAddress || !ghostPinState.address}>
				<Plus size={18} />
				{i18n.t.ghostPin.createNew}
			</Button>
		{:else}
			<!-- Sem pins próximos - cria direto -->
			<div class="empty-section">
				<div class="empty-icon">
					<MapPin size={36} />
				</div>
				<h3>{i18n.t.ghostPin.addNew}</h3>
				<p>{i18n.t.ghostPin.addNewDesc}</p>
				{#if ghostPinState.loadingAddress}
					<p class="address-loading">{i18n.t.ghostPin.loadingAddress}</p>
				{:else if ghostPinState.address}
					<p class="address-text"><strong>{ghostPinState.address}</strong></p>
				{/if}

				<div class="actions">
					<Button variant="outline" onclick={handleCancel}>{i18n.t.buttons.cancel}</Button>
					<Button variant="primary" onclick={handleCreateNew} disabled={ghostPinState.loadingAddress || !ghostPinState.address}>
						<Plus size={18} />
						{i18n.t.ghostPin.create}
					</Button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: var(--overlay);
		backdrop-filter: blur(2px);
		border: none;
		padding: 0;
		cursor: default;
	}

	.ghost-modal {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: calc(var(--z-modal) + 1);
		background: var(--surface);
		border-radius: var(--radius-out) var(--radius-out) 0 0;
		box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
		padding: var(--md);
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--sm);
		max-height: 80vh;
		overflow-y: auto;
		text-align: center;
	}

	.warning-section,
	.empty-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--xs);
		text-align: center;
	}

	.warning-icon {
		color: var(--warning);
		margin-bottom: var(--xxs);
		padding: var(--xs);
		background: color-mix(in srgb, var(--warning) 10%, transparent);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty-icon {
		color: var(--brand-primary);
		margin-bottom: var(--xxs);
		padding: var(--sm);
		background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h3 {
		font-size: var(--lg);
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.3;
	}

	p {
		font-size: var(--sm);
		color: var(--text-secondary);
		margin: 0;
		max-width: 450px;
		line-height: 1.4;
	}

	.address-text {
		font-size: var(--sm);
		color: var(--text-primary);
		margin-top: var(--xs);
		padding: var(--xs) var(--sm);
		background: linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%);
		border-radius: var(--radius-md);
		border: 2px solid color-mix(in srgb, var(--brand-primary) 20%, transparent);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.address-text strong {
		color: var(--brand-primary);
		font-weight: 600;
	}

	.address-loading {
		font-size: var(--xs);
		color: var(--text-secondary);
		font-style: italic;
		margin-top: var(--xxs);
	}

	.nearby-list {
		display: flex;
		flex-direction: column;
		gap: var(--xxs);
	}

	.nearby-item {
		display: flex;
		align-items: center;
		gap: var(--xs);
		padding: var(--xs);
		background: var(--bg);
		border: 2px solid var(--border-color);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
		text-align: left;
	}

	.nearby-item:hover {
		background: var(--bg-2);
		border-color: var(--brand-primary);
		transform: translateX(4px) scale(1.02);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.nearby-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.nearby-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nearby-info strong {
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
	}

	.nearby-info small {
		font-size: var(--xs);
		color: var(--text-secondary);
	}

	.actions {
		display: flex;
		gap: var(--xs);
		width: 100%;
		margin-top: var(--sm);
	}

	.actions :global(button) {
		flex: 1;
	}

	@media (min-width: 768px) {
		.ghost-modal {
			bottom: var(--md);
			left: 50%;
			transform: translateX(-50%);
			border-radius: var(--radius-out);
		}
	}
</style>
