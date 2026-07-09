import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { OrderSummaryTable } from "@/components/OrderSummaryTable";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import type { SharedCost } from "@/types";

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

  const sharedCosts: SharedCost[] = (order.sharedCosts as SharedCost[]) ?? [];
  const totalFees = sharedCosts.reduce((s, c) => s + c.amount, 0);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 inline-flex")}
      >
        <ArrowLeftIcon className="size-4 mr-1" />
        Home
      </Link>
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

      {/* Shared costs breakdown */}
      {sharedCosts.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Shared costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-sm">
              {sharedCosts.map((c, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-muted-foreground">{c.name}</span>
                  <span>{formatCurrency(c.amount)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>
                  Total split among {order.entries.length} participant
                  {order.entries.length !== 1 ? "s" : ""}
                </span>
                <span>
                  {formatCurrency(totalFees / (order.entries.length || 1))} each
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Final order summary</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummaryTable
            entries={entries}
            totalOwed={totalOwed.toFixed(2)}
            payerName={order.payerName}
            sharedCosts={sharedCosts}
          />
        </CardContent>
      </Card>
    </main>
  );
}
