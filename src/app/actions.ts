"use server";

import { generateOrderUpdateEmail, OrderUpdateEmailOutput } from "@/ai/flows/order-update-email-alerts";
import { notifyAdminOfNewOrderAction as notifyAdminOfNewOrderActionFlow, generateNewOrderEmail, NewOrderEmailOutput } from "@/ai/flows/new-order-email-alert";
import { importProductsFlow } from "@/ai/flows/import-products-flow";
import { importUsersFlow } from "@/ai/flows/import-users-flow";
import { orders } from "@/lib/data";
import { Order, OrderStatus, Product, ImportProductsOutput, User, ImportUsersOutput } from "@/types";
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
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/orders');


    return emailResult;
  } catch (e) {
    // Revert status on AI failure
    order.status = oldStatus;
    console.error("AI Flow failed:", e);
    return { error: "Failed to generate email alert." };
  }
}

export async function importProductsAction(csvData: string): Promise<{ products?: Product[], error?: string }> {
    try {
        const result: ImportProductsOutput = await importProductsFlow({ csvData });
        if (result.products) {
             const newProducts: Product[] = result.products.map(p => ({
                ...p,
                id: `prod_${String(Math.random()).slice(2, 8)}`,
                imageUrl: `https://picsum.photos/seed/${String(Math.random()).slice(2, 8)}/400/400`,
                imageHint: 'product photo',
             }));
             revalidatePath('/admin/products');
             return { products: newProducts };
        }
        return { error: "Failed to parse products from file." };
    } catch(e) {
        console.error("Import products flow failed:", e);
        return { error: "An unexpected error occurred during import." };
    }
}

export async function importUsersAction(csvData: string): Promise<{ users?: User[], error?: string }> {
    try {
        const result: ImportUsersOutput = await importUsersFlow({ csvData });
        if (result.users) {
             const newUsers: User[] = result.users.map(u => ({
                ...u,
                id: `user_${String(Math.random()).slice(2, 8)}`,
             }));
             revalidatePath('/admin/users');
             return { users: newUsers };
        }
        return { error: "Failed to parse users from file." };
    } catch(e) {
        console.error("Import users flow failed:", e);
        return { error: "An unexpected error occurred during import." };
    }
}

export async function notifyAdminOfNewOrderAction(
    order: Order,
    adminEmail: string
): Promise<NewOrderEmailOutput | { error: string }> {
    try {
        const emailResult = await generateNewOrderEmail({
            order,
            adminEmail,
        });
        return emailResult;
    } catch (e) {
        console.error("Notify admin flow failed:", e);
        return { error: "Failed to generate admin notification." };
    }
}
