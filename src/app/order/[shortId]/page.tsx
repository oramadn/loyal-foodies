import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LiveOrderView } from "@/components/LiveOrderView";
import type { OrderSnapshot, SharedCost } from "@/types";

type Props = {
  params: Promise<{ shortId: string }>;
};

export default async function OrderPage({ params }: Props) {
  const { shortId } = await params;

  const order = await prisma.order.findUnique({
    where: { shortId },
    include: { entries: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) notFound();

  const totalOwed = order.entries.reduce((sum, e) => {
    return sum + (e.amount ? parseFloat(e.amount.toString()) : 0);
  }, 0);

  const initialData: OrderSnapshot = {
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

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <LiveOrderView shortId={shortId} initialData={initialData} />
    </main>
  );
}
