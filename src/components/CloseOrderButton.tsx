"use client";

import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { closeOrder } from "@/actions/order";
import { cn } from "@/lib/utils";

export function CloseOrderButton({ shortId }: { shortId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClose() {
    startTransition(async () => {
      await closeOrder(shortId);
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
        disabled={isPending}
      >
        {isPending ? "Closing..." : "Close order"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close this order?</AlertDialogTitle>
          <AlertDialogDescription>
            No one will be able to add more items. The order summary will be
            preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClose}>
            Yes, close it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
