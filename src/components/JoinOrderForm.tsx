"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEntry } from "@/actions/entry";
import type { ActionState, OrderItem } from "@/types";

export function JoinOrderForm({ shortId }: { shortId: string }) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    addEntry,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const itemInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<OrderItem[]>([]);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Your order was added!");
      formRef.current?.reset();
      setItems([]);
      setInputVal("");
    }
    if (state?.errors?._) {
      toast.error(state.errors._);
    }
  }, [state]);

  function addItem() {
    const name = inputVal.trim();
    if (!name) return;
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (existing >= 0) {
        return prev.map((i, idx) =>
          idx === existing ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { name, qty: 1 }];
    });
    setInputVal("");
    itemInputRef.current?.focus();
  }

  function changeQty(index: number, delta: number) {
    setItems((prev) => {
      const next = prev[index].qty + delta;
      if (next <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((i, idx) => (idx === index ? { ...i, qty: next } : i));
    });
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const itemsJson = items.length > 0 ? JSON.stringify(items) : "";

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="shortId" value={shortId} />
      <input type="hidden" name="items" value={itemsJson} />

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
          <div className="flex items-center gap-2">
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 45.00"
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground shrink-0">JOD</span>
          </div>
          {state?.errors?.amount && (
            <p className="text-destructive text-xs">{state.errors.amount}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Your items</Label>

        <div className="flex gap-2">
          <Input
            ref={itemInputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="e.g. Half Chicken"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            disabled={!inputVal.trim()}
          >
            <PlusIcon className="size-4" />
            Add
          </Button>
        </div>

        {items.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1.5"
              >
                <span className="flex-1 text-sm">{item.name}</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => changeQty(i, -1)}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="size-3" />
                  </Button>
                  <span className="w-5 text-center text-sm tabular-nums">{item.qty}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => changeQty(i, 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="size-3" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(i)}
                  aria-label="Remove item"
                >
                  <XIcon className="size-3" />
                </Button>
              </li>
            ))}
          </ul>
        )}

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
