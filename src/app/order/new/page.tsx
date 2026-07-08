import Link from "next/link";
import { prisma } from "@/lib/db";
import { CreateOrderForm } from "@/components/CreateOrderForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ restaurantId?: string }>;
};

export default async function NewOrderPage({ searchParams }: Props) {
  const { restaurantId } = await searchParams;

  const [restaurants, preselected] = await Promise.all([
    prisma.restaurant.findMany({ orderBy: { name: "asc" } }),
    restaurantId
      ? prisma.restaurant.findUnique({ where: { id: restaurantId } })
      : null,
  ]);

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-2 inline-flex")}
        >
          <ArrowLeftIcon className="size-4 mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">Start a new order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details and share the link in #loyal-foodies.
        </p>
      </div>

      <CreateOrderForm restaurants={restaurants} preselected={preselected} />
    </main>
  );
}
