"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2Icon, ExternalLinkIcon, PlusIcon } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { createRestaurant, deleteRestaurant } from "@/actions/restaurant";
import type { ActionState, Restaurant } from "@/types";
import { cn } from "@/lib/utils";

export function RestaurantList({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter();
  const [menuUrls, setMenuUrls] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    createRestaurant,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Restaurant saved!");
      setMenuUrls([]);
    }
    if (state?.errors?._) {
      toast.error(state.errors._);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      {/* Add form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PlusIcon className="size-4" />
            Add restaurant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {menuUrls.map((url) => (
              <input key={url} type="hidden" name="menuUrls" value={url} />
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="e.g. Shawarma Palace" required />
                {state?.errors?.name && (
                  <p className="text-destructive text-xs">{state.errors.name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="note">
                  Note{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input id="note" name="note" placeholder="e.g. No substitutions" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>
                Menu images{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <ImageUploader values={menuUrls} onChange={setMenuUrls} />
            </div>
            <Button type="submit" disabled={isPending} size="sm">
              {isPending ? "Saving…" : "Save restaurant"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      {restaurants.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">
          No saved restaurants yet.
        </p>
      ) : (
        <div className="space-y-2">
          {restaurants.map((r, i) => (
            <div key={r.id}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{r.name}</p>
                  {r.note && (
                    <p className="text-xs text-muted-foreground mt-0.5">{r.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {r.menuUrls[0] && (
                    <a
                      href={r.menuUrls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
                    >
                      <ExternalLinkIcon className="size-3.5" />
                    </a>
                  )}
                  <form
                    action={async () => {
                      await deleteRestaurant(r.id);
                      toast.success(`${r.name} removed`);
                      router.refresh();
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
