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
import { Plus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex h-full transform-gpu cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
              ${product.price.toFixed(2)}
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
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
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <DialogDescription className="pt-2">{product.description}</DialogDescription>
        </DialogHeader>
        {product.shades && product.shades.length > 0 && (
          <div className="py-4">
            <h4 className="font-semibold mb-2">Available Shades:</h4>
            <div className="flex flex-wrap gap-2">
              {product.shades.map(shade => <Badge key={shade} variant="secondary">{shade}</Badge>)}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => addToCart(product, 1)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
