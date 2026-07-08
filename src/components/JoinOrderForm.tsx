"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addEntry } from "@/actions/entry";
import type { ActionState } from "@/types";

export function JoinOrderForm({ shortId }: { shortId: string }) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    addEntry,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Your order was added!");
      formRef.current?.reset();
    }
    if (state?.errors?._) {
      toast.error(state.errors._);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="shortId" value={shortId} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Omar"
            autoComplete="name"
          />
          {state?.errors?.name && (
            <p className="text-destructive text-xs">{state.errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount">
            Amount you owe{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 45.00"
          />
          {state?.errors?.amount && (
            <p className="text-destructive text-xs">{state.errors.amount}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="items">Your items</Label>
        <Textarea
          id="items"
          name="items"
          placeholder="e.g. Chicken Biryani + Mango Lassi"
          rows={2}
        />
        {state?.errors?.items && (
          <p className="text-destructive text-xs">{state.errors.items}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Adding..." : "Add my order"}
      </Button>
    </form>
  );
}
