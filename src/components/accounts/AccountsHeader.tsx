import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AccountsHeader() {
  const router = useRouter();

  const handleAddAccount = () => {
    router.push("/accounts/add");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-foreground">My Accounts</h1>
      <Button variant="default" onClick={handleAddAccount}>
        Add Account
      </Button>
    </div>
  );
}
