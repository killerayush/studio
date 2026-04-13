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
  height: z.coerce.number().min(50).max(250).describe('User height in centimeters.'),
  weight: z.coerce.number().min(20).max(300).describe('User weight in kilograms.'),
  shoeSize: z.coerce.number().optional().describe('User shoe size in EU/IN.'),
  style: z.enum(['Streetwear', 'Minimal', 'Desi', 'Formal', 'Gym', 'Classic / Preppy', 'Bold Prints', 'Techwear']).describe('User primary style preference.'),
  occasion: z.string().min(1).describe('The occasion for which the outfit is needed.'),
  budgetRange: z.enum(['Under ₹1,500', 'Under ₹3,000', 'Under ₹5,000']).describe('The budget range for the entire outfit.'),
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
  prompt: `You are VYXEN AI, a top-tier fashion consultant. Generate 3 COMPLETELY DIFFERENT outfits based on the user's profile.

User Profile:
- Name: {{{name}}}
- Gender: {{{gender}}}
- Dimensions: {{{height}}}cm, {{{weight}}}kg, Shoe Size: EU {{{shoeSize}}}
- Style Preference: {{{style}}}
- Occasion: {{{occasion}}}
- Budget: {{{budgetRange}}}
- Location: {{{location}}}

Rules:
- Generate 3 UNIQUE options with distinct vibes:
  - Outfit 1: A "Budget fit" - stylish but affordable.
  - Outfit 2: A "Trendy fit" - something fashionable and current.
  - Outfit 3: A "Premium fit" - a more elevated, high-quality look.
- Do NOT repeat common, boring combinations like a plain black t-shirt and blue jeans. Be highly creative and specific.
- Provide realistic Indian Rupee (₹) prices for the India market.
- For each item, provide direct shopping links for as many of these platforms as possible: amazon, myntra, ajio, flipkart, meesho, nykaa, tataCliq, hm, zara.
- Ensure the outfits are tailored to the user's specific measurements and style preference.
- Include a creative, detailed 'imagePrompt' for each outfit, which will be used to generate a visual representation.

Seed: ${Date.now()}
`
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
      
      const fallbackOutfits = getFallbackOutfits(input);
      return { outfits: fallbackOutfits, isFallback: true };
    }
  }
);

function getFallbackOutfits(input: GenerateOutfitInput): any[] {
  const { style, occasion, gender } = input;
  const isMale = gender === 'Male';
  
  if (style === 'Gym' || occasion === 'Gym') {
    return [
      {
        name: "Performance Gym Drop",
        type: "Budget fit",
        description: "Engineered for performance, styled for the street.",
        styleTip: "Pair with performance sneakers and a minimalist watch.",
        totalPrice: "₹2,199",
        imageUrl: "https://picsum.photos/seed/fallback-gym/800/1000",
        imagePrompt: "A male model in a performance gym outfit, with a breathable t-shirt and flexible shorts.",
        items: [
          { type: "Top", name: "Dry-Fit Performance Tee", price: "₹599", itemTip: "Look for moisture-wicking technology.", links: { myntra: "https://myntra.com", amazon: "https://amazon.in" } },
          { type: "Bottom", name: "Stretchable Gym Shorts", price: "₹899", itemTip: "Pockets with zippers are a plus.", links: { ajio: "https://ajio.com", flipkart: "https://flipkart.com" } },
          { type: "Shoes", name: "Training Sneakers", price: "₹701", itemTip: "Good grip is essential for workouts.", links: { meesho: "https://meesho.com" } }
        ]
      }
    ];
  }

  if (style === 'Formal' || occasion === 'Work' || occasion === 'Wedding') {
    return [
       {
        name: "Modern Formal Select",
        type: "Premium fit",
        description: "A sharp, modern take on formal wear.",
        styleTip: "A tailored fit is key. Get it altered if needed.",
        totalPrice: "₹8,500",
        imageUrl: "https://picsum.photos/seed/fallback-formal/800/1000",
        imagePrompt: "A person in a sharp, modern tailored formal suit, looking confident.",
        items: [
          { type: "Top", name: "Crisp White Shirt", price: "₹1,500", itemTip: "100% cotton for best comfort.", links: { zara: "https://zara.com", hm: "https://hm.com" } },
          { type: "Bottom", name: "Tailored Trousers", price: "₹3,000", itemTip: "Choose a slim-fit cut for a modern look.", links: { tataCliq: "https://tatacliq.com", myntra: "https://myntra.com" } },
          { type: "Shoes", name: "Leather Oxford Shoes", price: "₹4,000", itemTip: "Invest in a quality pair that will last.", links: { bata: "https://bata.in", amazon: "https://amazon.in" } }
        ]
      }
    ]
  }

  const commonOutfits = [
    {
      name: "Urban Utility Drop",
      type: "Budget fit",
      description: "A solid essential look that never misses.",
      styleTip: "Focus on the fit and clean sneakers.",
      totalPrice: "₹1,899",
      imageUrl: "https://picsum.photos/seed/fallback-budget/800/1000",
      imagePrompt: "A minimalist urban outfit featuring an oversized sand t-shirt and dark relaxed fit cargoes with high-top sneakers.",
      items: [
        { type: "Top", name: isMale ? "Oversized Sand T-shirt" : "Cropped Ribbed Top", price: "₹499", itemTip: "Tuck it slightly for a better silhouette.", links: { amazon: "https://amazon.in", myntra: "https://myntra.com" } },
        { type: "Bottom", name: "Relaxed Fit Cargoes", price: "₹999", itemTip: "Go for a darker shade to keep it versatile.", links: { ajio: "https://ajio.com", flipkart: "https://flipkart.com" } },
        { type: "Shoes", name: "Canvas High-Tops", price: "₹401", itemTip: "Clean them weekly to keep the drip fresh.", links: { meesho: "https://meesho.com" } }
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
        { type: "Top", name: "Heavyweight Boxy Tee", price: "₹899", itemTip: "Premium cotton makes the drape look expensive.", links: { hm: "https://hm.com", myntra: "https://myntra.com" } },
        { type: "Bottom", name: "Straight Leg Distressed Denim", price: "₹1,800", itemTip: "Ensure the length hits right at the ankle.", links: { zara: "https://zara.com", ajio: "https://ajio.com" } },
        { type: "Accessories", name: "Silver Chain Set", price: "₹800", itemTip: "Simple accessories elevate a basic fit instantly.", links: { amazon: "https://amazon.in" } }
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
        { type: "Top", name: "Premium Knit Polo", price: "₹2,500", itemTip: "Texture adds depth to your overall look.", links: { tataCliq: "https://tatacliq.com", zara: "https://zara.com" } },
        { type: "Bottom", name: "Pleated Trousers", price: "₹3,000", itemTip: "Tapered legs provide a modern, sharp aesthetic.", links: { hm: "https://hm.com", nykaa: "https://nykaafashion.com" } },
        { type: "Shoes", name: "Leather Court Sneakers", price: "₹2,300", itemTip: "A timeless investment for any wardrobe.", links: { bata: "https://bata.in", amazon: "https://amazon.in" } }
      ]
    }
  ];

  return commonOutfits;
}
