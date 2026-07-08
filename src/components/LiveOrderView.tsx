"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderSummaryTable } from "@/components/OrderSummaryTable";
import { JoinOrderForm } from "@/components/JoinOrderForm";
import { CloseOrderButton } from "@/components/CloseOrderButton";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import type { OrderSnapshot } from "@/types";

type Props = {
  shortId: string;
  initialData: OrderSnapshot;
};

export function LiveOrderView({ shortId, initialData }: Props) {
  const [data, setData] = useState<OrderSnapshot>(initialData);

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${shortId}`, { cache: "no-store" });
      if (!res.ok) return;
      const fresh: OrderSnapshot = await res.json();
      setData(fresh);
    } catch {
      // silently ignore poll failures
    }
  }, [shortId]);

  useEffect(() => {
    if (data.status === "CLOSED") return;
    const id = setInterval(fetchLatest, 4000);
    return () => clearInterval(id);
  }, [data.status, fetchLatest]);

  const isClosed = data.status === "CLOSED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{data.restaurantName}</h1>
            <Badge variant={isClosed ? "secondary" : "default"}>
              {isClosed ? "Closed" : "Open"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Payer: <span className="font-medium text-foreground">{data.payerName}</span>
          </p>
          {data.note && (
            <p className="text-sm text-muted-foreground mt-1 italic">{data.note}</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <CopyLinkButton />
          {!isClosed && <CloseOrderButton shortId={shortId} />}
        </div>
      </div>

      {/* Menu image */}
      {data.restaurantMenuUrl && (
        <div className="rounded-lg border overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.restaurantMenuUrl}
            alt={`${data.restaurantName} menu`}
            className="max-h-96 w-full object-contain"
          />
        </div>
      )}

      <Separator />

      {/* Current orders */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Current orders{" "}
            <span className="text-muted-foreground font-normal">
              ({data.entries.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummaryTable
            entries={data.entries}
            totalOwed={data.totalOwed}
            payerName={data.payerName}
          />
        </CardContent>
      </Card>

      {/* Add order form */}
      {!isClosed && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add your order</CardTitle>
          </CardHeader>
          <CardContent>
            <JoinOrderForm shortId={shortId} />
          </CardContent>
        </Card>
      )}

      {isClosed && (
        <div className="rounded-lg border border-muted bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
          This order is closed. No more items can be added.
        </div>
      )}
    </div>
  );
}
