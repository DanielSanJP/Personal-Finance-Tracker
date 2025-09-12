import Nav from "@/components/nav";
import IncomeForm from "@/components/forms/IncomeForm";

export default function AddIncomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <IncomeForm />
      </div>
    </div>
  );
}
