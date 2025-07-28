import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Nav() {
  return (
    <nav className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <Image
                src="/logo.svg"
                alt="Personal Finance Tracker Logo"
                width={64}
                height={64}
                className="h-12 w-12"
              />
              Personal Finance Tracker
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
