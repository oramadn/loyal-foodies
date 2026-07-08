import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { OrderSummaryTable } from "@/components/OrderSummaryTable";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ shortId: string }>;
};

export default async function ClosedOrderPage({ params }: Props) {
  const { shortId } = await params;

  const order = await prisma.order.findUnique({
    where: { shortId, status: "CLOSED" },
    include: { entries: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) notFound();

  const totalOwed = order.entries.reduce((sum, e) => {
    return sum + (e.amount ? parseFloat(e.amount.toString()) : 0);
  }, 0);

  const entries = order.entries.map((e) => ({
    id: e.id,
    name: e.name,
    items: e.items,
    amount: e.amount ? e.amount.toString() : null,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{order.restaurantName}</h1>
            <Badge variant="secondary">Closed</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Payer: <span className="font-medium text-foreground">{order.payerName}</span>
            {order.closedAt && (
              <> &middot; Closed {formatDate(order.closedAt)}</>
            )}
          </p>
        </div>
        <Link href="/order/new" className={buttonVariants({ size: "sm" })}>
          <PlusCircleIcon className="size-4 mr-1.5" />
          New order
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Final order summary</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummaryTable
            entries={entries}
            totalOwed={totalOwed.toFixed(2)}
            payerName={order.payerName}
          />
        </CardContent>
      </Card>
    </main>
  );
}
