"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IncomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the add income page since that's the only income functionality
    router.replace("/transactions");
  }, [router]);

  // Return null or a loading state since we're redirecting
  return null;
}
