/**
 * Focus Trap - Mantém o foco dentro de um elemento para acessibilidade
 * Usado em modais e overlays
 */

export function createFocusTrap(element: HTMLElement) {
	const focusableElements = getFocusableElements(element);
	const firstFocusable = focusableElements[0];
	const lastFocusable = focusableElements[focusableElements.length - 1];

	// Foca no primeiro elemento
	firstFocusable?.focus();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== 'Tab') return;

		const focusableElements = getFocusableElements(element);
		const first = focusableElements[0];
		const last = focusableElements[focusableElements.length - 1];

		// Shift + Tab no primeiro elemento -> vai pro último
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last?.focus();
		}
		// Tab no último elemento -> vai pro primeiro
		else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first?.focus();
		}
	}

	element.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			element.removeEventListener('keydown', handleKeydown);
		}
	};
}

function getFocusableElements(element: HTMLElement): HTMLElement[] {
	const selector = [
		'a[href]',
		'button:not([disabled])',
		'textarea:not([disabled])',
		'input:not([disabled])',
		'select:not([disabled])',
		'[tabindex]:not([tabindex="-1"])'
	].join(',');

	return Array.from(element.querySelectorAll<HTMLElement>(selector)).filter(
		(el) => !el.hasAttribute('disabled') && el.offsetParent !== null
	);
}

