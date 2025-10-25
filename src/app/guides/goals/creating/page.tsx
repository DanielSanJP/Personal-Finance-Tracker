import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function CreatingGoalPage() {
  return (
    <GuideLayout
      title="Creating a Financial Goal"
      description="Step-by-step guide to setting up your savings goals"
    >
      <GuideStep
        stepNumber={1}
        title="Open the Goals Page"
        image="/guides/goals/goals.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Click on <strong className="text-foreground">Goals</strong> in the
          main navigation menu. This will take you to your savings goals
          overview where you can see all your goals and create new ones.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Click Add New Goal"
        image="/guides/goals/goalform.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          In the <strong className="text-foreground">Quick Actions</strong>{" "}
          card, click the{" "}
          <strong className="text-foreground">Add New Goal</strong> button. This
          opens a dialog where you&apos;ll enter your goal details.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Enter Goal Name"
        image="/guides/goals/goalname.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          In the <strong className="text-foreground">Goal Name</strong> field,
          enter a descriptive name for your goal. Examples:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Emergency Fund</li>
          <li>Vacation to Europe</li>
          <li>New Car Down Payment</li>
          <li>Home Renovation</li>
          <li>Wedding Savings</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Choose a name that motivates you and clearly describes what
          you&apos;re saving for.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={4}
        title="Set Target Amount"
        image="/guides/goals/goalamount.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Enter the total amount you want to save in the{" "}
          <strong className="text-foreground">Target Amount</strong> field. This
          is your final goal. For example, $5,000 for an emergency fund or
          $20,000 for a car down payment. Be realistic but aim high enough to
          make a meaningful difference.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={5}
        title="Add Current Amount (Optional)"
        image="/guides/goals/goalinitialamount.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          If you already have some money saved toward this goal, enter it in the{" "}
          <strong className="text-foreground">Current Amount</strong> field.
          This is optional - you can leave it at $0 if you&apos;re starting from
          scratch.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          For example, if you already have $1,500 saved in a separate account
          for your vacation, enter 1500 to track your starting point.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={6}
        title="Choose Target Date"
        image="/guides/goals/goaldate.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Click the <strong className="text-foreground">Target Date</strong>{" "}
          field to open a calendar picker. Select the date by which you want to
          achieve this goal. The target date:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Must be in the future</li>
          <li>Helps you track if you&apos;re on pace</li>
          <li>Creates a sense of urgency and motivation</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This field is optional, but setting a deadline makes you more likely
          to achieve your goal.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={7}
        title="Select Priority Level"
        image="/guides/goals/goalpriority.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Choose a priority level from the dropdown:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">High Priority</strong> - Goals
            you want to focus on immediately (like emergency fund)
          </li>
          <li>
            <strong className="text-foreground">Medium Priority</strong> -
            Important goals but not urgent (default option)
          </li>
          <li>
            <strong className="text-foreground">Low Priority</strong> - Nice to
            have goals you&apos;ll work on when able
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Priority helps you decide which goal to contribute to when you have
          extra money.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={8}
        title="Create Your Goal"
        image="/guides/goals/goalcreated.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Review all your details and click the{" "}
          <strong className="text-foreground">Create Goal</strong> button. Your
          new goal will appear in your goals list with a progress bar showing
          how much you&apos;ve saved toward your target.
        </p>
      </GuideStep>

      <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
        <p className="text-sm text-muted-foreground">
          Start with 1-3 goals maximum. Too many goals can spread your money too
          thin and make progress feel slow. Focus on your most important goal
          first, then add others as you make progress.
        </p>
      </div>
    </GuideLayout>
  );
}
