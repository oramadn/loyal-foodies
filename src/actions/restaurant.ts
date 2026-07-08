"use server";

import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/db";
import type { ActionState } from "@/types";

export async function createRestaurant(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const menuUrls = formData.getAll("menuUrls") as string[];
  const note = formData.get("note")?.toString().trim() || null;

  if (!name) {
    return { success: false, errors: { name: "Restaurant name is required" } };
  }

  await prisma.restaurant.create({ data: { name, menuUrls, note } });

  revalidatePath("/restaurants");
  revalidatePath("/order/new");

  return { success: true, message: `${name} saved!` };
}

export async function deleteRestaurant(id: string): Promise<void> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { menuUrls: true },
  });

  if (restaurant?.menuUrls.length) {
    await del(restaurant.menuUrls);
  }

  await prisma.restaurant.delete({ where: { id } });
  revalidatePath("/restaurants");
  revalidatePath("/order/new");
}
