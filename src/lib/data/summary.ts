import { createClient } from '../supabase/client';
import { getCurrentUser } from '../auth';
import { getMonthlyIncome, getMonthlyExpenses } from './transactions';
import { calculateRealTimeBudgetRemaining } from './budgets';

// Summary functions
export const getCurrentUserSummary = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('summary')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserSummary:', error);
    return null;
  }
};

// Calculate current user summary with real-time data from transactions
export const calculateCurrentUserSummary = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  try {
    // Calculate real-time values from transactions and budgets
    const [monthlyIncome, monthlyExpenses, budgetRemaining] = await Promise.all([
      getMonthlyIncome(),
      getMonthlyExpenses(),
      calculateRealTimeBudgetRemaining()
    ]);
    
    // Calculate monthly change (income - expenses)
    const monthlyChange = monthlyIncome - monthlyExpenses;
    
    // Get static data from summary table for other fields
    const staticSummary = await getCurrentUserSummary();
    
    return {
      ...staticSummary,
      monthlyIncome,
      monthlyExpenses,
      monthlyChange,
      budgetRemaining,
      userId: user.id,
    };
  } catch (error) {
    console.error('Error in calculateCurrentUserSummary:', error);
    return null;
  }
};

export const getSummaryByUserId = async (userId: string) => {
  try {
    // Validate userId parameter
    if (!userId || typeof userId !== 'string') {
      console.error('Error fetching summary by user ID: Invalid or missing userId:', userId);
      return null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('summary')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no summary record exists, return default values instead of erroring
      if (error.code === 'PGRST116') {
        console.log('No summary record found for user, returning defaults');
        return {
          user_id: userId,
          accountBreakdown: {},
          categorySpending: {}
        };
      }
      console.error('Error fetching summary by user ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSummaryByUserId:', error);
    return null;
  }
};
