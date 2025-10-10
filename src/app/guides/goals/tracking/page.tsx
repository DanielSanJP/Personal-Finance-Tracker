import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function TrackingGoalProgressPage() {
  return (
    <GuideLayout
      title="Tracking Goal Progress"
      description="Monitor your savings progress and stay motivated toward your goals"
    >
      <GuideStep stepNumber={1} title="View Your Goals List">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Navigate to the <strong className="text-foreground">Goals</strong>{" "}
          page to see all your active savings goals. Each goal is displayed as a
          card showing:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Goal name</li>
          <li>Current amount saved</li>
          <li>Target amount</li>
          <li>Visual progress bar</li>
          <li>Target date (if set)</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={2} title="Understanding Progress Bars">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Each goal has a horizontal progress bar that fills up as you save
          money. The progress bar uses a simple color system:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-gray-900 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Dark Gray - In Progress
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;re actively saving toward this goal but haven&apos;t
                reached the target yet.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Green - Goal Achieved!
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;ve reached or exceeded your target amount.
                Congratulations!
              </p>
            </div>
          </div>
        </div>
      </GuideStep>

      <GuideStep stepNumber={3} title="Reading Progress Details">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Above each progress bar, you&apos;ll see your progress displayed as:
        </p>
        <div className="space-y-2 text-muted-foreground ml-4">
          <p>
            <strong className="text-foreground">$2,500 / $5,000</strong> - Shows
            your current savings ($2,500) out of your target amount ($5,000)
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This amount updates immediately every time you make a contribution to
          the goal. The progress bar visually represents this percentage by
          filling from left to right.
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Target Date Tracking">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Below the progress bar, you&apos;ll see your target date displayed. If
          you set a deadline when creating the goal, it will show:
        </p>
        <div className="space-y-1 text-muted-foreground ml-4">
          <p>
            <strong className="text-foreground">Target: Jun 15, 2026</strong> -
            Your goal deadline
          </p>
          <p>
            <strong className="text-foreground">Target: No target date</strong>{" "}
            - If you didn&apos;t set a deadline
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Use this to gauge if you&apos;re on track. For example, if your target
          is 6 months away and you&apos;re only at 25%, you may need to increase
          your contributions.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Goal Achievement Indicator">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you reach or exceed your target amount, you&apos;ll see a special
          achievement message:
        </p>
        <div className="my-4 p-3 border border-green-200 rounded-lg bg-green-50">
          <p className="text-sm text-green-600 font-medium">
            🎉 Goal Achieved!
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          This appears below the progress bar along with the green progress bar
          color change. It&apos;s your cue to celebrate - you reached your goal!
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Automatic Updates">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Your goal progress updates automatically when you:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Make a contribution through the Make Contribution dialog</li>
          <li>Edit the current amount directly in the Edit Goals dialog</li>
          <li>Change the target amount (progress percentage recalculates)</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You don&apos;t need to manually refresh or update anything - the
          system handles all calculations and visual updates for you.
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Multiple Goals Comparison">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you have multiple goals, you can easily compare their progress at
          a glance:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Progress bars</strong> - Quickly
            see which goals are closer to completion
          </li>
          <li>
            <strong className="text-foreground">Dollar amounts</strong> -
            Compare how much you&apos;ve saved for each goal
          </li>
          <li>
            <strong className="text-foreground">Target dates</strong> - See
            which goals have approaching deadlines
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Use this overview to decide which goal deserves your next
          contribution, especially if you have limited funds to allocate.
        </p>
      </GuideStep>

      <div className="mt-8 space-y-4">
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Check your goals progress weekly to stay motivated. Seeing the
            progress bar fill up, even by a small amount, reinforces positive
            saving habits and keeps you focused on your targets.
          </p>
          <p className="text-sm text-muted-foreground">
            If progress feels too slow, consider breaking a large goal into
            smaller milestones. For example, split a $10,000 car fund into two
            $5,000 goals to celebrate achievements more frequently.
          </p>
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">Stay Realistic</h3>
          <p className="text-sm text-amber-800">
            If you&apos;re consistently falling behind your target date,
            don&apos;t get discouraged. Either adjust your target date to be
            more realistic, increase your monthly contributions if possible, or
            reduce the target amount. Progress is progress, no matter the pace!
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
