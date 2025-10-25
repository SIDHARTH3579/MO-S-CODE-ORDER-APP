import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Products</h1>
        <p className="text-muted-foreground">Add, edit, and remove products from the catalog.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>This feature is not yet implemented.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 text-center border-2 border-dashed border-muted rounded-lg p-12">
                <h3 className="text-xl font-semibold">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">The ability to manage the product catalog directly from this dashboard will be available in a future update.</p>
                <Button disabled>Add New Product</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
