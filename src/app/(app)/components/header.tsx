"use client";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/auth-context";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Badge,
  ShoppingCart,
  Trash2,
  Sidebar as SidebarIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { orders } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  
  return (
     <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <Button
         size="icon"
         variant="outline"
         className="md:hidden"
         onClick={toggleSidebar}
       >
         <SidebarIcon className="h-5 w-5" />
         <span className="sr-only">Toggle Menu</span>
       </Button>
       <div className="flex-1" />
       {user?.role === 'agent' && <CartSheet />}
     </header>
  );
}

function CartSheet() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    itemCount,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCreateOrder = () => {
    if (!user || cartItems.length === 0) return;

    const newOrder = {
      id: `ord_${String(Math.random()).slice(2, 7)}`,
      userId: user.id,
      userName: user.name,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cartTotal,
      status: "Pending" as const,
      date: new Date().toISOString(),
    };

    // This is where you would typically send the order to your backend.
    // For this demo, we'll just add it to our mock data array.
    orders.unshift(newOrder);
    
    toast({
      title: "Order Submitted!",
      description: `Your order #${newOrder.id} has been placed.`,
    });
    
    clearCart();
    // Potentially close the sheet here
  };


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-16"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <SheetFooter className="bg-secondary/50 p-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={handleCreateOrder}>
                  Create Order
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Add some products to get started.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
