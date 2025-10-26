'use server';
/**
 * @fileOverview A flow for importing users from a CSV file.
 *
 * - importUsersFlow - A function that parses CSV data and returns structured user information.
 */

import {ai} from '@/ai/genkit';
import { ImportUsersInputSchema, ImportUsersOutputSchema, type ImportUsersInput, type ImportUsersOutput } from '@/types';

export async function importUsersFlow(input: ImportUsersInput): Promise<ImportUsersOutput> {
  return importUsersGenkitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importUsersPrompt',
  input: {schema: ImportUsersInputSchema},
  output: {schema: ImportUsersOutputSchema},
  prompt: `You are an AI assistant designed to parse user data from a CSV string.
The user will provide CSV data. Your task is to extract the user information and format it into a JSON object.

The CSV has the following columns: name, email, role.
The 'role' must be either 'admin' or 'agent'.

Here is the CSV data:
{{{csvData}}}

Parse the data and return a JSON object containing an array of users.
`,
});

const importUsersGenkitFlow = ai.defineFlow(
  {
    name: 'importUsersFlow',
    inputSchema: ImportUsersInputSchema,
    outputSchema: ImportUsersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
