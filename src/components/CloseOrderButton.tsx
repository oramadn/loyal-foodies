"use client";

import { useActionState, useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { closeOrder } from "@/actions/order";
import type { ActionState } from "@/types";
import { cn } from "@/lib/utils";

type CostRow = { name: string; amount: string };

export function CloseOrderButton({ shortId }: { shortId: string }) {
  const [open, setOpen] = useState(false);
  const [costs, setCosts] = useState<CostRow[]>([{ name: "", amount: "" }]);
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    closeOrder,
    null
  );

  function addCost() { setCosts((c) => [...c, { name: "", amount: "" }]); }
  function removeCost(i: number) { setCosts((c) => c.filter((_, idx) => idx !== i)); }
  function updateCost(i: number, field: keyof CostRow, value: string) {
    setCosts((c) => c.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
      >
        Close order
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close this order</DialogTitle>
          </DialogHeader>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="shortId" value={shortId} />

            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Add any shared costs to split equally among all participants.
              </p>

              <div className="space-y-2">
                {costs.map((row, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      name="costName"
                      placeholder="e.g. Delivery fee"
                      value={row.name}
                      onChange={(e) => updateCost(i, "name", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <Input
                        name="costAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(e) => updateCost(i, "amount", e.target.value)}
                        className="w-24"
                      />
                      <Label className="text-muted-foreground text-sm whitespace-nowrap">JOD</Label>
                    </div>
                    {costs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCost(i)}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8 shrink-0 text-muted-foreground")}
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addCost}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-2 text-muted-foreground")}
              >
                <PlusIcon className="size-3.5 mr-1" />
                Add another cost
              </button>
            </div>

            {state?.errors?._ && (
              <p className="text-destructive text-xs">{state.errors._}</p>
            )}

            <DialogFooter showCloseButton={false}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Cancel
              </button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Closing…" : "Close order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
