"use server";

import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { generateShortId } from "@/lib/shortid";
import type { ActionState } from "@/types";

export async function createOrder(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const restaurantName = formData.get("restaurantName")?.toString().trim() ?? "";
  const payerName = formData.get("payerName")?.toString().trim() ?? "";
  const restaurantMenuUrls = formData.getAll("restaurantMenuUrls") as string[];
  const note = formData.get("note")?.toString().trim() || null;
  const restaurantId = formData.get("restaurantId")?.toString() || null;

  const errors: Record<string, string> = {};
  if (!restaurantName) errors.restaurantName = "Restaurant name is required";
  if (!payerName) errors.payerName = "Your name is required";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const shortId = await generateShortId();

  await prisma.order.create({
    data: {
      shortId,
      restaurantName,
      restaurantMenuUrls,
      note,
      payerName,
      restaurantId,
    },
  });

  redirect(`/order/${shortId}`);
}

export async function closeOrder(shortId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { shortId },
    select: { restaurantId: true, restaurantMenuUrls: true },
  });

  // Delete blobs only for ad-hoc orders (not linked to a saved restaurant)
  if (order && !order.restaurantId && order.restaurantMenuUrls.length > 0) {
    await del(order.restaurantMenuUrls);
  }

  await prisma.order.update({
    where: { shortId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      restaurantMenuUrls: [],
    },
  });

  redirect(`/order/${shortId}/closed`);
}
