"use client";

import { useState, useTransition, useEffect } from "react";
import { useOrders } from "@/hooks/use-orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Loader2, ArrowRight } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { updateOrderStatusAction } from "@/app/actions";
import type { OrderUpdateEmailOutput } from "@/ai/flows/order-update-email-alerts";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';


const statuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  Processing: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  Delivered: "bg-green-500/20 text-green-700 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-700 border-red-500/30",
};

export function OrderTable({ initialOrders }: { orders: Order[] }) {
  const { orders, updateOrderStatus } = useOrders();
  const [isPending, startTransition] = useTransition();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [aiResultDialogOpen, setAiResultDialogOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<{
    order: Order;
    newStatus: OrderStatus;
  } | null>(null);
  const [aiResult, setAiResult] = useState<OrderUpdateEmailOutput | null>(null);
  const { toast } = useToast();
  
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (order && order.status !== newStatus) {
      setSelectedUpdate({ order, newStatus });
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmUpdate = () => {
    if (!selectedUpdate) return;
    const { order, newStatus } = selectedUpdate;

    setConfirmDialogOpen(false);
    startTransition(async () => {
      const result = await updateOrderStatusAction(
        order,
        newStatus
      );
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.error,
        });
      } else {
        // Optimistically update the UI
        updateOrderStatus(order.id, newStatus);
        setAiResult(result);
        setAiResultDialogOpen(true);
      }
    });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead><span className="sr-only">View</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id.split('_')[1]}</TableCell>
              <TableCell>{order.userName}</TableCell>
              <TableCell>{order.shopName}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(order.id, value as OrderStatus)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Update status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                  <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/orders/${order.id}`}>
                          <ArrowRight className="h-4 w-4" />
                          <span className="sr-only">View Order</span>
                      </Link>
                  </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isPending && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of order #{selectedUpdate?.order.id.split('_')[1] ?? ''} to{" "}
              <strong>{selectedUpdate?.newStatus}</strong>? This may trigger a
              notification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={aiResultDialogOpen} onOpenChange={setAiResultDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Intelligent Alert Processed</DialogTitle>
            <DialogDescription>
              The order status was updated. The AI has determined the following
              notification action.
            </DialogDescription>
          </DialogHeader>
          {aiResult && (
            <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
                    <div>
                        <p className="font-semibold">Send Email?</p>
                        <p>{aiResult.sendEmail ? "Yes" : "No"}</p>
                    </div>
                     <div className="col-span-2">
                        <p className="font-semibold">Email Template</p>
                        <div className="font-mono text-xs"><Badge variant="outline">{aiResult.emailTemplate}</Badge></div>
                    </div>
                </div>

              {aiResult.sendEmail && (
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">Email Subject</p>
                        <p className="rounded-md border bg-muted/50 p-2">{aiResult.emailSubject}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Email Body</p>
                        <p className="whitespace-pre-wrap rounded-md border bg-muted/50 p-4 font-code text-xs leading-relaxed">{aiResult.emailBody}</p>
                    </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setAiResultDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
