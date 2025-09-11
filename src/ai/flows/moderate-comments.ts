'use server';
/**
 * @fileOverview A content moderation flow for user comments.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ModerationInputSchema = z.string();
const ModerationOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the content is safe or not.'),
  reason: z.string().optional().describe('The reason why the content was flagged, if applicable.'),
});

export type ModerationOutput = z.infer<typeof ModerationOutputSchema>;

const moderationPrompt = ai.definePrompt({
  name: 'commentModerationPrompt',
  input: {schema: ModerationInputSchema},
  output: {schema: ModerationOutputSchema},
  prompt: `You are a content moderator for a family-friendly website about cultural heritage.
    Analyze the following text and determine if it is appropriate. Content should be considered unsafe if it contains hate speech, harassment, sexually explicit material, or dangerous content.
    Provide a reason only if the content is flagged as not safe.

    Text to analyze: {{{input}}}`,
});

const moderateCommentFlow = ai.defineFlow(
  {
    name: 'moderateCommentFlow',
    inputSchema: ModerationInputSchema,
    outputSchema: ModerationOutputSchema,
  },
  async (input) => {
    const {output} = await moderationPrompt(input);
    if (!output) {
      throw new Error("Moderation flow did not return an output.");
    }
    return output;
  }
);

// Expose the flow to be callable by server actions
export async function moderateComment(commentText: string): Promise<ModerationOutput> {
    return await moderateCommentFlow(commentText);
}
