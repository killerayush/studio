'use server';
/**
 * @fileOverview AI Personal Style Analyzer using Vision.
 *
 * - analyzeStyleFromImage - Analyzes a user's photo to provide style feedback.
 * - StyleAnalysisInput - Input schema (image data URI).
 * - StyleAnalysisOutput - Output schema (style analysis results).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleAnalysisInputSchema = z.object({
  imageDataUri: z.string().describe(
    "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type StyleAnalysisInput = z.infer<typeof StyleAnalysisInputSchema>;

const StyleAnalysisOutputSchema = z.object({
  styleScore: z.number().min(0).max(10).describe('An overall style score from 1 to 10.'),
  bodyType: z.string().describe('The detected body type of the person (e.g., Ectomorph, Mesomorph, Athletic).'),
  bestFit: z.string().describe('The recommended clothing fit for their body type (e.g., Slim Fit, Regular Fit).'),
  avoidFit: z.string().describe('Clothing fits to avoid.'),
  bestColors: z.array(z.string()).describe('A list of colors that are most compatible with the person\'s skin tone.'),
  avoidColors: z.array(z.string()).describe('A list of colors to avoid.'),
  outfitFeedback: z.object({
      good: z.array(z.string()).describe('Positive feedback on the current outfit.'),
      improve: z.array(z.string()).describe('Areas for improvement in the current outfit.'),
  }).describe('Feedback on the current outfit.'),
  recommendedOutfit: z.array(z.object({
      type: z.string().describe('Type of clothing item (e.g., T-shirt, Jeans).'),
      description: z.string().describe('Description of the recommended item.'),
  })).describe('A full recommended outfit based on the analysis.'),
  clothesSuggestions: z.object({
    tops: z.array(z.string()),
    bottoms: z.array(z.string()),
    shoes: z.array(z.string()),
    avoid: z.array(z.string()),
  }).describe('Category-based clothing recommendations.'),
  isFallback: z.boolean().default(false).describe('Indicates if the analysis is a pre-curated fallback.'),
});
export type StyleAnalysisOutput = z.infer<typeof StyleAnalysisOutputSchema>;

export async function analyzeStyleFromImage(input: StyleAnalysisInput): Promise<StyleAnalysisOutput> {
  return analyzeStyleFlow(input);
}

const analyzeStylePrompt = ai.definePrompt({
    name: 'styleAnalyzerPrompt',
    input: { schema: StyleAnalysisInputSchema },
    output: { schema: StyleAnalysisOutputSchema },
    config: {
        temperature: 0.7,
    },
    prompt: `You are VYXEN AI, a world-class personal stylist with an expert eye for fashion, body types, and color theory. Analyze the person in this image.

Your task is to provide a detailed, constructive, and empowering style analysis. Be honest but encouraging.

Your analysis MUST be in JSON format and conform to the output schema.

Based on the image, provide the following:
1.  **styleScore**: An overall score from 1-10.
2.  **bodyType**: Identify the user's body type (e.g., Athletic, Slim, Curvy, Pear, Apple).
3.  **bestFit / avoidFit**: Recommend clothing fits that flatter their body type and which to avoid.
4.  **bestColors / avoidColors**: Analyze their skin tone and suggest complementary and unflattering colors.
5.  **outfitFeedback**: Give specific feedback on their current outfit. What works well ('good') and what could be improved ('improve').
6.  **recommendedOutfit**: Suggest a complete, new outfit that would look great on them. Be specific.
7.  **clothesSuggestions**: Provide a matrix of recommended clothing types (tops, bottoms, shoes) and types to avoid.

Image to analyze: {{media url=imageDataUri}}
`
});

function getMaleFallbackAnalysis(): StyleAnalysisOutput {
  return {
    styleScore: 7.5,
    bodyType: 'Athletic',
    bestFit: 'Slim Fit',
    avoidFit: 'Baggy or Oversized',
    bestColors: ['Navy Blue', 'Olive Green', 'Charcoal Grey'],
    avoidColors: ['Neon Yellow', 'Bright Orange'],
    outfitFeedback: {
      good: ['The fit of your top is great.', 'Solid color choice.'],
      improve: ['Pants could be more tapered.', 'Consider adding an accessory.'],
    },
    recommendedOutfit: [
      { type: 'Top', description: 'White Oxford Shirt' },
      { type: 'Bottom', description: 'Dark Wash Slim-Fit Jeans' },
      { type: 'Shoes', description: 'Brown Leather Boots' },
    ],
    clothesSuggestions: {
      tops: ['Henleys', 'Fitted T-Shirts', 'Casual Shirts'],
      bottoms: ['Chinos', 'Slim Jeans', 'Tailored Shorts'],
      shoes: ['Minimalist Sneakers', 'Loafers', 'Desert Boots'],
      avoid: ['Graphic Tees with large logos', 'Ripped Jeans'],
    },
    isFallback: true,
  };
}

function getFemaleFallbackAnalysis(): StyleAnalysisOutput {
  return {
    styleScore: 8.0,
    bodyType: 'Pear Shape',
    bestFit: 'A-Line Skirts, Wide-Leg Trousers',
    avoidFit: 'Low-rise Jeans, Clingy Tops',
    bestColors: ['Emerald Green', 'Burgundy', 'Royal Blue'],
    avoidColors: ['Ash Grey', 'Dull Beige'],
    outfitFeedback: {
      good: ['The color of your dress is lovely.', 'Flattering neckline.'],
      improve: ['A belt could define your waist more.', 'Statement earrings would elevate this.'],
    },
    recommendedOutfit: [
      { type: 'Top', description: 'Fitted Black Bodysuit' },
      { type: 'Bottom', description: 'High-Waisted A-Line Midi Skirt' },
      { type: 'Shoes', description: 'Heeled Ankle Boots' },
    ],
    clothesSuggestions: {
      tops: ['Wrap Tops', 'Off-shoulder Blouses', 'V-neck Sweaters'],
      bottoms: ['High-waisted Trousers', 'Flowy Skirts', 'Dark-wash Flare Jeans'],
      shoes: ['Block Heels', 'Pointed Flats', 'Knee-high Boots'],
      avoid: ['Tube Tops', 'Horizontal Stripes on Hips'],
    },
    isFallback: true,
  };
}

const analyzeStyleFlow = ai.defineFlow(
  {
    name: 'analyzeStyleFlow',
    inputSchema: StyleAnalysisInputSchema,
    outputSchema: StyleAnalysisOutputSchema,
  },
  async input => {
    try {
        const {output} = await analyzeStylePrompt(input);
        if (!output) {
            throw new Error('Style analysis failed to produce an output.');
        }
        return output;
    } catch (error: any) {
        console.warn('Style analysis failed (Quota/Limit), serving fallback:', error.message);
        // Randomly return a male or female fallback to make it less static
        return Math.random() > 0.5 ? getMaleFallbackAnalysis() : getFemaleFallbackAnalysis();
    }
  }
);
