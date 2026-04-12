'use server';
/**
 * @fileOverview VYXEN AI - Personalized outfit and visual generation engine.
 *
 * - generatePersonalizedOutfitSuggestions - Generates 3 fit options (Budget, Trendy, Premium) with full visual images.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateOutfitInputSchema = z.object({
  height: z.number().describe('User height in centimeters.'),
  weight: z.number().describe('User weight in kilograms.'),
  style: z.enum(['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym']).describe('User primary style preference.'),
  occasion: z.string().describe('The occasion for which the outfit is needed.'),
  budgetRange: z.enum(['Under ₹1000', '₹1000–₹3000', 'Premium']).describe('The budget range for the entire outfit.'),
  location: z.string().default('India').describe('The user\'s location for brand context.'),
});
export type GenerateOutfitInput = z.infer<typeof GenerateOutfitInputSchema>;

const AffiliateLinksSchema = z.object({
  amazon: z.string().url().optional(),
  myntra: z.string().url().optional(),
  ajio: z.string().url().optional(),
  flipkart: z.string().url().optional(),
  meesho: z.string().url().optional(),
  nykaa: z.string().url().optional(),
  tataCliq: z.string().url().optional(),
  hm: z.string().url().optional(),
  zara: z.string().url().optional(),
  snapdeal: z.string().url().optional(),
  vMart: z.string().url().optional(),
  bata: z.string().url().optional(),
});

const OutfitItemSchema = z.object({
  type: z.string().describe('Item type (e.g., T-shirt, Jeans).'),
  name: z.string().describe('Descriptive name.'),
  price: z.string().describe('Estimated price or range (e.g., ₹199–₹399).'),
  itemTip: z.string().describe('A specific styling or buying tip for this item (e.g., "Go a size up for comfort").'),
  links: AffiliateLinksSchema,
});

const OutfitSchema = z.object({
  name: z.string().describe('Descriptive name (e.g., "Street Casual Fit").'),
  type: z.enum(['Budget fit', 'Trendy fit', 'Premium fit']),
  description: z.string().describe('Brief description.'),
  styleTip: z.string().describe('Overall styling recommendation for the full outfit.'),
  totalPrice: z.string().describe('Total estimated cost (e.g., ₹2797).'),
  items: z.array(OutfitItemSchema),
  imagePrompt: z.string().describe('Detailed prompt for generating a visual of this specific outfit.'),
});

const GenerateOutfitOutputSchema = z.object({
  outfits: z.array(OutfitSchema.extend({
    imageUrl: z.string().optional().describe('Data URI of the generated image.'),
  })),
});
export type GenerateOutfitOutput = z.infer<typeof GenerateOutfitOutputSchema>;

const outfitTextPrompt = ai.definePrompt({
  name: 'outfitTextPrompt',
  input: { schema: GenerateOutfitInputSchema },
  output: { schema: z.object({ outfits: z.array(OutfitSchema) }) },
  prompt: `You are VYXEN AI, a top-tier fashion consultant. Generate 3 distinct outfit combinations based on the user's profile.
  
User Profile:
- Style: {{{style}}}
- Occasion: {{{occasion}}}
- Budget Preference: {{{budgetRange}}}
- Dimensions: {{{height}}}cm, {{{weight}}}kg
- Location: {{{location}}}

Create 3 options:
1. "Budget fit" - Prioritizing value (Meesho, Flipkart, Amazon, Snapdeal, V-Mart).
2. "Trendy fit" - Prioritizing current fashion trends (Myntra, Ajio, H&M).
3. "Premium fit" - Prioritizing quality and brands (Tata Cliq, Zara, Nykaa Fashion).

For each item, provide realistic names, prices/ranges in INR, a helpful 'itemTip', and valid search placeholder URLs for relevant platforms. 

Example placeholder link: https://www.amazon.in/s?k=black+oversized+tshirt`
});

export async function generatePersonalizedOutfitSuggestions(input: GenerateOutfitInput): Promise<GenerateOutfitOutput> {
  return generatePersonalizedOutfitSuggestionsFlow(input);
}

const generatePersonalizedOutfitSuggestionsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOutfitSuggestionsFlow',
    inputSchema: GenerateOutfitInputSchema,
    outputSchema: GenerateOutfitOutputSchema
  },
  async (input) => {
    const { output: textOutput } = await outfitTextPrompt(input);
    if (!textOutput) throw new Error('Failed to generate outfit suggestions.');

    const outfitsWithImages = await Promise.all(textOutput.outfits.map(async (outfit) => {
      try {
        const { media } = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt: `A high-quality, professional fashion catalog photo of a person wearing the following outfit: ${outfit.imagePrompt}. High detail, cinematic lighting, modern background.`,
        });

        return {
          ...outfit,
          imageUrl: media?.url,
        };
      } catch (e) {
        console.error('Image generation failed for outfit:', outfit.name, e);
        return { ...outfit, imageUrl: `https://picsum.photos/seed/${outfit.name}/800/1000` };
      }
    }));

    return { outfits: outfitsWithImages };
  }
);