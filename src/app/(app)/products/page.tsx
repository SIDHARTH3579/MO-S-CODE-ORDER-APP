'use client'

import { products } from "@/lib/data";
import { ProductCard } from "@/components/shared/product-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto">
      <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Product Catalog</h1>
          <p className="text-muted-foreground">Browse and search for products to add to your order.</p>
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search products..."
                  className="pl-10 max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
