import { z } from "zod";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "agent" | "admin";
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  shades: string[];
  price: number;
  imageUrl: string;
  imageHint: string;
};

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  shade?: string;
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  flags?: string[];
};

export type CartItem = {
  cartItemId: string; // e.g., product.id or product.id_shade
  id: string; // product.id
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  shade?: string;
};


// Schema for AI flow to import products
export const ImportProductsInputSchema = z.object({
  csvData: z.string().describe('The full CSV content as a string.'),
});
export type ImportProductsInput = z.infer<typeof ImportProductsInputSchema>;

const ProductImportSchema = z.object({
    name: z.string().describe('The name of the product.'),
    description: z.string().describe('A brief description of the product.'),
    category: z.string().describe('The product category (e.g., Lipstick, Foundation).'),
    price: z.number().describe('The price of the product.'),
    shades: z.array(z.string()).describe('A list of available shades for the product. Can be an empty array if not applicable.'),
});

export const ImportProductsOutputSchema = z.object({
  products: z.array(ProductImportSchema).describe('An array of successfully parsed product objects.'),
});
export type ImportProductsOutput = z.infer<typeof ImportProductsOutputSchema>;

// Schema for AI flow to import users
export const ImportUsersInputSchema = z.object({
  csvData: z.string().describe('The full CSV content as a string.'),
});
export type ImportUsersInput = z.infer<typeof ImportUsersInputSchema>;

const UserImportSchema = z.object({
    name: z.string().describe('The name of the user.'),
    email: z.string().email().describe('The email address of the user.'),
    role: z.enum(["agent", "admin"]).describe('The role of the user, must be "agent" or "admin".'),
});

export const ImportUsersOutputSchema = z.object({
  users: z.array(UserImportSchema).describe('An array of successfully parsed user objects.'),
});
export type ImportUsersOutput = z.infer<typeof ImportUsersOutputSchema>;
