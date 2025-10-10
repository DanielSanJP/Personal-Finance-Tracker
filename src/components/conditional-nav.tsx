"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/nav";

export function ConditionalNav() {
  const pathname = usePathname();

  // Hide nav on all guides pages
  if (pathname.startsWith("/guides")) {
    return null;
  }

  return <Nav />;
}
