import DOMPurify from 'isomorphic-dompurify';

/**
 * Validação robusta de inputs para segurança e integridade de dados
 */
export const validation = {
	// ==================== COORDENADAS ====================
	isValidLat(lat: number): boolean {
		return typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90;
	},

	isValidLng(lng: number): boolean {
		return typeof lng === 'number' && !isNaN(lng) && lng >= -180 && lng <= 180;
	},

	isValidCoordinates(lat: number, lng: number): boolean {
		return this.isValidLat(lat) && this.isValidLng(lng);
	},

	// ==================== STRINGS ====================
	sanitizeHTML(dirty: string): string {
		return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
	},

	isValidPinName(name: string): boolean {
		if (typeof name !== 'string') return false;
		const trimmed = name.trim();
		return trimmed.length >= 3 && trimmed.length <= 255;
	},

	isValidDescription(desc: string | null | undefined): boolean {
		if (!desc) return true; // Descrição é opcional
		if (typeof desc !== 'string') return false;
		return desc.trim().length <= 1000;
	},

	isValidComment(comment: string): boolean {
		if (typeof comment !== 'string') return false;
		const trimmed = comment.trim();
		return trimmed.length >= 1 && trimmed.length <= 500;
	},

	// ==================== EMAIL ====================
	isValidEmail(email: string): boolean {
		if (typeof email !== 'string') return false;
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email.trim());
	},

	// ==================== UUID ====================
	isValidUUID(uuid: string): boolean {
		if (typeof uuid !== 'string') return false;
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		return regex.test(uuid);
	},

	// ==================== RATING ====================
	isValidRating(rating: number): boolean {
		return (
			typeof rating === 'number' &&
			!isNaN(rating) &&
			Number.isInteger(rating) &&
			rating >= 1 &&
			rating <= 5
		);
	},

	// ==================== IMAGENS ====================
	isValidImageType(file: File): boolean {
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		return validTypes.includes(file.type);
	},

	isValidImageSize(file: File, maxMB = 5): boolean {
		return file.size > 0 && file.size <= maxMB * 1024 * 1024;
	},

	isValidImage(file: File, maxMB = 5): { valid: boolean; error?: string } {
		if (!this.isValidImageType(file)) {
			return { valid: false, error: 'Tipo de arquivo inválido. Use JPEG, PNG ou WebP.' };
		}
		if (!this.isValidImageSize(file, maxMB)) {
			return { valid: false, error: `Arquivo muito grande. Máximo ${maxMB}MB.` };
		}
		return { valid: true };
	},

	// ==================== URL ====================
	isValidURL(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	},

	// ==================== PHONE ====================
	isValidPhone(phone: string): boolean {
		if (typeof phone !== 'string') return false;
		// Aceita formatos: +55 11 99999-9999, (11) 99999-9999, 11999999999
		const regex = /^[\d\s\-\+\(\)]{10,20}$/;
		return regex.test(phone.trim());
	}
};
