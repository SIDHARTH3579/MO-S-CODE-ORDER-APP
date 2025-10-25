'use client'

import React, { useState, useTransition } from 'react'
import { products as initialProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Upload, Loader2 } from "lucide-react";
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
  DialogClose,
} from "@/components/ui/dialog"
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from './components/product-form';
import { importProductsAction } from '@/app/actions';
import { Input } from '@/components/ui/input';


export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImporting, startImportTransition] = useTransition();
  const { toast } = useToast();
  
  const handleDeleteProduct = () => {
    if (productToDelete) {
        // In a real app, this would be an API call
        const updatedProducts = products.filter(p => p.id !== productToDelete.id)
        setProducts(updatedProducts);
        initialProducts.splice(initialProducts.findIndex(p => p.id === productToDelete.id), 1); // Mutate mock
        toast({
            title: "Product Deleted",
            description: `"${productToDelete.name}" has been removed from the catalog.`,
        });
        setProductToDelete(null);
    }
  };
  
  const handleFormSubmit = (productData: Omit<Product, 'id' | 'imageUrl' | 'imageHint'> & { id?: string }) => {
    if (productData.id) {
      // Edit existing product
      const updatedProducts = products.map(p => p.id === productData.id ? { ...p, ...productData } : p);
      setProducts(updatedProducts);
      
      const index = initialProducts.findIndex(p => p.id === productData.id);
      if (index !== -1) {
        initialProducts[index] = { ...initialProducts[index], ...productData };
      }

      toast({
        title: "Product Updated",
        description: `"${productData.name}" has been updated.`,
      });
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: `prod_${String(Math.random()).slice(2, 8)}`,
        // For new products, we'll use a placeholder. Image upload would be a next step.
        imageUrl: `https://picsum.photos/seed/${String(Math.random()).slice(2, 8)}/400/400`, 
        imageHint: 'product photo',
      };
      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts);
      initialProducts.push(newProduct);
      toast({
        title: "Product Added",
        description: `"${newProduct.name}" has been added to the catalog.`,
      });
    }
    setIsFormOpen(false);
    setProductToEdit(undefined);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target?.result as string;
        startImportTransition(async () => {
            const result = await importProductsAction(content);
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Import Failed",
                    description: result.error,
                });
            } else {
                // Here you would merge new products, for simplicity we replace them
                setProducts(result.products!);
                initialProducts.splice(0, initialProducts.length, ...result.products!);
                toast({
                    title: "Import Successful",
                    description: `${result.products?.length} products have been imported.`,
                });
            }
        });
    };
    reader.readAsText(file);
  };


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
                            Bulk-upload products from a CSV file. The file should have `name`, `description`, `category`, `price`, and `shades` columns.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm space-y-4">
                       <Input type="file" accept=".csv" onChange={handleFileChange} disabled={isImporting} />
                       {isImporting && (
                           <div className="flex items-center text-muted-foreground">
                               <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                               Processing file, please wait...
                           </div>
                       )}
                    </div>
                </DialogContent>
            </Dialog>
            <Button onClick={() => { setProductToEdit(undefined); setIsFormOpen(true)}}>
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
                                        <DropdownMenuItem onClick={() => { setProductToEdit(product); setIsFormOpen(true);}}>Edit</DropdownMenuItem>
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

       <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) setProductToEdit(undefined); setIsFormOpen(open);}}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
             <DialogDescription>
                {productToEdit ? 'Update the details of your product.' : 'Fill in the form to add a new product to the catalog.'}
             </DialogDescription>
           </DialogHeader>
           <ProductForm
             product={productToEdit}
             onSubmit={handleFormSubmit}
             onCancel={() => { setIsFormOpen(false); setProductToEdit(undefined); }}
            />
         </DialogContent>
       </Dialog>
    </div>
  );
}
