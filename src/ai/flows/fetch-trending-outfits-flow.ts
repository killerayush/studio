'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendingItemSchema = z.object({
  id: z.string(),
  name: z.string().describe('The name of the trending clothing item.'),
  category: z.string().describe('The category of the item (e.g., "Tops", "Bottoms", "Footwear").'),
  description: z.string().describe('A short, catchy description of why this item is trending.'),
  imageUrl: z.string().url().describe('A URL for the item\'s image.'),
  gender: z.enum(['Unisex', 'Male', 'Female']).describe('The target gender for the trend.'),
});

const FetchTrendingOutfitsOutputSchema = z.object({
  trends: z.array(TrendingItemSchema),
});

export type FetchTrendingOutfitsOutput = z.infer<typeof FetchTrendingOutfitsOutputSchema>;

// This function will be called from the frontend.
export async function fetchTrendingOutfits(): Promise<FetchTrendingOutfitsOutput> {
  return fetchTrendingOutfitsFlow();
}

const fetchTrendingOutfitsFlow = ai.defineFlow(
  {
    name: 'fetchTrendingOutfitsFlow',
    outputSchema: FetchTrendingOutfitsOutputSchema,
  },
  async () => {
    // In a real app, this would fetch from a database or a live trends API.
    // For now, we'll return a hardcoded, curated list.
    return {
      trends: [
        {
          id: 'trend-1',
          name: 'Boxy Fit Graphic Tees',
          category: 'Tops',
          description: 'Oversized and bold, the boxy tee is the canvas for this season\'s graphic statements.',
          imageUrl: 'https://picsum.photos/seed/trend1/800/1000',
          gender: 'Unisex',
        },
        {
          id: 'trend-2',
          name: 'Relaxed Fit Cargo Pants',
          category: 'Bottoms',
          description: 'Utility meets comfort. The cargo pant is back with a looser, more relaxed silhouette.',
          imageUrl: 'https://picsum.photos/seed/trend2/800/1000',
          gender: 'Unisex',
        },
        {
          id: 'trend-3',
          name: 'Chunky Sole Sneakers',
          category: 'Footwear',
          description: 'The "dad shoe" aesthetic continues to dominate with exaggerated soles and retro designs.',
          imageUrl: 'https://picsum.photos/seed/trend3/800/1000',
          gender: 'Unisex',
        },
        {
            id: 'trend-4',
            name: 'Knit Polo Shirts',
            category: 'Tops',
            description: 'A touch of vintage class, the knit polo brings texture and sophistication to casual looks.',
            imageUrl: 'https://picsum.photos/seed/trend4/800/1000',
            gender: 'Male',
        },
        {
            id: 'trend-5',
            name: 'Wide-Leg Tailored Trousers',
            category: 'Bottoms',
            description: 'Flowy and elegant, wide-leg trousers are replacing skinny fits for a more powerful stance.',
            imageUrl: 'https://picsum.photos/seed/trend5/800/1000',
            gender: 'Female',
        },
        {
            id: 'trend-6',
            name: 'Utility Vests',
            category: 'Outerwear',
            description: 'Layering gets functional. The utility vest adds pockets and an edgy vibe to any outfit.',
            imageUrl: 'https://picsum.photos/seed/trend6/800/1000',
            gender: 'Unisex',
        }
      ],
    };
  }
);
