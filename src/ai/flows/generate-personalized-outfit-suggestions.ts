'use server';
/**
 * @fileOverview VYXEN AI - Personalized outfit and visual generation engine.
 *
 * - generatePersonalizedOutfitSuggestions - Generates 3 distinct fit options (Budget, Trendy, Premium) with full visual images.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateOutfitInputSchema = z.object({
  name: z.string().nullable().optional().describe('User display name.'),
  gender: z.enum(['Male', 'Female', 'Non-binary']).default('Male').describe('User gender preference.'),
  height: z.number().describe('User height in centimeters.'),
  weight: z.number().describe('User weight in kilograms.'),
  shoeSize: z.number().optional().describe('Shoe size in EU/IN.'),
  chest: z.number().optional().describe('Chest measurement in inches.'),
  waist: z.number().optional().describe('Waist measurement in inches.'),
  hips: z.number().optional().describe('Hips measurement in inches.'),
  inseam: z.number().optional().describe('Inseam measurement in inches.'),
  city: z.string().nullable().optional().describe('User city.'),
  climate: z.string().optional().describe('Local climate conditions.'),
  lifestyle: z.string().optional().describe('User lifestyle (e.g., Student, Working Professional).'),
  style: z.enum(['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym']).describe('User primary style preference.'),
  preferredTopStyles: z.array(z.string()).optional().describe('Specific types of tops preferred by user.'),
  preferredFootwear: z.array(z.string()).optional().describe('Specific types of footwear preferred by user.'),
  occasion: z.string().describe('The occasion for which the outfit is needed.'),
  budgetRange: z.string().describe('The budget range for the entire outfit.'),
  location: z.string().default('India').describe('The user\'s location for brand context.'),
  userId: z.string().nullable().optional().describe('Authenticated user ID.'),
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
  itemTip: z.string().describe('A specific styling or buying tip for this item.'),
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
  config: {
    temperature: 0.9,
  },
  prompt: `You are VYXEN AI, a top-tier fashion consultant. Generate 3 distinct and UNIQUE outfit combinations.
  
User Profile:
- Name: {{{name}}}
- Gender: {{{gender}}}
- Dimensions: {{{height}}}cm, {{{weight}}}kg
- Style Preference: {{{style}}}
- Lifestyle: {{{lifestyle}}}
- Occasion: {{{occasion}}}
- Budget: {{{budgetRange}}}
- Location: {{{location}}}

Seed: ${Date.now()}

Create 3 UNIQUE options:
1. "Budget fit" - Maximum value, using platforms like Meesho, Flipkart, Amazon.
2. "Trendy fit" - Latest trends, using Myntra, Ajio, H&M.
3. "Premium fit" - High-end quality, using Tata Cliq, Zara, Nykaa Fashion.

Rules:
- Do NOT repeat common outfits. Be creative.
- Provide realistic INR prices.
- Include deep-link placeholders for all relevant platforms.
- Ensure the outfits are tailored to the user's specific measurements and climate.`
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
          prompt: `A professional, cinematic fashion photography shot of a ${input.gender} wearing the following outfit: ${outfit.imagePrompt}. High detail, studio lighting, modern urban background.`,
        });

        return {
          ...outfit,
          imageUrl: media?.url,
        };
      } catch (e) {
        console.error('Image generation failed:', e);
        return { ...outfit, imageUrl: `https://picsum.photos/seed/${outfit.name}-${Date.now()}/800/1000` };
      }
    }));

    return { outfits: outfitsWithImages };
  }
);