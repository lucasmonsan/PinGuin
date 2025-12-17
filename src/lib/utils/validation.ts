/**
 * Validation utilities for user inputs
 */

export const validation = {
	// Coordenadas
	isValidLat(lat: number): boolean {
		return lat >= -90 && lat <= 90;
	},

	isValidLng(lng: number): boolean {
		return lng >= -180 && lng <= 180;
	},

	isValidCoords(lat: number, lng: number): boolean {
		return this.isValidLat(lat) && this.isValidLng(lng);
	},

	// Strings
	isValidPinName(name: string): boolean {
		const trimmed = name.trim();
		return trimmed.length >= 3 && trimmed.length <= 255;
	},

	isValidDescription(desc: string): boolean {
		return desc.length <= 1000;
	},

	isValidComment(comment: string): boolean {
		const trimmed = comment.trim();
		return trimmed.length >= 1 && trimmed.length <= 500;
	},

	// Email
	isValidEmail(email: string): boolean {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	},

	// UUID
	isValidUUID(uuid: string): boolean {
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		return regex.test(uuid);
	},

	// Imagem
	isValidImageType(file: File): boolean {
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		return validTypes.includes(file.type);
	},

	isValidImageSize(file: File, maxMB = 10): boolean {
		return file.size <= maxMB * 1024 * 1024;
	},

	// Rating
	isValidRating(rating: number): boolean {
		return rating >= 1 && rating <= 5 && Number.isInteger(rating);
	},

	// Sanitização
	sanitizeString(str: string): string {
		return str.trim().replace(/[<>]/g, '');
	},

	sanitizeHTML(dirty: string): string {
		// Remove todas as tags HTML
		return dirty.replace(/<[^>]*>/g, '');
	}
};

