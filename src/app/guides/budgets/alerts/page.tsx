import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BudgetAlertsPage() {
  return (
    <GuideLayout
      title="Budget Alerts"
      description="Stay informed when you're approaching or exceeding your budget limits"
    >
      <GuideStep stepNumber={1} title="Understanding Budget Alerts">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Budget alerts help you stay aware of your spending status. The system
          uses visual indicators and alert messages to warn you when you&apos;re
          getting close to or exceeding your budget limits.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          These alerts appear automatically on the budgets page as you add
          transactions throughout the month - you don&apos;t need to set up or
          configure anything.
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Progress Bar Color Warnings">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Each budget has a progress bar that changes color based on how much
          you&apos;ve spent:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-gray-900 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Dark Gray - Safe Zone (Under 80%)
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;re well within your budget. No action needed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-orange-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Orange - Warning Zone (80-99%)
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;re approaching your limit. Be careful with additional
                spending in this category.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Red - Over Budget (100%+)
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;ve exceeded your budget limit for this category.
              </p>
            </div>
          </div>
        </div>
      </GuideStep>

      <GuideStep stepNumber={3} title="Top Alert Banner">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When any of your budgets go over their limit, a red alert banner
          appears at the top of your budget list:
        </p>
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have categories that are over budget this month.
          </AlertDescription>
        </Alert>
        <p className="text-muted-foreground leading-relaxed">
          This banner only appears when you have at least one over-budget
          category. It provides a quick visual warning that some budgets need
          your attention.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={4}
        title="Individual Budget Over-Spending Messages"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Below each over-budget category, you&apos;ll see exactly how much
          you&apos;ve overspent:
        </p>
        <div className="my-4 p-3 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-600 font-medium">
            Over budget by $33.07
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          This message appears directly under the progress bar for any budget
          where spending exceeds the limit. It shows the exact dollar amount
          you&apos;re over, making it easy to understand how much to cut back.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="What to Do When You See an Alert">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you see a budget alert, you have several options:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Reduce spending</strong> - Stop
            or limit spending in that category for the rest of the budget period
          </li>
          <li>
            <strong className="text-foreground">Review transactions</strong> -
            Check if there are any mistakes or unnecessary expenses you can
            return
          </li>
          <li>
            <strong className="text-foreground">Adjust the budget</strong> - If
            the alert is due to an unrealistic budget amount, edit the budget to
            a more appropriate level
          </li>
          <li>
            <strong className="text-foreground">
              Move money from another budget
            </strong>{" "}
            - If you have leftover budget in other categories, you might choose
            to mentally reallocate those funds
          </li>
          <li>
            <strong className="text-foreground">Accept it and move on</strong> -
            Sometimes overspending happens. Learn from it and do better next
            period.
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={6} title="Approaching Budget Warnings">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The orange progress bar (80-100%) serves as an early warning system
          before you actually go over budget. This gives you time to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Slow down spending in that category</li>
          <li>Find cheaper alternatives for remaining purchases</li>
          <li>Postpone non-essential expenses until next period</li>
          <li>
            Decide if it&apos;s worth going over for this specific expense
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Pay attention to orange progress bars - they&apos;re your chance to
          stay under budget with some quick adjustments.
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Multiple Budget Alerts">
        <p className="text-muted-foreground leading-relaxed mb-3">
          If you see alerts on multiple budgets at once, prioritize your
          response:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">
              Focus on red (over budget) categories first
            </strong>{" "}
            - These need immediate attention
          </li>
          <li>
            <strong className="text-foreground">
              Then address orange (80-100%) categories
            </strong>{" "}
            - Prevent them from going red
          </li>
          <li>
            <strong className="text-foreground">
              Review your overall spending patterns
            </strong>{" "}
            - Multiple alerts might indicate your total budget is unrealistic
          </li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          If you consistently see multiple alerts, consider adjusting your
          budgets or finding ways to increase your income.
        </p>
      </GuideStep>

      <div className="mt-8 space-y-4">
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Check your budgets weekly instead of waiting until the end of the
            month. This gives you multiple opportunities to course-correct
            before alerts appear.
          </p>
          <p className="text-sm text-muted-foreground">
            Set a recurring calendar reminder every Monday morning to review
            your budget progress. This takes just 2-3 minutes and can save you
            from overspending.
          </p>
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">Remember</h3>
          <p className="text-sm text-amber-800">
            Budget alerts are tools to help you, not criticisms. Going over
            budget occasionally is normal. The important thing is to be aware of
            it, understand why it happened, and make adjustments for the future.
            Progress, not perfection!
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
