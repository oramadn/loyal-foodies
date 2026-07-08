import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="max-w-sm mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        That order doesn&apos;t exist or may have been removed.
      </p>
      <Link href="/" className={buttonVariants()}>
        Go home
      </Link>
    </main>
  );
}
