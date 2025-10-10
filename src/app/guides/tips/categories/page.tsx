import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function UsingCategoriesEffectivelyGuide() {
  return (
    <GuideLayout
      title="Using Categories Effectively"
      description="Tips for choosing and using expense categories to maximize insights"
    >
      <GuideStep stepNumber={1} title="Understand Available Categories">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The app provides 11 expense categories:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 text-sm">
          <li>
            <strong className="text-foreground">Food & Dining:</strong>{" "}
            Restaurants, takeout, groceries
          </li>
          <li>
            <strong className="text-foreground">Transportation:</strong> Gas,
            parking, public transit, car maintenance
          </li>
          <li>
            <strong className="text-foreground">Shopping:</strong> Clothing,
            electronics, household items
          </li>
          <li>
            <strong className="text-foreground">Entertainment:</strong> Movies,
            concerts, hobbies, streaming services
          </li>
          <li>
            <strong className="text-foreground">Bills & Utilities:</strong>{" "}
            Rent, electricity, water, internet, phone
          </li>
          <li>
            <strong className="text-foreground">Health & Fitness:</strong> Gym,
            doctor visits, medications
          </li>
          <li>
            <strong className="text-foreground">Travel:</strong> Flights,
            hotels, vacation expenses
          </li>
          <li>
            <strong className="text-foreground">Education:</strong> Courses,
            books, tuition
          </li>
          <li>
            <strong className="text-foreground">Personal Care:</strong>{" "}
            Haircuts, spa, cosmetics
          </li>
          <li>
            <strong className="text-foreground">Housing:</strong> Mortgage,
            property tax, home repairs
          </li>
          <li>
            <strong className="text-foreground">Other:</strong> Anything that
            doesn&apos;t fit above
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={2} title="Be Consistent">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the same category for similar transactions:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Always put Starbucks in{" "}
            <strong className="text-foreground">Food & Dining</strong>
          </li>
          <li>
            Always put gym membership in{" "}
            <strong className="text-foreground">Health & Fitness</strong>
          </li>
          <li>Don&apos;t switch categories month-to-month for same expense</li>
          <li>Consistency makes reports and trends meaningful</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={3} title="Split Multi-Category Purchases">
        <p className="text-muted-foreground leading-relaxed mb-3">
          For purchases that span categories (like Target trips):
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Create separate transactions for each category</li>
          <li>$50 Target trip = $30 Groceries + $20 Shopping</li>
          <li>More accurate than putting entire amount in one category</li>
          <li>Helps budget tracking and spending analysis</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={4} title="Food & Dining: When to Use">
        <p className="text-muted-foreground leading-relaxed mb-3">
          This is usually the largest category. Include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Grocery store purchases</li>
          <li>Restaurants and takeout</li>
          <li>Coffee shops and cafes</li>
          <li>Food delivery services</li>
          <li>Snacks and drinks from convenience stores</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Consider separating groceries from dining out using notes if you want
          that detail
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Bills vs Shopping vs Housing">
        <p className="text-muted-foreground leading-relaxed mb-3">
          These categories can overlap - here&apos;s how to decide:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">Bills & Utilities:</strong>{" "}
              Recurring services (electricity, water, internet, phone)
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">Shopping:</strong> One-time
              purchases of goods (clothes, electronics, furniture)
            </p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">Housing:</strong>{" "}
              Home-specific (mortgage, repairs, property tax, HOA fees)
            </p>
          </div>
        </div>
      </GuideStep>

      <GuideStep stepNumber={6} title="Minimize Use of Other">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The <strong className="text-foreground">Other</strong> category should
          be your smallest:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Only use when nothing else truly fits</li>
          <li>
            If Other becomes large, you&apos;re missing a common expense type
          </li>
          <li>Review Other transactions monthly to identify patterns</li>
          <li>Consider if the expense actually fits another category</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Goal: Keep Other under 5% of total spending
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Use Categories for Budgets">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Categories power your budget system:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Create budgets for your highest-spending categories first</li>
          <li>Check the pie chart to see which categories need budgets</li>
          <li>
            Budget alerts only work if transactions are correctly categorized
          </li>
          <li>Accurate categories = accurate budget tracking</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={8} title="Review Category Distribution">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the Category Spending Breakdown pie chart monthly:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Check if any category dominates (&gt;40% of spending)</li>
          <li>
            Look for surprisingly large categories - might indicate
            miscategorization
          </li>
          <li>Compare month-to-month to spot category trends</li>
          <li>Ensure distribution aligns with your priorities and values</li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
