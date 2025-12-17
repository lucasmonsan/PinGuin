import type { PinWithDetails } from '$lib/types/database.types';

/**
 * Estado do BottomSheet
 * Gerencia abertura, expansão e conteúdo do modal de detalhes de pins
 */
class BottomSheetState {
	pin = $state<PinWithDetails | null>(null);
	expanded = $state(false);
	showReviewForm = $state(false);

	/**
	 * Abre BottomSheet com pin específico
	 */
	open(pin: PinWithDetails, options: { expanded?: boolean; showReviewForm?: boolean } = {}) {
		this.pin = pin;
		this.expanded = options.expanded ?? false;
		this.showReviewForm = options.showReviewForm ?? false;
	}

	/**
	 * Fecha BottomSheet completamente
	 */
	close() {
		this.pin = null;
		this.expanded = false;
		this.showReviewForm = false;
	}

	/**
	 * Expande BottomSheet (30% → 80%)
	 */
	expand() {
		this.expanded = true;
	}

	/**
	 * Colapsa BottomSheet (80% → 30%)
	 */
	collapse() {
		this.expanded = false;
		this.showReviewForm = false;
	}

	/**
	 * Toggle expansão
	 */
	toggleExpanded() {
		this.expanded = !this.expanded;
	}
}

export const bottomSheetState = new BottomSheetState();

