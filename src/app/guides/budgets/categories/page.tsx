import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function BudgetCategoriesPage() {
  return (
    <GuideLayout
      title="Setting Budget Categories"
      description="Learn how to choose the right categories for your budgets"
    >
      <GuideStep stepNumber={1} title="Understanding Budget Categories">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Budget categories match your expense transaction categories. When you
          create a budget for a category like &quot;Groceries&quot;, the system
          automatically tracks all transactions in that category and shows your
          spending against the budget limit.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          You can only have one budget per category. This keeps your budget
          tracking simple and organized.
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Available Expense Categories">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The category dropdown shows all available expense categories from your
          transaction system. Common categories include:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Food and Dining</strong> - Food
            Shopping, Restaurants and takeout
          </li>
          <li>
            <strong className="text-foreground">Transportation</strong> - Gas,
            public transit, parking
          </li>
          <li>
            <strong className="text-foreground">Bills & Utilities</strong> -
            Rent, electricity, water, internet
          </li>
          <li>
            <strong className="text-foreground">Entertainment</strong> - Movies,
            concerts, hobbies
          </li>
          <li>
            <strong className="text-foreground">Shopping</strong> - Clothing,
            electronics, general purchases
          </li>
          <li>
            <strong className="text-foreground">Healthcare</strong> - Medical
            expenses and prescriptions
          </li>
          <li>
            <strong className="text-foreground">Personal Care</strong> -
            Haircuts, gym, personal items
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={3} title="Selecting a Category">
        <p className="text-muted-foreground leading-relaxed mb-3">
          When creating a budget, click the{" "}
          <strong className="text-foreground">Category</strong> dropdown in the
          budget dialog. The dropdown will only show categories that don&apos;t
          already have an active budget.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          If you don&apos;t see a category you want, it may already have a
          budget. You can edit or delete the existing budget for that category
          if needed.
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Choosing Categories to Budget">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Start with categories where you spend the most or where you want more
          control. Common starting categories include:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Variable expenses</strong> -
            Categories like Groceries, Dining, and Entertainment where spending
            can vary month to month
          </li>
          <li>
            <strong className="text-foreground">Discretionary spending</strong>{" "}
            - Shopping, Entertainment, and Dining where you have control over
            spending
          </li>
          <li>
            <strong className="text-foreground">Problem areas</strong> -
            Categories where you tend to overspend
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Don&apos;t budget every single category. Focus on the 3-5 categories
          that will give you the most benefit.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="One Budget Per Category Rule">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The system prevents duplicate budgets by only allowing one budget per
          category. This means:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            You can&apos;t create two monthly budgets for &quot;Groceries&quot;
          </li>
          <li>
            Categories with existing budgets won&apos;t appear in the create
            dropdown
          </li>
          <li>
            To change a budget category, you need to delete the old budget and
            create a new one
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This keeps your budget system simple and prevents confusion about
          which budget applies to which transactions.
        </p>
      </GuideStep>

      <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
        <p className="text-sm text-muted-foreground">
          Review your transaction history to see which categories you use most
          often. Create budgets for the top 3-5 categories where you spend the
          most money. This gives you the biggest impact with minimal effort.
        </p>
      </div>
    </GuideLayout>
  );
}
