/**
 * Keyboard Navigation Utilities
 * Helpers para navegação por teclado e acessibilidade
 */

export function handleEscapeKey(callback: () => void) {
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			callback();
		}
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('keydown', onKeydown);
	}

	return {
		destroy() {
			if (typeof window !== 'undefined') {
				window.removeEventListener('keydown', onKeydown);
			}
		}
	};
}

export function handleEnterKey(callback: () => void) {
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			callback();
		}
	}

	return { onKeydown };
}

/**
 * Makes a div keyboard accessible like a button
 */
export function makeClickable(node: HTMLElement, callback: () => void) {
	node.setAttribute('role', 'button');
	node.setAttribute('tabindex', '0');

	function handleClick() {
		callback();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			callback();
		}
	}

	node.addEventListener('click', handleClick);
	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
			node.removeEventListener('keydown', handleKeydown);
		}
	};
}

