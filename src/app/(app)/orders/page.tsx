"use client";

import { useAuth } from "@/contexts/auth-context";
import { orders } from "@/lib/data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus, Order } from "@/types";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  Processing: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  Delivered: "bg-green-500/20 text-green-700 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-700 border-red-500/30",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const userOrders = orders.filter((order) => order.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Orders</h1>
            <p className="text-muted-foreground">View your order history and status.</p>
        </div>
        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {userOrders.length > 0 ? (
                    userOrders.map((order: Order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.split('_')[1]}</TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <Badge
                            className={statusColors[order.status]}
                        >
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/orders/${order.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No orders found.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  );
}
