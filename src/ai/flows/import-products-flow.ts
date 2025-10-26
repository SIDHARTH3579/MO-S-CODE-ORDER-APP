'use server';
/**
 * @fileOverview A flow for importing products from a CSV file.
 *
 * - importProductsFlow - A function that parses CSV data and returns structured product information.
 */

import {ai} from '@/ai/genkit';
import { ImportProductsInputSchema, ImportProductsOutputSchema, type ImportProductsInput, type ImportProductsOutput } from '@/types';

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
