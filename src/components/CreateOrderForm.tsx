"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RestaurantPicker } from "@/components/RestaurantPicker";
import { createOrder } from "@/actions/order";
import type { ActionState, Restaurant } from "@/types";

type Props = {
  restaurants: Restaurant[];
  preselected?: Restaurant | null;
};

export function CreateOrderForm({ restaurants, preselected }: Props) {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    createOrder,
    null
  );
  const [restaurantId, setRestaurantId] = useState<string>(preselected?.id ?? "");
  const [restaurantName, setRestaurantName] = useState(preselected?.name ?? "");
  const [menuUrl, setMenuUrl] = useState(preselected?.menuUrl ?? "");
  const [note, setNote] = useState(preselected?.note ?? "");

  function handleRestaurantSelect(r: Restaurant | null) {
    if (r) {
      setRestaurantId(r.id);
      setRestaurantName(r.name);
      setMenuUrl(r.menuUrl ?? "");
      setNote(r.note ?? "");
    } else {
      setRestaurantId("");
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="restaurantId" value={restaurantId} />

      {restaurants.length > 0 && (
        <div className="space-y-3">
          <Label>Pick a saved restaurant</Label>
          <RestaurantPicker
            restaurants={restaurants}
            onSelect={handleRestaurantSelect}
          />
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or fill in manually</span>
            <Separator className="flex-1" />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="restaurantName">Restaurant name</Label>
        <Input
          id="restaurantName"
          name="restaurantName"
          placeholder="e.g. Shawarma Palace"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        {state?.errors?.restaurantName && (
          <p className="text-destructive text-xs">{state.errors.restaurantName}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="restaurantMenuUrl">
          Menu image URL{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="restaurantMenuUrl"
          name="restaurantMenuUrl"
          type="url"
          placeholder="https://…"
          value={menuUrl}
          onChange={(e) => setMenuUrl(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">
          Note{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="note"
          name="note"
          placeholder="e.g. Call ahead — they're slow on Tuesdays"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="payerName">Your name (you&apos;re paying)</Label>
        <Input
          id="payerName"
          name="payerName"
          placeholder="e.g. Omar"
          autoComplete="name"
          required
        />
        {state?.errors?.payerName && (
          <p className="text-destructive text-xs">{state.errors.payerName}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating…" : "Create order & get link"}
      </Button>
    </form>
  );
}
