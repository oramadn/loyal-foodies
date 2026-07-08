import { nanoid } from "nanoid";
import { prisma } from "./db";

export async function generateShortId(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const id = nanoid(8);
    const exists = await prisma.order.findUnique({ where: { shortId: id } });
    if (!exists) return id;
  }
  throw new Error("Failed to generate a unique short ID after 5 attempts");
}
