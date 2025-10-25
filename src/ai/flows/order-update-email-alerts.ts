'use server';

/**
 * @fileOverview A flow for generating email alerts when an order's status changes.
 *
 * - generateOrderUpdateEmail - A function that generates the email content based on the order status and context.
 * - OrderUpdateEmailInput - The input type for the generateOrderUpdateEmail function.
 * - OrderUpdateEmailOutput - The return type for the generateOrderUpdateEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OrderUpdateEmailInputSchema = z.object({
  orderId: z.string().describe('The ID of the order.'),
  oldStatus: z.string().describe('The previous status of the order.'),
  newStatus: z.string().describe('The new status of the order.'),
  orderFlags: z.array(z.string()).optional().describe('Any flags associated with the order (e.g., "urgent", "vip").'),
  agentName: z.string().describe('The name of the agent associated with the order.'),
  customerEmail: z.string().email().describe('The email address of the customer.'),
});

export type OrderUpdateEmailInput = z.infer<typeof OrderUpdateEmailInputSchema>;

const OrderUpdateEmailOutputSchema = z.object({
  sendEmail: z.boolean().describe('Whether an email notification is necessary.'),
  emailTemplate: z.string().describe('The name of the email template to use (e.g., "status-update", "urgent-alert").'),
  emailSubject: z.string().describe('Subject line for the email.'),
  emailBody: z.string().describe('The content of the email.'),
});

export type OrderUpdateEmailOutput = z.infer<typeof OrderUpdateEmailOutputSchema>;

export async function generateOrderUpdateEmail(input: OrderUpdateEmailInput): Promise<OrderUpdateEmailOutput> {
  return orderUpdateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'orderUpdateEmailPrompt',
  input: {schema: OrderUpdateEmailInputSchema},
  output: {schema: OrderUpdateEmailOutputSchema},
  prompt: `You are an AI assistant responsible for determining if an email notification should be sent to a customer when their order status changes and selecting the most appropriate email template.

  Here's the order information:
  Order ID: {{{orderId}}}
  Previous Status: {{{oldStatus}}}
  New Status: {{{newStatus}}}
  Order Flags: {{#if orderFlags}}{{#each orderFlags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
  Agent Name: {{{agentName}}}
  Customer Email: {{{customerEmail}}}

  Based on this information, decide whether an email notification is necessary. Consider factors such as the importance of the status change, any associated order flags (e.g., "urgent", "vip"), and the context of the order.

  If an email is necessary, select the most appropriate email template from the following options:
  - "status-update": A general template for notifying customers of routine status updates.
  - "urgent-alert": A template for notifying customers of urgent issues or significant changes to their order.
  - "no-email": Indicates that no email should be sent.

  If you chose a template other than "no-email", generate a subject and body for the email.

  The output should be a JSON object with the following fields:
  - sendEmail (boolean): true if an email should be sent, false otherwise.
  - emailTemplate (string): The name of the email template to use (e.g., "status-update", "urgent-alert", "no-email").
  - emailSubject (string): The subject line for the email.
  - emailBody (string): The content of the email.

  For example:
  {
    "sendEmail": true,
    "emailTemplate": "status-update",
    "emailSubject": "Order Status Update - Order #12345",
    "emailBody": "Dear Customer,\nYour order #12345 has been updated to Shipped.\n..."
  }
`,
});

const orderUpdateEmailFlow = ai.defineFlow(
  {
    name: 'orderUpdateEmailFlow',
    inputSchema: OrderUpdateEmailInputSchema,
    outputSchema: OrderUpdateEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
