<script lang="ts">
	import { i18n } from '$lib/i18n/i18n.svelte';
</script>

<a href="#main-content" class="skip-link">
	{i18n.t.a11y?.skipToContent || 'Ir para o conteúdo principal'}
</a>

<style>
	.skip-link {
		position: absolute;
		top: -100px;
		left: 0;
		z-index: 100000;
		padding: var(--sm) var(--md);
		background: var(--brand-primary);
		color: white;
		font-weight: 600;
		text-decoration: none;
		border-radius: 0 0 var(--radius-in) 0;
		transition: top 0.2s ease;
	}

	.skip-link:focus {
		top: 0;
		outline: 3px solid var(--brand-secondary);
		outline-offset: 2px;
	}
</style>

