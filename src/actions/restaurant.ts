"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { ActionState } from "@/types";

export async function createRestaurant(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const menuUrl = formData.get("menuUrl")?.toString().trim() || null;
  const note = formData.get("note")?.toString().trim() || null;

  if (!name) {
    return { success: false, errors: { name: "Restaurant name is required" } };
  }

  await prisma.restaurant.create({ data: { name, menuUrl, note } });

  revalidatePath("/restaurants");
  revalidatePath("/order/new");

  return { success: true, message: `${name} saved!` };
}

export async function deleteRestaurant(id: string): Promise<void> {
  await prisma.restaurant.delete({ where: { id } });
  revalidatePath("/restaurants");
  revalidatePath("/order/new");
}
