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

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const StyleChatInputSchema = z.object({
  message: z.string().describe("The user's message to the style coach."),
  history: z.array(MessageSchema).optional().describe("The conversation history."),
});
export type StyleChatInput = z.infer<typeof StyleChatInputSchema>;
export type Message = z.infer<typeof MessageSchema>;

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
  prompt: `You are VYXEN AI, a friendly, expert style coach and helpful general-purpose assistant. Your primary goal is to provide fashion advice, but you can also answer general questions directly and accurately.

Keep your responses concise, helpful, and engaging.

{{#if history}}
This is the conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{/if}}

Current user message:
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
    try {
      const {output} = await styleChatPrompt(input);
      if (!output) {
        throw new Error('The AI coach failed to generate a response.');
      }
      return output;
    } catch (error: any) {
      console.warn('AI Chat failed (Quota/Limit), serving fallback response:', error.message);
      return {
        response: "I'm experiencing a high volume of requests right now. Please wait a moment and try your message again.",
      };
    }
  }
);
