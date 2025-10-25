import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function CompletingGoalsPage() {
  return (
    <GuideLayout
      title="Completing Goals"
      description="What happens when you reach your savings target and what to do next"
    >
      <GuideStep stepNumber={1} title="Recognizing Goal Achievement">
        <p className="text-muted-foreground leading-relaxed mb-3">
          You&apos;ve reached your goal when your current amount equals or
          exceeds your target amount. When this happens, you&apos;ll see:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            Progress bar turns{" "}
            <strong className="text-foreground">green</strong>
          </li>
          <li>
            Progress bar fills to 100% (or beyond if you exceeded the target)
          </li>
          <li>
            A <strong className="text-foreground">ðŸŽ‰ Goal Achieved!</strong>{" "}
            message appears below the progress bar
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This is your moment to celebrate - you&apos;ve successfully reached
          your savings target!
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Deciding What to Do Next">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Once you reach a goal, you have several options:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Use the money</strong> - If you
            saved for a specific purpose (vacation, car), it&apos;s time to make
            that purchase!
          </li>
          <li>
            <strong className="text-foreground">Keep saving</strong> - You can
            continue adding to the goal for extra cushion or reach a higher
            amount
          </li>
          <li>
            <strong className="text-foreground">Increase the target</strong> -
            Edit the goal to set a new, higher target if your needs changed
          </li>
          <li>
            <strong className="text-foreground">Delete the goal</strong> - Once
            the money is spent or transferred out, remove the goal
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={3} title="Using Your Saved Money">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you&apos;re ready to use the money you&apos;ve saved:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Make your purchase or transfer the funds from the account where you
            contributed the money
          </li>
          <li>
            Update your transaction records to reflect the spending (if it stays
            in your tracked accounts)
          </li>
          <li>
            Go to <strong className="text-foreground">Edit Goals</strong> and
            adjust the current amount to $0 (if you spent it all)
          </li>
          <li>Or delete the goal entirely if you no longer need to track it</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          The goal itself doesn&apos;t automatically deduct from your accounts -
          it&apos;s a tracking tool. You manage the actual spending separately.
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Exceeding Your Goal">
        <p className="text-muted-foreground leading-relaxed mb-3">
          If you saved more than your target (for example, $5,500 when your
          target was $5,000):
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>The progress bar will show over 100% completion</li>
          <li>The green color remains, confirming goal achievement</li>
          <li>
            You&apos;ll see amounts like &quot;$5,500 / $5,000&quot; showing you
            exceeded the target
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This extra buffer is great! Use it to cover unexpected costs, save for
          a related purpose, or reallocate to another goal.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Deleting a Completed Goal">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To remove a completed goal:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            Go to the <strong className="text-foreground">Goals</strong> page
          </li>
          <li>
            Click <strong className="text-foreground">Edit Goals</strong> in
            Quick Actions
          </li>
          <li>
            Find the completed goal and click the{" "}
            <strong className="text-foreground">trash icon</strong>
          </li>
          <li>Confirm the deletion</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Delete goals that you&apos;ve fully spent or that are no longer
          relevant to keep your goals list focused on active targets.
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Starting a New Goal">
        <p className="text-muted-foreground leading-relaxed mb-3">
          After completing a goal, you might want to start a new one:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Related goal</strong> - If you
            saved for a car down payment, now save for insurance and maintenance
          </li>
          <li>
            <strong className="text-foreground">Next priority</strong> - Move to
            your second-highest priority goal
          </li>
          <li>
            <strong className="text-foreground">Bigger target</strong> - Set an
            even more ambitious goal now that you&apos;ve proven you can save
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Successfully completing goals builds confidence and momentum. Use this
          motivation to tackle your next financial milestone!
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Continuing Beyond Your Goal">
        <p className="text-muted-foreground leading-relaxed mb-3">
          You don&apos;t have to stop saving just because you reached your
          target. You can:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Keep making contributions to the same goal for extra security</li>
          <li>
            Edit the goal to increase the target amount to a new milestone
          </li>
          <li>
            Leave the goal as &quot;achieved&quot; while you decide what to do
            with the money
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          For goals like emergency funds, it&apos;s common to keep contributing
          even after reaching your initial target to build a larger safety net.
        </p>
      </GuideStep>

      <div className="mt-8 space-y-4">
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">
            Celebrate Your Success!
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Completing a savings goal is a significant achievement. Take a
            moment to acknowledge your discipline and hard work. Whether you
            reached a $500 goal or a $50,000 goal, you demonstrated the ability
            to set a target and achieve it.
          </p>
          <p className="text-sm text-muted-foreground">
            Share your success with family or friends who supported you, or
            treat yourself to something small (that won&apos;t derail your other
            goals) as a reward for your financial discipline.
          </p>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            Keep the Momentum Going
          </h3>
          <p className="text-sm text-green-800">
            The habits you built while saving for this goal - budgeting,
            consistent contributions, tracking progress - are valuable skills.
            Apply them to your next goal immediately to maintain your savings
            momentum. The second goal is often easier because you already know
            you can do it!
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
