"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderTable } from "./components/order-table";
import { useOrders } from "@/hooks/use-orders";

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all customer orders.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>A list of all orders from all agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
