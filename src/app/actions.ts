"use server";

import { generateOrderUpdateEmail, OrderUpdateEmailOutput } from "@/ai/flows/order-update-email-alerts";
import { generateNewOrderEmail, NewOrderEmailOutput } from "@/ai/flows/new-order-email-alert";
import { importProductsFlow } from "@/ai/flows/import-products-flow";
import { importUsersFlow } from "@/ai/flows/import-users-flow";
import { products as initialProducts } from "@/lib/data"; // Keep for product actions
import { Order, OrderStatus, Product, ImportProductsOutput, User, ImportUsersOutput } from "@/types";
import { revalidatePath } from "next/cache";

// This action now only handles the AI part. The state update is done on the client.
export async function updateOrderStatusAction(
  order: Order,
  newStatus: OrderStatus
): Promise<OrderUpdateEmailOutput | { error: string }> {
  
  const oldStatus = order.status;

  try {
    const emailResult = await generateOrderUpdateEmail({
      orderId: order.id,
      oldStatus,
      newStatus,
      orderFlags: order.flags || [],
      agentName: order.userName,
      customerEmail: "customer@example.com", // Mock customer email
    });
    
    // We still revalidate to ensure if there were other server-side data sources they would update.
    revalidatePath("/admin");
    revalidatePath(`/orders/${order.id}`);
    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath('/orders');

    return emailResult;
  } catch (e) {
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
             // This revalidation works because product data is still from a static file.
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
