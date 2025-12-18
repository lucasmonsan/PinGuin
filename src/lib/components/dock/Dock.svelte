<script lang="ts">
	import { slideUp } from '$lib/utils/transitions';
	import { searchState } from '$lib/components/search/search.svelte';
	import { mapState } from '$lib/components/map/map.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import SearchBar from '$lib/components/search/SearchBar.svelte';
	import SearchHints from '$lib/components/search/SearchHints.svelte';
	import SearchResults from '$lib/components/search/SearchResults.svelte';
	import SearchHistory from '$lib/components/search/SearchHistory.svelte';
	import { Locate, User, Loader2 } from 'lucide-svelte';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import { authState } from '$lib/stores/auth.svelte';
	import { toast } from '$lib/components/toast/toast.svelte';
	import ProfileMenu from '../profile/ProfileMenu.svelte';

	async function handleLocateUser() {
		if (isLocating) return;
		isLocating = true;
		locatedRecently = false;

		try {
			await mapState.locateUser();
			locatedRecently = true;
			setTimeout(() => {
				locatedRecently = false;
			}, 2000);
		} catch (error) {
			// Erro já tratado no mapState
		} finally {
			isLocating = false;
		}
	}

	// Pesquisas recentes e dicas aparecem juntas quando input vazio e focado
	let showHistory = $derived(searchState.focused && searchState.query === '' && searchState.history.length > 0 && searchState.results.length === 0);
	let showHints = $derived(searchState.focused && searchState.query === '' && searchState.results.length === 0 && !searchState.hasSearched);
	let showResults = $derived(searchState.results.length > 0 || (searchState.hasSearched && searchState.focused));
	let isMenuOpen = $state(false);
	let isLocating = $state(false);
	let locatedRecently = $state(false);
</script>

<footer transition:slideUp={{ duration: 300 }}>
	{#if isMenuOpen}
		<ProfileMenu isOpen={isMenuOpen} onClose={() => (isMenuOpen = false)} />
	{:else if showResults}
		<SearchResults />
	{:else if showHints || showHistory}
		<!-- Dicas e histórico aparecem juntos -->
		{#if showHints}
			<SearchHints />
		{/if}
		{#if showHistory}
			<SearchHistory />
		{/if}
	{/if}

	<nav>
		<Button variant="icon" radius="out" onclick={() => (isMenuOpen = !isMenuOpen)} aria-label={i18n.t.buttons.profile}>
			{#if authState.user?.user_metadata?.avatar_url}
				<img src={authState.user.user_metadata.avatar_url} alt={authState.user.email || 'User'} class="user-avatar" />
			{:else}
				<User size="var(--md)" />
			{/if}
		</Button>
		<SearchBar />
		<Button variant="icon" radius="out" onclick={handleLocateUser} disabled={isLocating} aria-label={i18n.t.buttons.locate}>
			{#if isLocating}
				<Loader2 size="var(--md)" class="animate-spin" />
			{:else}
				<Locate size="var(--md)" />
			{/if}
		</Button>
	</nav>
</footer>

<style>
	footer {
		z-index: var(--z-dock, 10);
		position: fixed;
		bottom: max(var(--xs, 0.625rem), env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: var(--gap-2, 0.5rem);
		width: calc(100% - var(--md, 1rem));
		margin-left: auto;
		margin-right: auto;
		/* Garante que não fica atrás do teclado */
		transform: translateZ(0);
		will-change: transform;

		@media (min-width: 896px) {
			left: var(--xs, 0.625rem);
			width: 100%;
			max-width: calc(var(--md, 1rem) * 20);
		}
	}

	nav {
		display: flex;
		gap: var(--gap-2, 0.5rem);
		width: 100%;
	}

	.user-avatar {
		width: var(--md);
		height: var(--md);
		border-radius: 50%;
		object-fit: cover;
	}

	/* Ensure all icon buttons in nav have consistent size */
	:global(nav button[variant='icon']),
	:global(nav button.icon) {
		width: var(--xxxl) !important;
		height: var(--xxxl) !important;
		min-width: var(--xxxl) !important;
		min-height: var(--xxxl) !important;
		flex-shrink: 0;
	}

	/* Ensure all icons inside nav buttons have consistent size */
	:global(nav button svg) {
		width: var(--md) !important;
		height: var(--md) !important;
		flex-shrink: 0;
	}

	/* GPS Button feedback states */
	:global(button.gps-button) {
		border-radius: var(--radius-out) !important;
		overflow: hidden !important; /* Prevent ::before from affecting layout */
	}

	:global(button.gps-button.locating) {
		position: relative;
		animation: gpsPulse 1.5s ease-in-out infinite;
	}

	:global(button.gps-button.locating::before) {
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: calc(var(--radius-out) + 4px);
		border: 2px solid var(--brand-primary);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--brand-primary) 25%, transparent);
		pointer-events: none;
		z-index: -1;
	}

	:global(button.gps-button.located) {
		position: relative;
		transition: all 0.3s ease;
	}

	:global(button.gps-button.located::before) {
		content: '';
		position: absolute;
		inset: -4px;
		border-radius: calc(var(--radius-out) + 4px);
		border: 2px solid var(--success);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--success) 25%, transparent);
		pointer-events: none;
		z-index: -1;
		animation: successFade 2s ease-out forwards;
	}

	@keyframes gpsPulse {
		0%,
		100% {
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 25%, transparent);
		}
		50% {
			box-shadow: 0 0 0 6px color-mix(in srgb, var(--brand-primary) 15%, transparent);
		}
	}

	@keyframes successFade {
		0% {
			opacity: 1;
		}
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
