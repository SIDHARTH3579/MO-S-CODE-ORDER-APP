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
