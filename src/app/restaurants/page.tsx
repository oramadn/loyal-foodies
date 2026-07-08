import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RestaurantList } from "@/components/RestaurantList";

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-2 inline-flex")}
        >
          <ArrowLeftIcon className="size-4 mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold">Saved restaurants</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Save your regulars so you can start orders faster.
        </p>
      </div>

      <RestaurantList restaurants={restaurants} />
    </main>
  );
}
