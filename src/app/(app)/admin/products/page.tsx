'use client'

import React, { useState } from 'react'
import { products as initialProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';


export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();
  
  const handleDeleteProduct = () => {
    if (productToDelete) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        toast({
            title: "Product Deleted",
            description: `"${productToDelete.name}" has been removed from the catalog.`,
        });
        setProductToDelete(null);
    }
  };
  
  // TODO: Add product creation/editing logic

  return (
    <div className="container mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Products</h1>
          <p className="text-muted-foreground">Add, edit, and remove products from the catalog.</p>
        </div>
        <div className="flex gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Import Products
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Products</DialogTitle>
                        <DialogDescription>
                            This feature allows you to bulk-upload products from a CSV or Excel file.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm">
                        <p>To import products, please format your file with the following columns:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            <li><code className="font-mono">name</code> (Text)</li>
                            <li><code className="font-mono">description</code> (Text)</li>
                            <li><code className="font-mono">category</code> (Text)</li>
                            <li><code className="font-mono">price</code> (Number)</li>
                            <li><code className="font-mono">shades</code> (Comma-separated list, e.g., "shade 1,shade 2")</li>
                        </ul>
                         <p className="mt-4 text-muted-foreground">This is a placeholder. Functionality to upload a file is not yet implemented.</p>
                    </div>
                </DialogContent>
            </Dialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>A list of all products available for ordering.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                            Image
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Shades</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map(product => (
                        <TableRow key={product.id}>
                             <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt={product.name}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={product.imageUrl}
                                    width="64"
                                />
                             </TableCell>
                             <TableCell className="font-medium">{product.name}</TableCell>
                             <TableCell>
                                <Badge variant="outline">{product.category}</Badge>
                             </TableCell>
                             <TableCell>{product.shades.length > 0 ? product.shades.join(', ') : 'N/A'}</TableCell>
                             <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                             <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => setProductToDelete(product)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                             </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product "{productToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
