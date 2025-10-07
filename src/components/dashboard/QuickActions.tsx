"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 pb-4 justify-center [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center">
          <Button asChild className="min-w-[140px]">
            <Link href="/income/add">Add Income</Link>
          </Button>
          <Button asChild className="min-w-[140px]">
            <Link href="/transactions/add">Add Expense</Link>
          </Button>
          <Button asChild variant="outline" className="min-w-[140px]">
            <Link href="/transactions/add?scan=true">Scan Receipt</Link>
          </Button>
          <Button asChild variant="outline" className="min-w-[140px]">
            <Link href="/reports">View Reports</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
