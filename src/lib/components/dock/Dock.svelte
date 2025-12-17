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
		
		try {
			await mapState.locateUser();
		} catch (error) {
			// Erro já tratado no mapState
		} finally {
			isLocating = false;
		}
	}

	let showHistory = $derived(searchState.focused && searchState.query === '' && searchState.history.length > 0 && searchState.results.length === 0);
	let showHints = $derived(searchState.focused && searchState.query === '' && searchState.history.length === 0 && searchState.results.length === 0 && !searchState.hasSearched);
	let showResults = $derived(searchState.results.length > 0 || (searchState.hasSearched && searchState.focused));
	let isMenuOpen = $state(false);
	let isLocating = $state(false);
</script>

<footer transition:slideUp={{ duration: 300 }}>
	{#if isMenuOpen}
		<ProfileMenu isOpen={isMenuOpen} onClose={() => (isMenuOpen = false)} />
	{:else if showResults}
		<SearchResults />
	{:else if showHistory}
		<SearchHistory />
	{:else if showHints}
		<SearchHints />
	{/if}

	<nav>
		<Button variant="icon" radius="out" onclick={() => (isMenuOpen = !isMenuOpen)} aria-label={i18n.t.buttons.profile}>
			{#if authState.user?.user_metadata?.avatar_url}
				<img src={authState.user.user_metadata.avatar_url} alt={authState.user.email || 'User'} class="user-avatar" />
			{:else}
				<User size={20} />
			{/if}
		</Button>
		<SearchBar />
		<Button variant="icon" radius="out" onclick={handleLocateUser} disabled={isLocating} aria-label={i18n.t.buttons.locate}>
			{#if isLocating}
				<div class="animate-spin">
					<Loader2 size={20} />
				</div>
			{:else}
				<Locate size={20} />
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
		width: 20px;
		height: 20px;
		border-radius: 50%;
		object-fit: cover;
	}
</style>
