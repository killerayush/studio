'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for an item within a combination
const OutfitItemSchema = z.object({
    type: z.string().describe('The category of the item (e.g., "Tops", "Bottoms", "Footwear").'),
    name: z.string().describe('The name of the trending clothing item.'),
});

// Schema for the AI's text output (doesn't include the final image URL)
const AiOutputCombinationSchema = z.object({
  id: z.string().describe('A unique identifier for this outfit combination.'),
  name: z.string().describe('A catchy name for the outfit combination (e.g., "Monochrome City Vibe").'),
  description: z.string().describe('A short, appealing description of the outfit set and its style.'),
  colorPalette: z.array(z.string()).describe('An array of 3-4 hex color codes representing the main color palette (e.g., ["#000000", "#FFFFFF", "#808080"]).'),
  items: z.array(OutfitItemSchema).describe('A list of the individual clothing items that make up this combination.'),
  imageHint: z.string().optional().describe("Keywords for searching a real image of the full outfit."),
});

// Schema for the final output of the flow, which includes the generated imageUrl
const FinalOutfitCombinationSchema = AiOutputCombinationSchema.extend({
    imageUrl: z.string().url().describe("A URL for the outfit's image."),
});

const FetchTrendingOutfitsOutputSchema = z.object({
  combinations: z.array(FinalOutfitCombinationSchema),
});

export type FetchTrendingOutfitsOutput = z.infer<typeof FetchTrendingOutfitsOutputSchema>;

// This is the function called by the frontend
export async function fetchTrendingOutfits(): Promise<FetchTrendingOutfitsOutput> {
  return fetchTrendingOutfitsFlow();
}

// This prompt only defines the text-based output we want from the LLM
const fetchTrendingOutfitsPrompt = ai.definePrompt({
  name: 'trendingOutfitsPrompt',
  output: { schema: z.object({ combinations: z.array(AiOutputCombinationSchema) }) },
  prompt: `
    You are VYXEN AI, a world-class fashion trend forecaster and stylist.
    Your task is to generate 6 distinct, ready-to-wear outfit combinations that are currently trending for young adults in India.
    
    For each combination, you must provide:
    1.  A unique 'id' (e.g., 'trend-combo-1').
    2.  A creative and catchy 'name' for the look.
    3.  A short, exciting 'description' of the style.
    4.  A 'colorPalette' of 3-4 hex codes that define the look.
    5.  A list of 'items', each with a 'type' and a specific 'name'.
    6.  An 'imageHint' with 1-2 keywords for finding a real photo of the outfit.

    Ensure the combinations are diverse, covering styles like Streetwear, Minimalist, Ethnic-Fusion, etc.
    Do not repeat combinations. Be creative and on-trend.
  `,
});

// Function to provide fallback data when AI fails
function getFallbackTrends(): FetchTrendingOutfitsOutput {
  return {
    combinations: [
      {
        id: 'fallback-trend-1',
        name: 'Monochrome City Vibe',
        description: 'A classic black and white streetwear look that is timeless and always in style. Perfect for urban exploration.',
        colorPalette: ['#000000', '#FFFFFF', '#808080'],
        items: [
          { type: 'Tops', name: 'Oversized Black Graphic Tee' },
          { type: 'Bottoms', name: 'White Cargo Pants' },
          { type: 'Footwear', name: 'Black & White High-Top Sneakers' },
        ],
        imageHint: 'monochrome streetwear',
        imageUrl: 'https://picsum.photos/seed/fallback-trend-1/800/1000',
      },
      {
        id: 'fallback-trend-2',
        name: 'Earth-Tone Minimalist',
        description: 'A clean and sophisticated look using earthy tones. Great for a smart-casual setting.',
        colorPalette: ['#A0522D', '#F5DEB3', '#D2B48C'],
        items: [
          { type: 'Tops', name: 'Beige Knit Polo Shirt' },
          { type: 'Bottoms', name: 'Brown Pleated Trousers' },
          { type: 'Footwear', name: 'White Leather Sneakers' },
        ],
        imageHint: 'earth tone minimalist',
        imageUrl: 'https://picsum.photos/seed/fallback-trend-2/800/1000',
      },
      {
        id: 'fallback-trend-3',
        name: 'Classic Denim Duo',
        description: 'A rugged and reliable all-denim look that never goes out of fashion.',
        colorPalette: ['#4682B4', '#1E90FF', '#F5F5F5'],
        items: [
          { type: 'Tops', name: 'Blue Denim Jacket' },
          { type: 'Bottoms', name: 'Dark Wash Straight-Fit Jeans' },
          { type: 'Footwear', name: 'Brown Leather Boots' },
        ],
        imageHint: 'denim on denim',
        imageUrl: 'https://picsum.photos/seed/fallback-trend-3/800/1000',
      },
    ],
  };
}


// This flow calls the LLM and then augments the result with image URLs
const fetchTrendingOutfitsFlow = ai.defineFlow(
  {
    name: 'fetchTrendingOutfitsFlow',
    outputSchema: FetchTrendingOutfitsOutputSchema,
  },
  async () => {
    try {
      const { output } = await fetchTrendingOutfitsPrompt();
      if (!output) {
        throw new Error("Failed to generate trending outfits.");
      }
      
      // Add placeholder image URLs to the output
      const combinationsWithImages = output.combinations.map(combo => ({
        ...combo,
        imageUrl: `https://picsum.photos/seed/${combo.id}/800/1000`,
      }));

      return { combinations: combinationsWithImages };
    } catch (error: any) {
      console.warn('Trending outfits AI failed (Quota/Limit), serving fallback:', error.message);
      return getFallbackTrends();
    }
  }
);
