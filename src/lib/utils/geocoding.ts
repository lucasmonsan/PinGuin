/**
 * Geocoding utilities using Photon OSM API
 */

export interface ReverseGeocodeResult {
	street?: string;
	housenumber?: string;
	postcode?: string;
	city?: string;
	district?: string;
	state?: string;
	country?: string;
	name?: string;
}

/**
 * Reverse geocoding: convert coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult | null> {
	try {
		const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
		const response = await fetch(url);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		const feature = data.features?.[0];

		if (!feature || !feature.properties) {
			return null;
		}

		return feature.properties as ReverseGeocodeResult;
	} catch (error) {
		// Silently fail - address is optional
		return null;
	}
}

/**
 * Format address string from reverse geocode result
 */
export function formatAddress(result: ReverseGeocodeResult | null): string {
	if (!result) return '';

	const parts: string[] = [];

	// Street + number
	if (result.street) {
		if (result.housenumber) {
			parts.push(`${result.street}, ${result.housenumber}`);
		} else {
			parts.push(result.street);
		}
	} else if (result.name) {
		parts.push(result.name);
	}

	// District/Neighborhood
	if (result.district) {
		parts.push(result.district);
	}

	// City
	if (result.city) {
		parts.push(result.city);
	}

	// State
	if (result.state) {
		parts.push(result.state);
	}

	// Country (only if not obvious)
	if (result.country && result.country !== 'Brasil' && result.country !== 'Brazil') {
		parts.push(result.country);
	}

	return parts.length > 0 ? parts.join(' - ') : 'Localização não identificada';
}

