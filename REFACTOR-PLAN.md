# 🎯 Personal Finance Tracker - Transaction System Refactor Plan

## 📊 Current Problems

### 1. **Database Schema Issue**

The `merchant` column only makes sense for expenses:

- ✅ **Expense**: "BP Petrol", "McDonald's", "Starbucks" ← Makes sense
- ❌ **Income**: Hardcoded to "Income Source" ← Generic and useless
- ❌ **Transfer**: Doesn't apply at all

### 2. **UI Issues**

- Edit Transaction Modal doesn't show "Transfer" type option
- Category dropdown doesn't change between income/expense categories
- Merchant field label is always "Merchant" regardless of type

### 3. **Code Issues**

```typescript
// In useTransactions.ts line 493:
merchant: 'Income Source', // ❌ Hardcoded generic value
```

---

## 🏗️ The Solution: Universal FROM/TO Party System

Banks use a **from → to** flow for all transactions. We should too!

### Transaction Flow Examples:

| Type            | From           | To                  | Example                           |
| --------------- | -------------- | ------------------- | --------------------------------- |
| 💵 **Expense**  | User Account   | Merchant            | "Main Checking" → "Starbucks"     |
| 💰 **Income**   | Income Source  | User Account        | "Tech Corp Inc" → "Main Checking" |
| 🔄 **Transfer** | Source Account | Destination Account | "Checking" → "Savings"            |

---

## 🗄️ Database Migration Plan

### Phase 1: Add New Columns (Non-Breaking)

```sql
ALTER TABLE public.transactions
ADD COLUMN from_party text,
ADD COLUMN to_party text,
ADD COLUMN destination_account_id text;

-- Add foreign key for transfer destination
ALTER TABLE public.transactions
ADD CONSTRAINT transactions_destination_account_id_fkey
FOREIGN KEY (destination_account_id) REFERENCES public.accounts(id) ON DELETE SET NULL;
```

### Phase 2: Migrate Existing Data

```sql
-- EXPENSES: from_party = account, to_party = merchant
UPDATE public.transactions t
SET
  from_party = a.name,
  to_party = COALESCE(t.merchant, 'Unknown Merchant')
FROM public.accounts a
WHERE t.account_id = a.id
AND t.type = 'expense';

-- INCOME: from_party = income source, to_party = account
UPDATE public.transactions t
SET
  from_party = CASE
    WHEN t.merchant = 'Income Source' THEN COALESCE(t.category, 'Unknown Source')
    ELSE COALESCE(t.merchant, t.category, 'Unknown Source')
  END,
  to_party = a.name
FROM public.accounts a
WHERE t.account_id = a.id
AND t.type = 'income';

-- TRANSFERS: from_party = source account, to_party = destination
UPDATE public.transactions t
SET
  from_party = a.name,
  to_party = COALESCE(t.description, 'Transfer Destination')
FROM public.accounts a
WHERE t.account_id = a.id
AND t.type = 'transfer';
```

### Phase 3: Remove Old Column

```sql
ALTER TABLE public.transactions DROP COLUMN merchant;
```

### Phase 4: Add Constraints

```sql
ALTER TABLE public.transactions
ALTER COLUMN from_party SET NOT NULL,
ALTER COLUMN to_party SET NOT NULL;
```

---

## 💻 Code Changes Required

### 1. Update TypeScript Types

**File**: `src/types/index.ts` or wherever Transaction type is defined

```typescript
export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  date: string;
  description: string;
  amount: number;
  category: string | null;
  type: "income" | "expense" | "transfer";

  // NEW: Replace merchant with universal party system
  from_party: string; // Who/where money comes FROM
  to_party: string; // Who/where money goes TO

  // NEW: For transfers only
  destination_account_id?: string | null;

  status: "completed" | "pending" | "cancelled" | "failed";
  created_at: string;
  updated_at: string;

  // REMOVE: merchant?: string;
}
```

### 2. Update `useTransactions.ts`

**File**: `src/hooks/queries/useTransactions.ts`

#### Change `createIncomeTransaction` function (around line 472):

**BEFORE**:

```typescript
merchant: 'Income Source', // ❌ Generic hardcoded value
```

**AFTER**:

```typescript
from_party: incomeData.source, // ✅ Actual income source name
to_party: accountName, // ✅ Account name (need to fetch this)
```

#### Full Updated Function:

```typescript
export async function createIncomeTransaction(incomeData: {
  amount: number;
  description: string;
  source: string;
  accountId: string;
  date: Date;
}): Promise<Transaction> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  const supabase = createClient();

  // Get account name for to_party
  const { data: account } = await supabase
    .from("accounts")
    .select("name")
    .eq("id", incomeData.accountId)
    .single();

  const accountName = account?.name || "Account";

  // Generate a unique ID
  const transactionId = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      id: transactionId,
      user_id: user.id,
      account_id: incomeData.accountId,
      type: "income",
      amount: Math.abs(incomeData.amount),
      description: incomeData.description,
      category: incomeData.source,
      from_party: incomeData.source, // ✅ Income source (e.g., "Tech Corp Inc")
      to_party: accountName, // ✅ User's account
      date: incomeData.date.toISOString().split("T")[0],
      status: "completed",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating income transaction:", error);
    throw new Error(`Failed to create income transaction: ${error.message}`);
  }

  // Update account balance...
  // (rest of function stays the same)

  return data;
}
```

### 3. Update Transaction Edit Modal

**File**: `src/components/transactions/TransactionEditModal.tsx`

✅ **Already Fixed!** Changes made:

- Added "Transfer" option to type select
- Category dropdown now switches between INCOME_CATEGORIES and EXPENSE_CATEGORIES based on type
- Merchant field label changes dynamically:
  - Expense → "Merchant"
  - Income → "Income Source"
  - Transfer → "Transfer Note"

### 4. Update Create Transaction Components

Similar changes needed in:

- `src/components/forms/TransactionForm.tsx`
- `src/components/transactions/AddTransactionModal.tsx`
- Any other transaction creation forms

---

## 🎨 UI Labels by Transaction Type

| Transaction Type | Field Name   | Label         | Placeholder              | Example Value      |
| ---------------- | ------------ | ------------- | ------------------------ | ------------------ |
| 💵 Expense       | `from_party` | Your Account  | (auto-filled)            | "Main Checking"    |
|                  | `to_party`   | Merchant      | "e.g., Starbucks, BP"    | "Starbucks"        |
| 💰 Income        | `from_party` | Income Source | "e.g., Employer, Client" | "Tech Corp Inc"    |
|                  | `to_party`   | Deposit To    | (auto-filled)            | "Main Checking"    |
| 🔄 Transfer      | `from_party` | From Account  | (select dropdown)        | "Checking Account" |
|                  | `to_party`   | To Account    | (select dropdown)        | "Savings Account"  |

---

## 📝 Migration Checklist

### Backend (Database)

- [ ] Backup database
- [ ] Run Phase 1: Add new columns
- [ ] Run Phase 2: Migrate existing data
- [ ] Verify data migration (spot check)
- [ ] Run Phase 3: Drop merchant column
- [ ] Run Phase 4: Add NOT NULL constraints

### Frontend (Next.js)

- [ ] Update Transaction TypeScript interface
- [ ] Update `createIncomeTransaction` in `useTransactions.ts`
- [ ] Update `createExpenseTransaction` in `useTransactions.ts`
- [ ] Update `createTransferTransaction` in `useTransactions.ts`
- [ ] Update TransactionEditModal ✅ (Already done)
- [ ] Update IncomeForm component
- [ ] Update TransactionForm component
- [ ] Update AddTransactionModal component
- [ ] Update transaction display components (lists, cards, etc.)
- [ ] Update any transaction filters or search

### Testing

- [ ] Test creating new income transaction
- [ ] Test creating new expense transaction
- [ ] Test creating new transfer transaction
- [ ] Test editing existing transactions
- [ ] Test transaction lists display correctly
- [ ] Test reports/analytics still work
- [ ] Test mobile app compatibility

---

## 🚀 Benefits After Refactor

1. ✅ **Consistent System**: All transactions use the same from/to logic
2. ✅ **Better Data**: No more generic "Income Source" strings
3. ✅ **Transfer Support**: Proper transfer tracking between accounts
4. ✅ **Query Flexibility**: Easy to find all transactions involving a party
5. ✅ **Bank-like**: Matches how real banking systems work
6. ✅ **Future-Proof**: Easy to add features like payees, recurring transactions, etc.

---

## 📱 Mobile App Changes

The mobile app (`personal-finance-tracker-mobile`) will need similar changes:

- Update types in `lib/types.ts`
- Update transaction creation functions
- Update UI components
- Sync with Next.js app changes

---

## 🔍 Example Queries After Migration

### Find all transactions with Starbucks

```sql
SELECT * FROM transactions
WHERE from_party ILIKE '%starbucks%'
   OR to_party ILIKE '%starbucks%';
```

### Get all income from a specific employer

```sql
SELECT * FROM transactions
WHERE type = 'income'
  AND from_party = 'Tech Corp Inc';
```

### Track money flow between accounts

```sql
SELECT * FROM transactions
WHERE type = 'transfer'
  AND (from_party = 'Main Checking' OR to_party = 'Main Checking');
```

---

## ⚠️ Important Notes

1. **Backward Compatibility**: Keep merchant column until migration is complete
2. **Test with Guest Data**: Make sure guest users work correctly
3. **Mobile Sync**: Deploy mobile app updates at the same time
4. **Database Triggers**: Update any triggers/functions that reference merchant column
5. **Reports/Analytics**: Update any aggregation queries

---

## 🎯 Quick Wins (Do These First)

Before the full migration, you can make these immediate improvements:

1. ✅ Fix TransactionEditModal to show Transfer type
2. ✅ Fix category dropdown to switch between income/expense categories
3. ✅ Change merchant field label based on transaction type
4. 🔄 Stop hardcoding "Income Source" - use actual source name
5. 🔄 Add better validation for merchant/source field

These are already done or can be done without database changes!
