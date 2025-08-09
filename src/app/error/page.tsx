import Link from "next/link";

export default function Error() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
        <p className="mb-4">
          There was an error with your login. Please try again.
        </p>
        <Link
          href="/login"
          className="inline-flex h-10 px-4 py-2 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
