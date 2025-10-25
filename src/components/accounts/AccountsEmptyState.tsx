import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AccountsEmptyState() {
  const router = useRouter();

  const handleAddAccount = () => {
    router.push("/accounts/add");
  };

  return (
    <Card>
      <CardContent className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">
          No accounts found
        </h3>
        <p className="text-muted-foreground mb-4">
          Get started by adding your first account.
        </p>
        <Button onClick={handleAddAccount}>Add Your First Account</Button>
      </CardContent>
    </Card>
  );
}
