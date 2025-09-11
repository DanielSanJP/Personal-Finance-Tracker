"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
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
          <Button
            variant="outline"
            onClick={() =>
              toast("Scan Receipt functionality not implemented yet", {
                description:
                  "This feature will be available in a future update.",
                action: {
                  label: "Dismiss",
                  onClick: () => console.log("Dismissed"),
                },
              })
            }
          >
            Scan Receipt
          </Button>
          <Link href="/reports">
            <Button variant="outline">View Reports</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
