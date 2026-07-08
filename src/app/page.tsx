import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircleIcon, ChevronRightIcon, BookmarkIcon, ClockIcon } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

export default async function HomePage() {
  const [recentOrders, closedOrders, savedRestaurants] = await Promise.all([
    prisma.order.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { entries: true } } },
    }),
    prisma.order.findMany({
      where: { status: "CLOSED" },
      orderBy: { closedAt: "desc" },
      take: 8,
      include: { _count: { select: { entries: true } } },
    }),
    prisma.restaurant.findMany({
      orderBy: { name: "asc" },
      take: 6,
    }),
  ]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Loyal Foodies</h1>
        <p className="text-muted-foreground">
          Start an order, share the link in #loyal-foodies, everyone adds their items.
        </p>
        <Link
          href="/order/new"
          className={cn(buttonVariants({ size: "lg" }), "mt-2 inline-flex gap-2")}
        >
          <PlusCircleIcon className="size-5" />
          Start a new order
        </Link>
      </div>

      <Separator />

      {/* Active orders */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Active orders
        </h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No active orders right now.
          </p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/order/${order.shortId}`}>
                <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between gap-3 py-3 px-4">
                    <div>
                      <p className="font-medium">{order.restaurantName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.payerName} &middot; {order._count.entries} item
                        {order._count.entries !== 1 ? "s" : ""} &middot;{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">Open</Badge>
                      <ChevronRightIcon className="size-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Closed orders */}
      {closedOrders.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <ClockIcon className="size-3.5" />
            Past orders
          </h2>
          <div className="space-y-2">
            {closedOrders.map((order) => (
              <Link key={order.id} href={`/order/${order.shortId}/closed`}>
                <Card className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between gap-3 py-3 px-4">
                    <div>
                      <p className="font-medium">{order.restaurantName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.payerName} &middot; {order._count.entries} item
                        {order._count.entries !== 1 ? "s" : ""} &middot;{" "}
                        {order.closedAt ? formatDate(order.closedAt) : formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Closed</Badge>
                      <ChevronRightIcon className="size-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Saved restaurants */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Saved restaurants
          </h2>
          <Link
            href="/restaurants"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "inline-flex gap-1")}
          >
            <BookmarkIcon className="size-3.5" />
            Manage
          </Link>
        </div>
        {savedRestaurants.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No saved restaurants.{" "}
            <Link href="/restaurants" className="underline underline-offset-2">
              Add one
            </Link>{" "}
            to speed up future orders.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {savedRestaurants.map((r) => (
              <Link key={r.id} href={`/order/new?restaurantId=${r.id}`}>
                <Card className="hover:bg-muted/40 transition-colors cursor-pointer h-full">
                  <CardContent className="flex items-center justify-between gap-2 py-3 px-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.name}</p>
                      {r.note && (
                        <p className="text-xs text-muted-foreground truncate">{r.note}</p>
                      )}
                    </div>
                    <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
