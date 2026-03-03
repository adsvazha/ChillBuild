export interface Asset {
    id: string;
    url: string;
    thumbnail: string;
    type: 'image' | 'sticker';
    alt: string;
}

export class AssetService {
    static async searchImages(query: string): Promise<Asset[]> {
        try {
            // Use public Unsplash search API
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=v9pM6TfE7Q6m-fUvU0D5w6l6P2vW_z3G3B9u6v-C-6U`);

            // If the above fails (due to rate limit or key), fallback to a simpler source
            if (!response.ok) {
                return this.getFallbackImages(query);
            }

            const data = await response.json();
            return data.results.map((item: any) => ({
                id: item.id,
                url: item.urls.regular,
                thumbnail: item.urls.small || item.urls.thumb,
                type: 'image',
                alt: item.alt_description || 'Image',
            }));
        } catch (error) {
            console.error('Failed to search images:', error);
            return this.getFallbackImages(query);
        }
    }

    private static getFallbackImages(query: string): Asset[] {
        // Return a set of high-quality placeholder images based on the query
        const encodedQuery = encodeURIComponent(query);
        return Array.from({ length: 8 }).map((_, i) => ({
            id: `fallback-${i}`,
            url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&w=800&q=80&sig=${encodedQuery}-${i}`,
            thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?auto=format&fit=crop&w=300&q=60&sig=${encodedQuery}-${i}`,
            type: 'image',
            alt: `${query} image ${i}`,
        }));
    }

    static async searchStickers(query: string): Promise<Asset[]> {
        try {
            // Search Unsplash specifically for illustrations/stickers
            const searchQuery = `${query || 'decorative'} sticker illustration vector`;
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12&orientation=squarish&client_id=v9pM6TfE7Q6m-fUvU0D5w6l6P2vW_z3G3B9u6v-C-6U`
            );

            // If Unsplash works, we get a good variety
            if (response.ok) {
                const data = await response.json();
                return data.results.map((item: any) => ({
                    id: `sticker-${item.id}`,
                    url: item.urls.regular,
                    thumbnail: item.urls.small || item.urls.thumb,
                    type: 'sticker',
                    alt: item.alt_description || 'Sticker',
                }));
            }

            return this.getFallbackStickers(query);
        } catch (error) {
            console.error('Failed to search stickers:', error);
            return this.getFallbackStickers(query);
        }
    }

    private static getFallbackStickers(query: string): Asset[] {
        const q = (query || '').toLowerCase();

        // Meaningful mapping for common keywords
        const categoryMap: Record<string, string[]> = {
            coffee: [
                'https://cdn-icons-png.flaticon.com/512/2935/2935307.png',
                'https://cdn-icons-png.flaticon.com/512/924/924514.png',
                'https://cdn-icons-png.flaticon.com/512/3124/3124388.png'
            ],
            travel: [
                'https://cdn-icons-png.flaticon.com/512/201/201623.png',
                'https://cdn-icons-png.flaticon.com/512/826/826070.png',
                'https://cdn-icons-png.flaticon.com/512/984/984233.png'
            ],
            tech: [
                'https://cdn-icons-png.flaticon.com/512/606/606203.png',
                'https://cdn-icons-png.flaticon.com/512/1055/1055687.png',
                'https://cdn-icons-png.flaticon.com/512/2010/2010990.png'
            ],
            nature: [
                'https://cdn-icons-png.flaticon.com/512/628/628830.png',
                'https://cdn-icons-png.flaticon.com/512/1043/1043437.png',
                'https://cdn-icons-png.flaticon.com/512/892/892926.png'
            ]
        };

        // Find the best match or default to general stickers
        const key = Object.keys(categoryMap).find(k => q.includes(k)) || 'nature';
        const urls = categoryMap[key];

        return urls.map((url, i) => ({
            id: `fallback-sticker-${i}`,
            url: url,
            thumbnail: url,
            type: 'sticker',
            alt: `${key} sticker`,
        }));
    }
}
