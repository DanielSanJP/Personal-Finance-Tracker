import Nav from "@/components/nav";
import TransactionForm from "@/components/forms/TransactionForm";

export default function AddTransactionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <TransactionForm />
      </div>
    </div>
  );
}