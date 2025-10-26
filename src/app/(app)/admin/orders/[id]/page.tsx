"use client";

import { useParams } from "next/navigation";
import { useOrders } from "@/hooks/use-orders";
import { products } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order, OrderItem, OrderStatus } from "@/types";
import Image from "next/image";
import Link from 'next/link';
import { ArrowLeft, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  Processing: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  Delivered: "bg-green-500/20 text-green-700 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-700 border-red-500/30",
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId) as Order | undefined;

  if (!order) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground">The requested order could not be found.</p>
        <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
        <div className="mb-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.items.map((item: OrderItem, index) => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                                <TableRow key={`${item.productId}-${index}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={product?.imageUrl ?? ''} alt={item.productName} width={40} height={40} className="rounded-md" />
                                            <div>
                                                <span className="font-medium">{item.productName}</span>
                                                {item.shade && (
                                                    <p className="text-xs text-muted-foreground">{item.shade}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID</span>
                        <span className="font-medium">#{order.id.split('_')[1]}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={statusColors[order.status]}>{order.status}</Badge>
                    </div>
                    <Separator/>
                     <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Agent & Shop</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium">{order.userName}</p>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{order.shopName}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
