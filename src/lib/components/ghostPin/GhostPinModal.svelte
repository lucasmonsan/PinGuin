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
	import Button from '../ui/Button.svelte';
	import { getCategoryIcon } from '$lib/config/categories';

	function handleCreateNew() {
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
	}
</script>

{#if ghostPinState.showGhost}
	<button
		class="overlay"
		onclick={handleCancel}
		transition:fade={{ duration: 200 }}
		aria-label="Fechar"
	></button>

	<div class="ghost-modal" transition:fly={{ y: 500, duration: 300 }}>
		{#if ghostPinState.nearbyPins.length > 0}
			<!-- Aviso de pins próximos -->
			<div class="warning-section">
				<div class="warning-icon">
					<AlertTriangle size={32} />
				</div>
				<h3>Locais próximos encontrados</h3>
				<p>Encontramos {ghostPinState.nearbyPins.length} {ghostPinState.nearbyPins.length === 1 ? 'local próximo' : 'locais próximos'}. Deseja adicionar um novo ou selecionar um existente?</p>
			</div>

			<!-- Lista de pins próximos -->
			<div class="nearby-list">
				{#each ghostPinState.nearbyPins as pin (pin.id)}
					{@const CategoryIcon = getCategoryIcon(pin.category?.name || 'other')}
					<button class="nearby-item" onclick={() => handleSelectExisting(pin.id)}>
						<div class="nearby-icon" style="background-color: {pin.category?.color || '#7f8c8d'};">
							<CategoryIcon size={20} color="white" />
						</div>
						<div class="nearby-info">
							<strong>{pin.name}</strong>
							<small>{pin.category?.name || 'Outro'}</small>
						</div>
					</button>
				{/each}
			</div>

			<!-- Botão criar novo -->
			<Button variant="primary" onclick={handleCreateNew}>
				<Plus size={20} />
				Criar novo local
			</Button>
		{:else}
			<!-- Sem pins próximos - cria direto -->
			<div class="empty-section">
				<div class="empty-icon">
					<MapPin size={48} />
				</div>
				<h3>Adicionar novo local</h3>
				<p>Nenhum local próximo encontrado. Deseja adicionar um novo marcador aqui?</p>

				<div class="actions">
					<Button variant="ghost" onclick={handleCancel}>Cancelar</Button>
					<Button variant="primary" onclick={handleCreateNew}>
						<Plus size={20} />
						Criar local
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
		box-shadow: var(--shadow-lg);
		padding: var(--lg);
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--md);
		max-height: 70vh;
		overflow-y: auto;
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
	}

	.empty-icon {
		color: var(--brand-primary);
	}

	h3 {
		font-size: var(--lg);
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	p {
		font-size: var(--sm);
		color: var(--text-secondary);
		margin: 0;
		max-width: 400px;
	}

	.nearby-list {
		display: flex;
		flex-direction: column;
		gap: var(--xs);
	}

	.nearby-item {
		display: flex;
		align-items: center;
		gap: var(--xs);
		padding: var(--xs);
		background: var(--bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-in);
		cursor: pointer;
		transition: all var(--fast);
		text-align: left;
	}

	.nearby-item:hover {
		background: var(--bg-2);
		border-color: var(--brand-primary);
		transform: translateX(4px);
	}

	.nearby-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.nearby-info {
		display: flex;
		flex-direction: column;
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
		margin-top: var(--md);
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

