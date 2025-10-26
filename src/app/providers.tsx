"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/hooks/use-cart";
// Although useOrders is client-side, we can't provide it here
// because it would wrap the login page, which shouldn't have access to orders.
// Instead, components that need orders will use the hook directly.

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
