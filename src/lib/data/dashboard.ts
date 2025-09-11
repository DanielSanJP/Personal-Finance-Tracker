import { getCurrentUser } from '../auth';
import { getAccountsByUserId } from './accounts';
import { getTransactionsByUserId } from './transactions';
import { calculateRealTimeBudgetRemainingFromTransactions } from './budgets';
import { getSummaryByUserId } from './summary';
import type { User, Account, Transaction } from '@/types';

// Dashboard data interface
export interface DashboardData {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  summary: {
    totalBalance: number;
    monthlyChange: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    budgetRemaining: number;
    accountBreakdown: Record<string, unknown>;
    categorySpending: Record<string, unknown>;
  };
}

// Helper function to calculate monthly income from transactions
const calculateMonthlyIncomeFromTransactions = (transactions: Transaction[]): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             transaction.type === 'income';
    })
    .reduce((total: number, transaction: Transaction) => total + Math.abs(transaction.amount), 0);
};

// Helper function to calculate monthly expenses from transactions
const calculateMonthlyExpensesFromTransactions = (transactions: Transaction[]): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear &&
             transaction.type === 'expense';
    })
    .reduce((total: number, transaction: Transaction) => total + Math.abs(transaction.amount), 0);
};

// Optimized function to fetch all dashboard data in one go
export const getDashboardData = async (): Promise<DashboardData | null> => {
  try {
    // First get the user (this is cached now)
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    // Now fetch all other data in parallel using the user ID
    const [
      accounts,
      transactions,
      staticSummary
    ] = await Promise.all([
      getAccountsByUserId(user.id),
      getTransactionsByUserId(user.id),
      getSummaryByUserId(user.id)
    ]);

    // Calculate derived values from the fetched data
    const totalBalance = accounts.reduce((total: number, account: Account) => total + account.balance, 0);
    const monthlyIncome = calculateMonthlyIncomeFromTransactions(transactions);
    const monthlyExpenses = calculateMonthlyExpensesFromTransactions(transactions);
    const monthlyChange = monthlyIncome - monthlyExpenses;
    const budgetRemaining = await calculateRealTimeBudgetRemainingFromTransactions(user.id, transactions);

    return {
      user,
      accounts,
      transactions,
      summary: {
        totalBalance,
        monthlyChange,
        monthlyIncome,
        monthlyExpenses,
        budgetRemaining,
        accountBreakdown: staticSummary?.accountBreakdown || {},
        categorySpending: staticSummary?.categorySpending || {}
      }
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return null;
  }
};
