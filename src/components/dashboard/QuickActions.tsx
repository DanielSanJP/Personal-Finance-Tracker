"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function QuickActions() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pb-4 flex flex-wrap gap-2 justify-center border-b">
          <Link href="/income/add">
            <Button>Add Income</Button>
          </Link>
          <Link href="/transactions/add">
            <Button>Add Expense</Button>
          </Link>
          <Link href="/transactions/add?scan=true">
            <Button variant="outline">Scan Receipt</Button>
          </Link>
          <Link href="/reports">
            <Button variant="outline">View Reports</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
