"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [shadeQuantities, setShadeQuantities] = useState<Record<string, number>>({});

  const hasShades = product.shades && product.shades.length > 0;

  const handleQuantityChange = (shade: string, newQuantity: number) => {
    setShadeQuantities(prev => ({
        ...prev,
        [shade]: Math.max(0, newQuantity),
    }));
  };
  
  const handleAddToCart = () => {
    if (hasShades) {
        Object.entries(shadeQuantities).forEach(([shade, quantity]) => {
            if (quantity > 0) {
                addToCart(product, quantity, shade);
            }
        });
    } else {
        addToCart(product, 1);
    }
    setShadeQuantities({});
    setOpen(false);
  };
  
  const totalItems = Object.values(shadeQuantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <Card className="flex h-full transform-gpu flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <DialogTrigger asChild>
            <div className="cursor-pointer flex-1 flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    data-ai-hint={product.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <CardTitle className="mb-1 text-base font-medium">{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  ₹{product.price.toFixed(2)}
                </CardDescription>
              </CardContent>
            </div>
           </DialogTrigger>
          <CardFooter className="p-4 pt-0">
             <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                if (hasShades) {
                    setOpen(true);
                } else {
                    addToCart(product, 1);
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="relative mb-4 h-64 w-full rounded-lg overflow-hidden">
             <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                data-ai-hint={product.imageHint}
              />
          </div>
          <DialogTitle className="text-2xl font-headline">{product.name}</DialogTitle>
          <p className="text-2xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
          <DialogDescription className="pt-2">{product.description}</DialogDescription>
        </DialogHeader>

        {hasShades ? (
            <div className="py-4 space-y-4 max-h-60 overflow-y-auto">
                <h4 className="font-semibold">Available Shades:</h4>
                {product.shades.map(shade => (
                    <div key={shade} className="flex items-center justify-between gap-4">
                       <Badge variant="secondary">{shade}</Badge>
                       <div className="flex items-center gap-2">
                           <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleQuantityChange(shade, (shadeQuantities[shade] || 0) - 1)}>
                               <Minus className="h-4 w-4"/>
                           </Button>
                            <Input
                                type="number"
                                className="w-16 h-8 text-center"
                                value={shadeQuantities[shade] || 0}
                                onChange={(e) => handleQuantityChange(shade, parseInt(e.target.value) || 0)}
                                min="0"
                            />
                           <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleQuantityChange(shade, (shadeQuantities[shade] || 0) + 1)}>
                               <Plus className="h-4 w-4"/>
                           </Button>
                       </div>
                    </div>
                ))}
            </div>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleAddToCart}
            disabled={hasShades && totalItems === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add ({hasShades ? totalItems : 1}) to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
