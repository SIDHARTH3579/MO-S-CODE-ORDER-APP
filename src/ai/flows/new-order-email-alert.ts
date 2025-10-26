'use server';

/**
 * @fileOverview A flow for generating an email alert to an admin when a new order is placed.
 *
 * - generateNewOrderEmail - A function that generates the email content.
 * - NewOrderEmailInput - The input type for the generateNewOrderEmail function.
 * - NewOrderEmailOutput - The return type for the generateNewOrderEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Order } from '@/types';

const NewOrderEmailInputSchema = z.object({
  order: z.any().describe('The full order object.'),
  adminEmail: z.string().email().describe('The email address of the admin to notify.'),
});

export type NewOrderEmailInput = z.infer<typeof NewOrderEmailInputSchema>;

const NewOrderEmailOutputSchema = z.object({
  emailSubject: z.string().describe('Subject line for the admin email.'),
  emailBody: z.string().describe('The content of the email for the admin.'),
});

export type NewOrderEmailOutput = z.infer<typeof NewOrderEmailOutputSchema>;

export async function generateNewOrderEmail(input: NewOrderEmailInput): Promise<NewOrderEmailOutput> {
  return newOrderEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'newOrderEmailPrompt',
  input: {schema: NewOrderEmailInputSchema},
  output: {schema: NewOrderEmailOutputSchema},
  prompt: `You are an AI assistant responsible for generating an email notification to an admin for a newly placed order.

  Here's the order information:
  Order ID: {{{order.id}}}
  Agent Name: {{{order.userName}}}
  Total: ₹{{{order.total}}}
  Number of items: {{{order.items.length}}}

  The email should be addressed to an admin with the email: {{{adminEmail}}}.

  Generate a concise but informative subject and body for the email to alert the admin.
  The tone should be professional and direct.
  
  The output should be a JSON object with the following fields:
  - emailSubject (string): The subject line for the email.
  - emailBody (string): The content of the email.

  For example:
  {
    "emailSubject": "New Order Placed: #12345 by Alice (Agent)",
    "emailBody": "A new order has been placed on OrderFlow.\n\nOrder ID: #12345\nAgent: Alice (Agent)\nTotal: ₹89.97\n\nPlease review the order in the admin dashboard."
  }
`,
});

const newOrderEmailFlow = ai.defineFlow(
  {
    name: 'newOrderEmailFlow',
    inputSchema: NewOrderEmailInputSchema,
    outputSchema: NewOrderEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
