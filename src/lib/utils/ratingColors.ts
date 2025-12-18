/**
 * Utility functions for rating-based pin colors
 * Colors change based on average rating to provide visual feedback
 */

export interface RatingColorScheme {
  color: string;
  label: string;
  min: number;
  max: number;
}

export const RATING_COLOR_SCHEMES: RatingColorScheme[] = [
  { color: '#27ae60', label: 'Excelente', min: 4.0, max: 5.0 },   // Green
  { color: '#f39c12', label: 'Bom', min: 2.5, max: 3.99 },        // Yellow
  { color: '#e67e22', label: 'Regular', min: 1.5, max: 2.49 },    // Orange
  { color: '#e74c3c', label: 'Ruim', min: 0.01, max: 1.49 },      // Red
  { color: '#95a5a6', label: 'Sem avaliações', min: 0, max: 0 }   // Gray
];

/**
 * Get color based on average rating
 * @param averageRating - Average rating (0-5)
 * @returns Hex color code
 */
export function getRatingColor(averageRating: number | null | undefined): string {
  if (!averageRating || averageRating === 0) {
    return '#95a5a6'; // Gray - no rating
  }

  if (averageRating >= 4.0) {
    return '#27ae60'; // Green - excellent
  }

  if (averageRating >= 2.5) {
    return '#f39c12'; // Yellow - good
  }

  if (averageRating >= 1.5) {
    return '#e67e22'; // Orange - poor
  }

  return '#e74c3c'; // Red - very poor
}

/**
 * Get label based on average rating
 * @param averageRating - Average rating (0-5)
 * @returns Rating label in Portuguese
 */
export function getRatingLabel(averageRating: number | null | undefined): string {
  if (!averageRating || averageRating === 0) return 'Sem avaliações';
  if (averageRating >= 4.0) return 'Excelente';
  if (averageRating >= 2.5) return 'Bom';
  if (averageRating >= 1.5) return 'Regular';
  return 'Ruim';
}

/**
 * Get rating category (for analytics/grouping)
 * @param averageRating - Average rating (0-5)
 * @returns Category name
 */
export function getRatingCategory(averageRating: number | null | undefined): string {
  const scheme = RATING_COLOR_SCHEMES.find(s => {
    const rating = averageRating || 0;
    return rating >= s.min && rating <= s.max;
  });

  return scheme?.label || 'Sem avaliações';
}

/**
 * Check if rating is considered "good" (>= 2.5)
 * @param averageRating - Average rating (0-5)
 * @returns True if rating is good
 */
export function isGoodRating(averageRating: number | null | undefined): boolean {
  return (averageRating || 0) >= 2.5;
}
