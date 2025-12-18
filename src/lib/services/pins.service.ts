import { supabase } from './supabase';
import { ErrorHandler } from '$lib/utils/errorHandler';
import { validation } from '$lib/utils/validation';
import type { Pin, PinInsert, PinUpdate, PinWithCategory, PinWithDetails } from '$lib/types/database.types';

export class PinsService {

	static async getPins(userId?: string): Promise<PinWithCategory[]> {
		let query = supabase
			.from('map_pins')
			.select(`
				*,
				category:map_pin_categories(*)
			`)
			.order('created_at', { ascending: false });

		if (userId) {
			query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
		} else {
			query = query.eq('is_public', true);
		}

		const { data, error } = await query;

		if (error) throw error;
		return data as PinWithCategory[];
	}


	static async getPinById(pinId: string, userId?: string): Promise<PinWithDetails | null> {
		const { data: pin, error: pinError } = await supabase
			.from('map_pins')
			.select(`
				*,
				category:map_pin_categories(*)
			`)
			.eq('id', pinId)
			.single();

		if (pinError || !pin) return null;

		const { data: reviews } = await supabase
			.from('map_reviews')
			.select('*')
			.eq('pin_id', pinId)
			.order('created_at', { ascending: false });

		const { count: favoritesCount } = await supabase
			.from('map_favorites')
			.select('*', { count: 'exact', head: true })
			.eq('pin_id', pinId);


		let isFavorited = false;
		if (userId) {
			const { data: favorite } = await supabase
				.from('map_favorites')
				.select('id')
				.eq('pin_id', pinId)
				.eq('user_id', userId)
				.maybeSingle();

			isFavorited = !!favorite;
		}

		const ratings = reviews?.map(r => r.rating) || [];
		const averageRating = ratings.length > 0
			? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
			: 0;

		return {
			...pin,
			reviews: reviews || [],
			favorites_count: favoritesCount || 0,
			average_rating: averageRating,
			is_favorited: isFavorited
		} as PinWithDetails;
	}

	static async getPinsByBounds(
		minLat: number,
		maxLat: number,
		minLng: number,
		maxLng: number,
		userId?: string
	): Promise<PinWithCategory[]> {
		let query = supabase
			.from('map_pins')
			.select(`
				*,
				category:map_pin_categories(*)
			`)
			.gte('latitude', minLat)
			.lte('latitude', maxLat)
			.gte('longitude', minLng)
			.lte('longitude', maxLng);

		if (userId) {
			query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
		} else {
			query = query.eq('is_public', true);
		}

		const { data, error } = await query;

		if (error) throw error;
		return data as PinWithCategory[];
	}

	static async getUserPins(userId: string): Promise<PinWithCategory[]> {
		const { data, error } = await supabase
			.from('map_pins')
			.select(`
				*,
				category:map_pin_categories(*)
			`)
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data as PinWithCategory[];
	}

	static async createPin(pin: PinInsert): Promise<Pin> {
		if (!validation.isValidCoordinates(pin.latitude, pin.longitude)) {
			throw new Error('Coordenadas inválidas');
		}

		if (!validation.isValidPinName(pin.name)) {
			throw new Error('Nome do local deve ter entre 3 e 255 caracteres');
		}

		if (pin.description && !validation.isValidDescription(pin.description)) {
			throw new Error('Descrição muito longa (máximo 1000 caracteres)');
		}

		if (!validation.isValidUUID(pin.user_id)) {
			throw new Error('ID de usuário inválido');
		}

		if (!validation.isValidUUID(pin.category_id)) {
			throw new Error('ID de categoria inválido');
		}


		const sanitizedPin: PinInsert = {
			...pin,
			name: validation.sanitizeHTML(pin.name.trim()),
			description: pin.description ? validation.sanitizeHTML(pin.description.trim()) : null
		};

		try {
			const { data, error } = await supabase
				.from('map_pins')
				.insert(sanitizedPin)
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			ErrorHandler.handle(error, 'PinsService.createPin');
			throw error;
		}
	}

	static async updatePin(pinId: string, updates: PinUpdate): Promise<Pin> {
		if (!validation.isValidUUID(pinId)) {
			throw new Error('ID de pin inválido');
		}

		if (updates.name !== undefined && !validation.isValidPinName(updates.name)) {
			throw new Error('Nome do local deve ter entre 3 e 255 caracteres');
		}

		if (updates.description !== undefined && updates.description !== null && !validation.isValidDescription(updates.description)) {
			throw new Error('Descrição muito longa (máximo 1000 caracteres)');
		}

		if (updates.latitude !== undefined && updates.longitude !== undefined) {
			if (!validation.isValidCoordinates(updates.latitude, updates.longitude)) {
				throw new Error('Coordenadas inválidas');
			}
		}

		const sanitizedUpdates: PinUpdate = { ...updates };
		if (updates.name) {
			sanitizedUpdates.name = validation.sanitizeHTML(updates.name.trim());
		}
		if (updates.description) {
			sanitizedUpdates.description = validation.sanitizeHTML(updates.description.trim());
		}

		const { data, error } = await supabase
			.from('map_pins')
			.update(sanitizedUpdates)
			.eq('id', pinId)
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	static async deletePin(pinId: string): Promise<void> {
		const { error } = await supabase
			.from('map_pins')
			.delete()
			.eq('id', pinId);

		if (error) throw error;
	}

	static async toggleFavorite(pinId: string, userId: string): Promise<boolean> {
		const { data: existing } = await supabase
			.from('map_favorites')
			.select('id')
			.eq('pin_id', pinId)
			.eq('user_id', userId)
			.maybeSingle();

		if (existing) {
			const { error } = await supabase
				.from('map_favorites')
				.delete()
				.eq('id', existing.id);

			if (error) throw error;
			return false;
		} else {
			const { error } = await supabase
				.from('map_favorites')
				.insert({ pin_id: pinId, user_id: userId });

			if (error) throw error;
			return true;
		}
	}

	static async getUserFavorites(userId: string): Promise<PinWithCategory[]> {
		const { data, error } = await supabase
			.from('map_favorites')
			.select(`
				pin:map_pins(
					*,
					category:map_pin_categories(*)
				)
			`)
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return (data?.map(f => f.pin).filter(Boolean) || []) as PinWithCategory[];
	}

	static async uploadPhoto(
		originalFile: File,
		thumbnailFile: File,
		pinId: string
	): Promise<{ original: string; thumbnail: string }> {
		const formData = new FormData();
		formData.append('original', originalFile);
		formData.append('thumbnail', thumbnailFile);
		formData.append('pinId', pinId);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Upload failed');
		}

		return await response.json();
	}

	static async deletePhoto(photoUrl: string): Promise<void> {
		// This would need an API endpoint to delete from R2
		// For now, we'll just handle it server-side when deleting the pin
	}

	// ========== Reviews ==========

	static async createReview(review: {
		pin_id: string;
		user_id: string;
		rating: number;
		comment?: string | null;
		photos?: string[];
	}): Promise<void> {
		if (!validation.isValidUUID(review.pin_id)) {
			throw new Error('ID de pin inválido');
		}

		if (!validation.isValidUUID(review.user_id)) {
			throw new Error('ID de usuário inválido');
		}

		if (!validation.isValidRating(review.rating)) {
			throw new Error('Rating deve ser um número inteiro entre 1 e 5');
		}

		if (review.comment && !validation.isValidComment(review.comment)) {
			throw new Error('Comentário deve ter entre 1 e 500 caracteres');
		}

		const sanitizedReview = {
			...review,
			comment: review.comment ? validation.sanitizeHTML(review.comment.trim()) : null
		};

		const { data: existing } = await supabase
			.from('map_reviews')
			.select('id')
			.eq('pin_id', review.pin_id)
			.eq('user_id', review.user_id)
			.maybeSingle();

		if (existing) {
			throw new Error('Você já avaliou este local');
		}

		const { error } = await supabase.from('map_reviews').insert(sanitizedReview);

		if (error) throw error;
	}

	static async toggleReviewUpvote(reviewId: string, userId: string): Promise<boolean> {
		const { data: existing } = await supabase
			.from('map_review_upvotes')
			.select('id')
			.eq('review_id', reviewId)
			.eq('user_id', userId)
			.maybeSingle();

		if (existing) {
			const { error } = await supabase
				.from('map_review_upvotes')
				.delete()
				.eq('id', existing.id);

			if (error) throw error;
			return false;
		} else {
			const { error } = await supabase
				.from('map_review_upvotes')
				.insert({ review_id: reviewId, user_id: userId });

			if (error) throw error;
			return true;
		}
	}

	static async reportReview(reviewId: string, userId: string): Promise<void> {
		throw new Error('Feature não implementada');
	}
}

