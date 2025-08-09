import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function ErrorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const message =
    params.message || "An unexpected error occurred. Please try again.";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="mb-4 text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-2">
          <Link href="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 px-4 py-2 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
