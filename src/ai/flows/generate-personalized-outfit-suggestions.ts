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
  gender: z.enum(['Male', 'Female', 'Non-binary']).describe('User gender preference.'),
  height: z.coerce.number().min(50).max(250).describe('User height in centimeters.'),
  weight: z.coerce.number().min(20).max(300).describe('User weight in kilograms.'),
  
  // Measurements
  shoeSize: z.coerce.number().optional().describe('User shoe size in EU/IN.'),
  chest: z.coerce.number().optional().describe('Chest measurement in inches.'),
  waist: z.coerce.number().optional().describe('Waist measurement in inches.'),
  hips: z.coerce.number().optional().describe('Hips measurement in inches.'),
  inseam: z.coerce.number().optional().describe('Inseam measurement in inches.'),
  
  // Style Preferences
  style: z.enum(['Streetwear', 'Classic / Preppy', 'Minimal', 'Desi / Ethnic', 'Bold Prints', 'Techwear', 'Formal']).describe('User primary style preference.'),
  preferredTopStyles: z.array(z.string()).optional().describe('Specific types of tops preferred by user (e.g., T-Shirts, Shirts, Hoodies).'),
  preferredFootwear: z.array(z.string()).optional().describe('Specific types of footwear preferred by user (e.g., Sneakers, Loafers).'),

  // Location & Lifestyle
  city: z.string().nullable().optional().describe('User city for weather and local trends.'),
  climate: z.enum(['Hot', 'Moderate', 'Cold']).optional().describe('Local climate conditions.'),
  lifestyle: z.string().optional().describe('User lifestyle.'),

  // Core request
  occasion: z.string().min(1).describe('The occasion for which the outfit is needed.'),
  budgetRange: z.enum(['Under ₹1,500', 'Under ₹3,000', 'Under ₹5,000']).describe('The budget range for the entire outfit.'),
  location: z.string().default('India').describe('The user\'s location for brand context.'),
  userId: z.string().nullable().optional().describe('Authenticated user ID.'),

  // Optional analysis input
  styleAnalysis: z.string().optional().describe('A JSON string of a detailed style analysis performed on the user. This should heavily influence the outfit generation, taking precedence over other preferences if there is a conflict.'),
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
  prompt: `You are VYXEN AI, a world-class fashion engine. Your core function is to deliver exceptional, personalized outfit suggestions. You are not just a consultant; you are a taste-maker.

The user's profile is your primary source of truth. Adhere to it meticulously.

{{#if styleAnalysis}}
CRITICAL DIRECTIVE: A professional style analysis has been performed. This data is paramount. Your suggestions MUST be heavily influenced by this analysis, taking precedence over other preferences if there are any conflicts.
ANALYSIS:
{{{styleAnalysis}}}
{{/if}}

USER PROFILE:
- Name: {{{name}}}
- Gender/Style: {{{gender}}}
- Physique:
  - Height: {{{height}}}cm
  - Weight: {{{weight}}}kg
  - Measurements (in): Chest {{{chest}}}, Waist {{{waist}}}, Hips {{{hips}}}, Inseam {{{inseam}}}
  - Shoe Size: EU {{{shoeSize}}}

- Style DNA:
  - Primary Vibe: {{{style}}}
  - Top Styles: {{{preferredTopStyles}}}
  - Footwear: {{{preferredFootwear}}}

- Context:
  - Occasion: {{{occasion}}}
  - Budget Tier: {{{budgetRange}}}
  - Location: {{{city}}}, {{{location}}}
  - Climate: {{{climate}}}
  - Lifestyle: {{{lifestyle}}}

MISSION: Generate 3 outstanding, distinct outfits. Each must be a complete look.

OUTFIT TIERS (Generate one for each):
1.  **Budget Fit**: Max style, minimal cost. Prove that a limited budget doesn't limit style.
2.  **Trendy Fit**: Current, fashionable, and on the pulse of what's happening in style right now.
3.  **Premium Fit**: Elevated, high-quality, and sophisticated. A true investment look.

RULES OF ENGAGEMENT:
-   **No Basic Suggestions**: Avoid generic combinations like "blue jeans and a white t-shirt." Be bold, creative, and specific. Think textures, layers, and unique silhouettes.
-   **Precision Pricing**: Provide realistic Indian Rupee (₹) prices for the Indian market.
-   **Actionable Links**: For each item, generate direct shopping links for a wide variety of platforms: amazon, myntra, ajio, flipkart, meesho, nykaa, tataCliq, hm, zara, snapdeal, vMart, bata.
-   **Personalization is Key**: Every suggestion must be tailored to the user's specific body measurements, style, and context. Explain *why* it works for them in the 'itemTip' or 'styleTip'.
-   **Masterful Image Prompts**: The 'imagePrompt' is critical. It must be a rich, detailed description for the visual generation model. Paint a picture with words. Include clothing details, fit, color, and overall mood.

Execute with style. Seed: ${Date.now()}
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
            prompt: `A high-quality, full-body fashion photograph of a ${input.gender} model showcasing a complete outfit. The model is wearing: ${outfit.imagePrompt}. The background is a neutral, minimalist studio setting. The lighting is bright and highlights the clothing's details and textures. Cinematic and stylish.`,
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
