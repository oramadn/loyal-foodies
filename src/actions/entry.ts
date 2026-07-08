"use server";

import { prisma } from "@/lib/db";
import type { ActionState } from "@/types";

export async function addEntry(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const shortId = formData.get("shortId")?.toString() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const items = formData.get("items")?.toString().trim() ?? "";
  const amountStr = formData.get("amount")?.toString().trim() ?? "";

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Your name is required";
  if (!items) errors.items = "Items are required";

  let amount: number | null = null;
  if (amountStr) {
    amount = parseFloat(amountStr);
    if (isNaN(amount) || amount < 0) {
      errors.amount = "Amount must be a positive number";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const order = await prisma.order.findUnique({
    where: { shortId },
    select: { id: true, status: true },
  });

  if (!order) return { success: false, errors: { _: "Order not found" } };
  if (order.status === "CLOSED") {
    return { success: false, errors: { _: "This order is already closed" } };
  }

  await prisma.orderEntry.create({
    data: {
      orderId: order.id,
      name,
      items,
      amount: amount !== null ? amount : undefined,
    },
  });

  return { success: true, message: "Your order was added!" };
}
