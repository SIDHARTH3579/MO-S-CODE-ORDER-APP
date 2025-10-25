'use client'

import { products } from "@/lib/data";
import { ProductCard } from "@/components/shared/product-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { redirect } from "next/navigation";

export default function ProductsPage() {
    redirect('/products');
}
