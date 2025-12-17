<script lang="ts">
	import { slideUp } from '$lib/utils/transitions';
	import { searchState } from './search.svelte';
	import { i18n } from '$lib/i18n/i18n.svelte';
	import { haptics } from '$lib/utils/haptics';
	import { Clock, X } from 'lucide-svelte';
	import { getPlaceLabel } from '$lib/utils/osm';
	import { formatRelativeTime } from '$lib/utils/time';
	import type { OSMFeature } from '$lib/types/osm.types';

	interface SearchHistoryItem {
		query: string;
		timestamp: number;
		result: OSMFeature;
	}

	let history = $derived(searchState.history);

	function handleSelectHistory(item: SearchHistoryItem) {
		haptics.light();
		searchState.selectResult(item.result);
	}

	function handleClearHistory() {
		haptics.medium();
		searchState.clearHistory();
	}
</script>

{#if history.length > 0}
	<div class="history-container shadow" transition:slideUp>
		<div class="header">
			<h3>{i18n.t.search.history.title}</h3>
			<button onclick={handleClearHistory} aria-label={i18n.t.search.history.clear}>
				<X size={16} />
			</button>
		</div>

		<ul role="list" aria-label="Histórico de pesquisas">
			{#each history as item (item.timestamp)}
				<li>
					<button onclick={() => handleSelectHistory(item)} aria-label={`${item.result.properties.name}, pesquisado ${formatRelativeTime(item.timestamp)}`}>
						<div class="icon-wrapper">
							<Clock size={18} />
						</div>
						<div class="content">
							<strong>{item.result.properties.name}</strong>
							<small>{getPlaceLabel(item.result.properties)}</small>
						</div>
						<span class="time">{formatRelativeTime(item.timestamp)}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.history-container {
		width: 100%;
		background: var(--surface);
		border-radius: var(--radius-out);
		padding: var(--xs);
		box-shadow: var(--shadow-lg);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--xxs) var(--xs);
		margin-bottom: var(--xxs);
	}

	.header h3 {
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.header button {
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
		color: var(--text-secondary);
		transition: all var(--fast);
	}

	.header button:hover {
		background: var(--bg);
		color: var(--text-primary);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--xs);
		padding: var(--xs);
		background: transparent;
		border: none;
		border-radius: var(--radius-in);
		cursor: pointer;
		text-align: left;
		transition: background var(--fast);
	}

	li button:hover {
		background: var(--bg);
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--xxxs);
		min-width: 0;
	}

	.content strong {
		font-size: var(--sm);
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.content small {
		font-size: var(--xs);
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.time {
		font-size: var(--xs);
		color: var(--text-secondary);
		flex-shrink: 0;
	}
</style>

