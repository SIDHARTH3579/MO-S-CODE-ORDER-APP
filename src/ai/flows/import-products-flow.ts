'use server';
/**
 * @fileOverview A flow for importing products from a CSV file.
 *
 * - importProductsFlow - A function that parses CSV data and returns structured product information.
 * - ImportProductsInput - The input type for the importProductsFlow function.
 * - ImportProductsOutput - The return type for the importProductsFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ImportProductsInputSchema = z.object({
  csvData: z.string().describe('The full CSV content as a string.'),
});
export type ImportProductsInput = z.infer<typeof ImportProductsInputSchema>;

const ProductSchema = z.object({
    name: z.string().describe('The name of the product.'),
    description: z.string().describe('A brief description of the product.'),
    category: z.string().describe('The product category (e.g., Lipstick, Foundation).'),
    price: z.number().describe('The price of the product.'),
    shades: z.array(z.string()).describe('A list of available shades for the product. Can be an empty array if not applicable.'),
});

export const ImportProductsOutputSchema = z.object({
  products: z.array(ProductSchema).describe('An array of successfully parsed product objects.'),
});
export type ImportProductsOutput = z.infer<typeof ImportProductsOutputSchema>;

export async function importProductsFlow(input: ImportProductsInput): Promise<ImportProductsOutput> {
  return importProductsGenkitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importProductsPrompt',
  input: {schema: ImportProductsInputSchema},
  output: {schema: ImportProductsOutputSchema},
  prompt: `You are an AI assistant designed to parse product data from a CSV string.
The user will provide CSV data. Your task is to extract the product information and format it into a JSON object.

The CSV has the following columns: name, description, category, price, shades.
The 'shades' column is a comma-separated string. You must convert it into an array of strings.
Ensure the 'price' is a number.

Here is the CSV data:
{{{csvData}}}

Parse the data and return a JSON object containing an array of products.
`,
});

const importProductsGenkitFlow = ai.defineFlow(
  {
    name: 'importProductsFlow',
    inputSchema: ImportProductsInputSchema,
    outputSchema: ImportProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
