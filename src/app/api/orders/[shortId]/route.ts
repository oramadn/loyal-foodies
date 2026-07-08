import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { OrderSnapshot, SharedCost } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shortId: string }> }
) {
  const { shortId } = await params;

  const order = await prisma.order.findUnique({
    where: { shortId },
    include: { entries: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const totalOwed = order.entries.reduce((sum, e) => {
    return sum + (e.amount ? parseFloat(e.amount.toString()) : 0);
  }, 0);

  const snapshot: OrderSnapshot = {
    status: order.status,
    payerName: order.payerName,
    restaurantName: order.restaurantName,
    restaurantMenuUrls: order.restaurantMenuUrls,
    note: order.note,
    sharedCosts: (order.sharedCosts as SharedCost[]) ?? [],
    entries: order.entries.map((e) => ({
      id: e.id,
      name: e.name,
      items: e.items,
      amount: e.amount ? e.amount.toString() : null,
      createdAt: e.createdAt.toISOString(),
    })),
    totalOwed: totalOwed.toFixed(2),
  };

  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
