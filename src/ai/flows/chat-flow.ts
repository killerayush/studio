'use server';
/**
 * @fileOverview A conversational AI style coach.
 *
 * - styleChat - A function that handles the conversational chat.
 * - StyleChatInput - The input type for the styleChat function.
 * - StyleChatOutput - The return type for the styleChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleChatInputSchema = z.object({
  message: z.string().describe("The user's message to the style coach."),
});
export type StyleChatInput = z.infer<typeof StyleChatInputSchema>;

const StyleChatOutputSchema = z.object({
  response: z.string().describe("The AI style coach's response."),
});
export type StyleChatOutput = z.infer<typeof StyleChatOutputSchema>;

export async function styleChat(input: StyleChatInput): Promise<StyleChatOutput> {
  return styleChatFlow(input);
}

const styleChatPrompt = ai.definePrompt({
  name: 'styleChatPrompt',
  input: {schema: StyleChatInputSchema},
  output: {schema: StyleChatOutputSchema},
  prompt: `You are VYXEN AI, a friendly, expert style coach. Your goal is to have a natural conversation with the user, providing them with fashion advice, outfit suggestions, and style tips.

Keep your responses concise, helpful, and engaging.

User's message:
{{{message}}}
`,
});

const styleChatFlow = ai.defineFlow(
  {
    name: 'styleChatFlow',
    inputSchema: StyleChatInputSchema,
    outputSchema: StyleChatOutputSchema,
  },
  async input => {
    const {output} = await styleChatPrompt(input);
    if (!output) {
      throw new Error('The AI coach failed to generate a response.');
    }
    return output;
  }
);
