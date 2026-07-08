"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { generateShortId } from "@/lib/shortid";
import type { ActionState } from "@/types";

export async function createOrder(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const restaurantName = formData.get("restaurantName")?.toString().trim() ?? "";
  const payerName = formData.get("payerName")?.toString().trim() ?? "";
  const restaurantMenuUrl =
    formData.get("restaurantMenuUrl")?.toString().trim() || null;
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
      restaurantMenuUrl,
      note,
      payerName,
      restaurantId,
    },
  });

  redirect(`/order/${shortId}`);
}

export async function closeOrder(shortId: string): Promise<void> {
  await prisma.order.update({
    where: { shortId },
    data: { status: "CLOSED", closedAt: new Date() },
  });
  redirect(`/order/${shortId}/closed`);
}
