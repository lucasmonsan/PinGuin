export interface SEOConfig {
	title: string;
	description: string;
	image?: string;
	url?: string;
	type?: 'website' | 'article';
	author?: string;
	keywords?: string[];
}

export function generateMetaTags(config: SEOConfig): string {
	const baseUrl = 'https://map.monsan.duckdns.org';
	const defaultImage = `${baseUrl}/og-image.png`;

	const title = config.title || 'LocaList - Mapeamento Colaborativo';
	const description =
		config.description ||
		'Descubra, avalie e compartilhe lugares incríveis. Sistema de mapeamento colaborativo com reviews, fotos e favoritos.';
	const image = config.image || defaultImage;
	const url = config.url || baseUrl;
	const type = config.type || 'website';

	return `
		<!-- Primary Meta Tags -->
		<title>${title}</title>
		<meta name="title" content="${title}" />
		<meta name="description" content="${description}" />
		${config.keywords ? `<meta name="keywords" content="${config.keywords.join(', ')}" />` : ''}
		${config.author ? `<meta name="author" content="${config.author}" />` : ''}
		
		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="${type}" />
		<meta property="og:url" content="${url}" />
		<meta property="og:title" content="${title}" />
		<meta property="og:description" content="${description}" />
		<meta property="og:image" content="${image}" />
		<meta property="og:site_name" content="LocaList" />
		<meta property="og:locale" content="pt_BR" />
		
		<!-- Twitter -->
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="${url}" />
		<meta property="twitter:title" content="${title}" />
		<meta property="twitter:description" content="${description}" />
		<meta property="twitter:image" content="${image}" />
		
		<!-- Additional SEO -->
		<meta name="robots" content="index, follow" />
		<meta name="googlebot" content="index, follow" />
		<link rel="canonical" href="${url}" />
	`.trim();
}

export const defaultSEO: SEOConfig = {
	title: 'LocaList - Mapeamento Colaborativo',
	description:
		'Descubra, avalie e compartilhe lugares incríveis. Sistema de mapeamento colaborativo com reviews, fotos e favoritos.',
	keywords: [
		'mapa',
		'colaborativo',
		'reviews',
		'avaliações',
		'lugares',
		'localização',
		'GPS',
		'favoritos',
		'fotos'
	],
	type: 'website'
};

export function getSEOForPin(pinName: string, pinDescription?: string, pinImage?: string): SEOConfig {
	return {
		title: `${pinName} - LocaList`,
		description: pinDescription || `Veja avaliações, fotos e informações sobre ${pinName} no LocaList`,
		image: pinImage,
		type: 'article'
	};
}

export function getSEOForFavorites(userName?: string): SEOConfig {
	return {
		title: `Favoritos${userName ? ` de ${userName}` : ''} - LocaList`,
		description: 'Meus lugares favoritos salvos no LocaList',
		type: 'website'
	};
}

