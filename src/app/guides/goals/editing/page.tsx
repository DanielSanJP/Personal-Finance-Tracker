import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function EditingGoalsPage() {
  return (
    <GuideLayout
      title="Editing Goals"
      description="Learn how to update your goal details, amounts, and target dates"
    >
      <GuideStep
        stepNumber={1}
        title="Open the Goals Page"
        image="/guides/goals/goals2.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Navigate to the <strong className="text-foreground">Goals</strong>{" "}
          page from the main navigation menu. You&apos;ll see all your savings
          goals displayed with their current progress.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Click Edit Goals"
        image="/guides/goals/goaledit.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          In the <strong className="text-foreground">Quick Actions</strong>{" "}
          card, click the{" "}
          <strong className="text-foreground">Edit Goals</strong> button. This
          opens a dialog showing all your goals in one place for easy editing.
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="View All Your Goals">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The dialog displays all your goals in a scrollable list. For each
          goal, you can edit:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Goal name</li>
          <li>Target amount</li>
          <li>Current amount</li>
          <li>Target date</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You can edit multiple goals at once without opening separate dialogs
          for each one. A trash icon in the top-right corner of each goal allows
          you to delete it.
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Update Goal Name">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To change a goal&apos;s name:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>Find the goal you want to rename</li>
          <li>
            Click in the <strong className="text-foreground">Goal Name</strong>{" "}
            field
          </li>
          <li>Clear the existing name and type a new one</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Rename goals when your priorities change or you want a more motivating
          name. For example, changing &quot;Car Fund&quot; to &quot;Red Tesla
          Model 3&quot; might be more inspiring!
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Adjust Target Amount">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To change your target amount:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>Locate the goal to modify</li>
          <li>
            Click in the{" "}
            <strong className="text-foreground">Target Amount</strong> field
          </li>
          <li>Enter the new target amount</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Increase the target if your goal has grown (car prices went up), or
          decrease it if you realized you don&apos;t need as much. The progress
          percentage will recalculate automatically based on the new target.
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Update Current Amount">
        <p className="text-muted-foreground leading-relaxed mb-3">
          You can directly edit the current savings amount:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>Find the goal you want to adjust</li>
          <li>
            Click in the{" "}
            <strong className="text-foreground">Current Amount</strong> field
          </li>
          <li>Enter the new current amount</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This is useful if you moved money from outside the app into your goal,
          or if you need to make a correction. Note: Using &quot;Make
          Contribution&quot; is the proper way to add money as it also deducts
          from your account.
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Change Target Date">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To update when you want to achieve this goal:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>Find the goal to modify</li>
          <li>
            Click the <strong className="text-foreground">Target Date</strong>{" "}
            field to open the calendar picker
          </li>
          <li>Select a new target date</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Adjust your deadline if your timeline has changed - push it back if
          you need more time, or move it up if you&apos;re progressing faster
          than expected.
        </p>
      </GuideStep>

      <GuideStep stepNumber={8} title="Delete a Goal (Optional)">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To remove a goal entirely:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            Click the <strong className="text-foreground">trash icon</strong> in
            the top-right corner of the goal
          </li>
          <li>A confirmation dialog will appear</li>
          <li>
            Click <strong className="text-foreground">Delete Goal</strong> to
            confirm
          </li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Delete goals that are no longer relevant or that you&apos;ve completed
          and withdrawn the funds from. Deleted goals cannot be recovered.
        </p>
      </GuideStep>

      <GuideStep stepNumber={9} title="Save All Changes">
        <p className="text-muted-foreground leading-relaxed mb-3">
          After making all your edits, click{" "}
          <strong className="text-foreground">Save All Changes</strong> at the
          bottom of the dialog. This will:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Update all modified goals at once</li>
          <li>Recalculate progress percentages</li>
          <li>Update all progress bars</li>
          <li>Check if any goals are now achieved</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You&apos;ll see a success message confirming all your changes were
          saved.
        </p>
      </GuideStep>

      <div className="mt-8 space-y-4">
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">
            When to Edit Your Goals
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • <strong>Priorities changed</strong> - Shift focus by adjusting
              target amounts or dates
            </li>
            <li>
              • <strong>Progress is too slow</strong> - Lower the target or
              extend the deadline to stay motivated
            </li>
            <li>
              • <strong>Costs increased</strong> - Raise your target amount to
              match new prices
            </li>
            <li>
              • <strong>Goal achieved</strong> - Increase the target if you want
              to save more for the same purpose
            </li>
          </ul>
        </div>

        <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Important Note</h3>
          <p className="text-sm text-foreground">
            Editing the current amount directly doesn&apos;t affect your account
            balances. If you&apos;re adding money you actually have, use
            &quot;Make Contribution&quot; instead to properly deduct from your
            account and maintain accurate financial tracking.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
