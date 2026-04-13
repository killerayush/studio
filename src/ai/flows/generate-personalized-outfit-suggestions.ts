'use server';
/**
 * @fileOverview VYXEN AI - Personalized outfit and visual generation engine.
 *
 * - generatePersonalizedOutfitSuggestions - Generates 3 distinct fit options with fallback logic for quota limits.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateOutfitInputSchema = z.object({
  name: z.string().nullable().optional().describe('User display name.'),
  gender: z.enum(['Male', 'Female', 'Non-binary']).default('Male').describe('User gender preference.'),
  height: z.number().describe('User height in centimeters.'),
  weight: z.number().describe('User weight in kilograms.'),
  style: z.enum(['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym']).describe('User primary style preference.'),
  occasion: z.string().describe('The occasion for which the outfit is needed.'),
  budgetRange: z.string().describe('The budget range for the entire outfit.'),
  location: z.string().default('India').describe('The user\'s location for brand context.'),
  userId: z.string().nullable().optional().describe('Authenticated user ID.'),
});
export type GenerateOutfitInput = z.infer<typeof GenerateOutfitInputSchema>;

const AffiliateLinksSchema = z.object({
  amazon: z.string().url().optional().nullable(),
  myntra: z.string().url().optional().nullable(),
  ajio: z.string().url().optional().nullable(),
  flipkart: z.string().url().optional().nullable(),
  meesho: z.string().url().optional().nullable(),
  nykaa: z.string().url().optional().nullable(),
  tataCliq: z.string().url().optional().nullable(),
  hm: z.string().url().optional().nullable(),
  zara: z.string().url().optional().nullable(),
  snapdeal: z.string().url().optional().nullable(),
  vMart: z.string().url().optional().nullable(),
  bata: z.string().url().optional().nullable(),
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
    imageUrl: z.string().optional().describe('Data URI or URL of the generated image.'),
  })),
  isFallback: z.boolean().default(false).describe('Indicates if results are pre-curated fallbacks.'),
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
- Occasion: {{{occasion}}}
- Budget: {{{budgetRange}}}
- Location: {{{location}}}

Seed: ${Date.now()}

Rules:
- Generate 3 UNIQUE options: "Budget fit", "Trendy fit", and "Premium fit".
- Do NOT repeat common outfits (avoid basic black tee + jeans). Be creative.
- Provide realistic INR prices for the India market.
- Ensure the outfits are tailored to the user's specific measurements and style vibe.
- Include creative imagePrompts for each look.`
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
    try {
      const { output: textOutput } = await outfitTextPrompt(input);
      if (!textOutput) throw new Error('Failed to generate outfit suggestions.');

      const outfitsWithImages = await Promise.all(textOutput.outfits.map(async (outfit) => {
        try {
          const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: `A high-end, cinematic studio fashion shot of a ${input.gender} wearing: ${outfit.imagePrompt}. Professional lighting, sharp detail.`,
          });

          return {
            ...outfit,
            imageUrl: media?.url || `https://picsum.photos/seed/${outfit.name}-${Date.now()}/800/1000`,
          };
        } catch (e) {
          return { ...outfit, imageUrl: `https://picsum.photos/seed/${outfit.name}-${Date.now()}/800/1000` };
        }
      }));

      return { outfits: outfitsWithImages, isFallback: false };
    } catch (error: any) {
      console.warn('AI Generation failed (Quota/Limit), serving fallback:', error.message);
      
      // Serve high-quality fallback based on style
      const fallbackOutfits = getFallbackOutfits(input.style, input.gender);
      return { outfits: fallbackOutfits, isFallback: true };
    }
  }
);

function getFallbackOutfits(style: string, gender: string): any[] {
  // Simple style-based fallback generator
  const isMale = gender === 'Male';
  
  const commonOutfits = [
    {
      name: style === 'Streetwear' ? "Urban Utility Drop" : "Classic Minimalist",
      type: "Budget fit",
      description: "A solid essential look that never misses.",
      styleTip: "Focus on the fit and clean sneakers.",
      totalPrice: "₹1,899",
      imageUrl: "https://picsum.photos/seed/fallback-budget/800/1000",
      imagePrompt: "A minimalist urban outfit featuring an oversized sand t-shirt and dark relaxed fit cargoes with high-top sneakers.",
      items: [
        {
          type: "Top",
          name: isMale ? "Oversized Sand T-shirt" : "Cropped Ribbed Top",
          price: "₹499",
          itemTip: "Tuck it slightly for a better silhouette.",
          links: { amazon: "https://amazon.in", myntra: "https://myntra.com" }
        },
        {
          type: "Bottom",
          name: "Relaxed Fit Cargoes",
          price: "₹999",
          itemTip: "Go for a darker shade to keep it versatile.",
          links: { ajio: "https://ajio.com", flipkart: "https://flipkart.com" }
        },
        {
          type: "Shoes",
          name: "Canvas High-Tops",
          price: "₹401",
          itemTip: "Clean them weekly to keep the drip fresh.",
          links: { meesho: "https://meesho.com" }
        }
      ]
    },
    {
      name: "The Trendsetter HUD",
      type: "Trendy fit",
      description: "Highest rated look this week.",
      styleTip: "Layer with a light flannel or denim jacket.",
      totalPrice: "₹3,499",
      imageUrl: "https://picsum.photos/seed/fallback-trendy/800/1000",
      imagePrompt: "A trendy layered look with a heavyweight boxy tee, straight leg distressed denim, and a silver chain accessory.",
      items: [
        {
          type: "Top",
          name: "Heavyweight Boxy Tee",
          price: "₹899",
          itemTip: "Premium cotton makes the drape look expensive.",
          links: { hm: "https://hm.com", myntra: "https://myntra.com" }
        },
        {
          type: "Bottom",
          name: "Straight Leg Distressed Denim",
          price: "₹1,800",
          itemTip: "Ensure the length hits right at the ankle.",
          links: { zara: "https://zara.com", ajio: "https://ajio.com" }
        },
        {
          type: "Accessories",
          name: "Silver Chain Set",
          price: "₹800",
          itemTip: "Simple accessories elevate a basic fit instantly.",
          links: { amazon: "https://amazon.in" }
        }
      ]
    },
    {
      name: "Vyxen Studio Select",
      type: "Premium fit",
      description: "Luxury quality meets urban aesthetic.",
      styleTip: "The ultimate power move for any occasion.",
      totalPrice: "₹7,800",
      imageUrl: "https://picsum.photos/seed/fallback-premium/800/1000",
      imagePrompt: "A premium studio select fit with a knit polo, pleated trousers, and clean leather court sneakers.",
      items: [
        {
          type: "Top",
          name: "Premium Knit Polo",
          price: "₹2,500",
          itemTip: "Texture adds depth to your overall look.",
          links: { tataCliq: "https://tatacliq.com", zara: "https://zara.com" }
        },
        {
          type: "Bottom",
          name: "Pleated Trousers",
          price: "₹3,000",
          itemTip: "Tapered legs provide a modern, sharp aesthetic.",
          links: { hm: "https://hm.com", nykaa: "https://nykaafashion.com" }
        },
        {
          type: "Shoes",
          name: "Leather Court Sneakers",
          price: "₹2,300",
          itemTip: "A timeless investment for any wardrobe.",
          links: { bata: "https://bata.in", amazon: "https://amazon.in" }
        }
      ]
    }
  ];

  return commonOutfits;
}
