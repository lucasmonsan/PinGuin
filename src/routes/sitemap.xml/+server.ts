import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database.types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const baseUrl = 'https://map.monsan.duckdns.org';
	
	const supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get: (key) => cookies.get(key),
				set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
				remove: (key, options) => cookies.delete(key, { ...options, path: '/' })
			}
		}
	);
	
	// Buscar todos os pins públicos
	const { data: pins } = await supabase
		.from('map_pins')
		.select('id, name, updated_at')
		.order('updated_at', { ascending: false })
		.limit(1000); // Limitar a 1000 pins mais recentes
	
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<!-- Home Page -->
	<url>
		<loc>${baseUrl}/</loc>
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>
	
	<!-- Favorites Page -->
	<url>
		<loc>${baseUrl}/favorites</loc>
		<changefreq>weekly</changefreq>
		<priority>0.5</priority>
	</url>
	
	<!-- Pins -->
	${pins?.map((pin: { id: string; name: string; updated_at: string }) => `
	<url>
		<loc>${baseUrl}/?pin=${pin.id}</loc>
		<lastmod>${new Date(pin.updated_at).toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>`).join('') || ''}
</urlset>`;
	
	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600' // Cache de 1 hora
		}
	});
};

