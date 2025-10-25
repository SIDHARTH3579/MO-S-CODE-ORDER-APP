"use server";

import { generateOrderUpdateEmail, OrderUpdateEmailOutput } from "@/ai/flows/order-update-email-alerts";
import { orders } from "@/lib/data";
import { Order, OrderStatus } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
): Promise<OrderUpdateEmailOutput | { error: string }> {
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return { error: "Order not found." };
  }

  const oldStatus = order.status;

  // In a real app, you'd save this to a database.
  // Here we just update the in-memory object.
  order.status = newStatus;

  try {
    const emailResult = await generateOrderUpdateEmail({
      orderId: order.id,
      oldStatus,
      newStatus,
      orderFlags: order.flags || [],
      agentName: order.userName,
      customerEmail: "customer@example.com", // Mock customer email
    });

    // Revalidate the admin page to show the updated status
    revalidatePath("/admin");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');


    return emailResult;
  } catch (e) {
    // Revert status on AI failure
    order.status = oldStatus;
    console.error("AI Flow failed:", e);
    return { error: "Failed to generate email alert." };
  }
}
