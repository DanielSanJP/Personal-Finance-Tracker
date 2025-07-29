import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentUserGoals, formatCurrency } from "@/lib/data";

export default function GoalsPage() {
  const goals = getCurrentUserGoals();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Savings Goals
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {goals.map((goal, index) => {
              return (
                <div key={goal.id}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">{goal.name}</span>
                      <span className="text-base text-gray-600">
                        {formatCurrency(goal.currentAmount)} /{" "}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="h-2 rounded-full transition-all bg-gray-900 w-1/4" />
                    </div>

                    <div className="text-sm text-gray-600">
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  </div>

                  {index < goals.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold cursor-pointer">
                  Add New Goal
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base font-semibold border-gray-300 bg-white text-black hover:bg-gray-50 cursor-pointer"
                >
                  Make Contribution
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base font-semibold border-gray-300 cursor-pointer"
                >
                  Edit Goals
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
