'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized outfit suggestions.
 *
 * - generatePersonalizedOutfitSuggestions - A function that generates tailored outfit suggestions based on user preferences.
 * - GenerateOutfitInput - The input type for the generatePersonalizedOutfitSuggestions function.
 * - GenerateOutfitOutput - The return type for the generatePersonalizedOutfitSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateOutfitInputSchema = z.object({
  height: z.number().describe('User height in centimeters.'),
  weight: z.number().describe('User weight in kilograms.'),
  genderStyle: z.string().describe('User gender and preferred style (e.g., "Male, streetwear", "Female, casual", "Non-binary, formal").'),
  occasion: z.string().describe('The occasion for which the outfit is needed (e.g., "college", "party", "work", "wedding").'),
  budget: z.number().describe('The maximum budget for the entire outfit in Indian Rupees (INR).'),
  location: z.string().describe('The user\'s location, primarily for context on brands/affiliate links (e.g., "India").'),
  bodyType: z.string().optional().describe('Optional: User body type (e.g., "athletic", "slim", "curvy").'),
  preferredColors: z.array(z.string()).optional().describe('Optional: Array of preferred colors (e.g., ["black", "gold", "blue"]).'),
  fitType: z.string().optional().describe('Optional: Preferred fit type (e.g., "slim", "oversized", "regular").')
});
export type GenerateOutfitInput = z.infer<typeof GenerateOutfitInputSchema>;

const OutfitItemSchema = z.object({
  type: z.string().describe('The type of clothing item (e.g., "t-shirt", "jeans", "shoes", "accessories").'),
  name: z.string().describe('A descriptive name for the item (e.g., "Graphic Oversized Tee", "Slim Fit Dark Wash Jeans").'),
  priceRange: z.string().describe('The estimated price range for the item in INR (e.g., "₹500 - ₹800").'),
  amazonLink: z.string().url().describe('Placeholder affiliate link to Amazon India for the item. Example: https://www.amazon.in/s?k=mens+graphic+tshirt'),
  myntraLink: z.string().url().describe('Placeholder affiliate link to Myntra for the item. Example: https://www.myntra.com/search?q=men%20tshirts'),
  ajioLink: z.string().url().describe('Placeholder affiliate link to Ajio for the item. Example: https://www.ajio.com/s/men%20tshirts')
});

const OutfitSchema = z.object({
  description: z.string().describe('A brief description of the outfit combination.'),
  styleTips: z.string().describe('Style tips for wearing this outfit.'),
  items: z.array(OutfitItemSchema).describe('An array of clothing items that make up the outfit.')
});

const GenerateOutfitOutputSchema = z.object({
  outfits: z.array(OutfitSchema).min(2).max(3).describe('An array of 2 to 3 tailored outfit suggestions.')
});
export type GenerateOutfitOutput = z.infer<typeof GenerateOutfitOutputSchema>;

export async function generatePersonalizedOutfitSuggestions(input: GenerateOutfitInput): Promise<GenerateOutfitOutput> {
  return generatePersonalizedOutfitSuggestionsFlow(input);
}

const generateOutfitPrompt = ai.definePrompt({
  name: 'generateOutfitPrompt',
  input: { schema: GenerateOutfitInputSchema },
  output: { schema: GenerateOutfitOutputSchema },
  prompt: `You are DripAdvisor AI, an expert fashion stylist. Your task is to suggest 2-3 tailored outfit combinations based on the user's preferences. For each outfit, provide a description, style tips, and a breakdown of items including type, name, price range, and placeholder affiliate links for Amazon India, Myntra, and Ajio. Ensure the output is a valid JSON object.

User Profile:
Height: {{{height}}} cm
Weight: {{{weight}}} kg
Style/Gender: {{{genderStyle}}}
Occasion: {{{occasion}}}
Budget: ₹{{{budget}}}
Location: {{{location}}}

{{#if bodyType}}Body Type: {{{bodyType}}}.{{/if}}
{{#if preferredColors}}Preferred Colors: {{preferredColors}}.{{/if}}
{{#if fitType}}Fit Type: {{{fitType}}}.{{/if}}

Generate 2-3 distinct outfit combinations. For each item, create a plausible name, a realistic price range within the user's budget (in INR, e.g., '₹500 - ₹800'), and use placeholder links that are valid URLs but do not point to real products. The links should be search URLs on the respective platforms. For example:
Amazon: https://www.amazon.in/s?k=GENERIC_PRODUCT_NAME
Myntra: https://www.myntra.com/search?q=GENERIC_PRODUCT_NAME
Ajio: https://www.ajio.com/search?text=GENERIC_PRODUCT_NAME

Example of placeholder URL for a T-shirt: https://www.amazon.in/s?k=mens+graphic+tshirt

Be creative and consider the user's preferences, making sure the entire outfit budget is respected.
`
});

const generatePersonalizedOutfitSuggestionsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOutfitSuggestionsFlow',
    inputSchema: GenerateOutfitInputSchema,
    outputSchema: GenerateOutfitOutputSchema
  },
  async (input) => {
    const { output } = await generateOutfitPrompt(input);
    if (!output) {
      throw new Error('Failed to generate outfit suggestions.');
    }
    return output;
  }
);
