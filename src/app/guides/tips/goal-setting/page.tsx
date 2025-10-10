import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function GoalSettingStrategiesGuide() {
  return (
    <GuideLayout
      title="Goal Setting Strategies"
      description="Smart strategies for creating and achieving financial goals"
    >
      <GuideStep stepNumber={1} title="Use SMART Goals">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Make goals Specific, Measurable, Achievable, Relevant, and Time-bound:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">❌ Vague:</strong> &ldquo;Save
              money for vacation&rdquo;
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">✅ SMART:</strong> &ldquo;Save
              $3,000 for Hawaii trip by June 30, 2026&rdquo;
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Use the target amount and target date fields to make your goals
          specific and measurable
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Prioritize Your Goals">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the priority dropdown to rank goals:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">High:</strong> Emergency fund,
            debt payoff, essential purchases
          </li>
          <li>
            <strong className="text-foreground">Medium:</strong> Home down
            payment, car replacement, major repairs
          </li>
          <li>
            <strong className="text-foreground">Low:</strong> Vacation, luxury
            purchases, want-based items
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Focus contributions on high-priority goals first, then medium, then
          low
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Start with Emergency Fund">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Your first goal should always be an emergency fund:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Aim for 3-6 months of essential expenses</li>
          <li>
            Set as <strong className="text-foreground">High</strong> priority
          </li>
          <li>Make regular monthly contributions</li>
          <li>Don&apos;t touch it unless true emergency</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Example: $15,000 emergency fund (6 months × $2,500 monthly expenses)
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Break Large Goals into Milestones">
        <p className="text-muted-foreground leading-relaxed mb-3">
          For big goals ($10,000+), create milestone sub-goals:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>$50,000 house down payment = Five $10,000 goals</li>
          <li>Each milestone feels more achievable</li>
          <li>Celebrate progress at each milestone</li>
          <li>Adjust strategy if milestones take longer than expected</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={5} title="Contribute Regularly">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Consistency matters more than contribution size:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Set up automatic contributions on payday</li>
          <li>Use the Make Contribution feature after each paycheck</li>
          <li>Even small amounts add up ($50/month = $600/year)</li>
          <li>Track progress with the progress bars on Goals page</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Regular $200/month contributions = $2,400/year toward goals
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Review Progress Monthly">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Check your goals page at the start of each month:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>See how much progress you made last month</li>
          <li>Adjust target dates if you&apos;re ahead or behind schedule</li>
          <li>Increase contributions if you got a raise or bonus</li>
          <li>Delete goals that are no longer relevant</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={7} title="Celebrate Achievements">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When you achieve a goal:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            The progress bar turns green and shows &ldquo;🎉 Goal
            Achieved!&rdquo;
          </li>
          <li>Take a moment to celebrate your discipline and success</li>
          <li>Consider a small reward (within budget!)</li>
          <li>Create a new goal to maintain momentum</li>
          <li>Delete the achieved goal or keep it as a record</li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
