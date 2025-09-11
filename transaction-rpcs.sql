-- Transaction RPC Functions for Supabase
-- These functions handle filtering and data retrieval on the database side
-- Run these in your Supabase SQL editor
-- Function to get filtered transactions for a user
CREATE OR REPLACE FUNCTION get_filtered_transactions(
        p_user_id UUID,
        p_category TEXT DEFAULT NULL,
        p_period TEXT DEFAULT NULL,
        p_merchant TEXT DEFAULT NULL,
        p_type TEXT DEFAULT NULL,
        p_limit INTEGER DEFAULT 1000
    ) RETURNS TABLE (
        id TEXT,
        user_id UUID,
        account_id TEXT,
        date DATE,
        description TEXT,
        amount NUMERIC,
        category TEXT,
        type TEXT,
        merchant TEXT,
        status TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    ) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE start_date DATE;
end_date DATE;
BEGIN -- Calculate date range based on period
IF p_period IS NOT NULL
AND p_period != 'All Time' THEN CASE
    p_period
    WHEN 'This Month' THEN start_date := DATE_TRUNC('month', CURRENT_DATE);
end_date := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day';
WHEN 'Last Month' THEN start_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month';
end_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day';
WHEN 'Last 3 Months' THEN start_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months';
end_date := CURRENT_DATE;
WHEN 'This Year' THEN start_date := DATE_TRUNC('year', CURRENT_DATE);
end_date := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day';
ELSE start_date := NULL;
end_date := NULL;
END CASE
;
END IF;
-- Return filtered transactions
RETURN QUERY
SELECT t.id,
    t.user_id,
    t.account_id,
    t.date,
    t.description,
    t.amount,
    t.category,
    t.type,
    t.merchant,
    t.status,
    t.created_at,
    t.updated_at
FROM transactions t
WHERE t.user_id = p_user_id
    AND (
        p_category IS NULL
        OR p_category = 'All Categories'
        OR t.category = p_category
    )
    AND (
        p_merchant IS NULL
        OR p_merchant = 'All Merchants'
        OR t.merchant = p_merchant
    )
    AND (
        p_type IS NULL
        OR p_type = 'All Types'
        OR t.type = p_type
    )
    AND (
        start_date IS NULL
        OR t.date >= start_date
    )
    AND (
        end_date IS NULL
        OR t.date <= end_date
    )
ORDER BY t.date DESC,
    t.created_at DESC
LIMIT p_limit;
END;
$$;
-- Function to get transaction filter options for a user
CREATE OR REPLACE FUNCTION get_transaction_filter_options(p_user_id UUID) RETURNS TABLE (
        categories TEXT [],
        merchants TEXT [],
        types TEXT [],
        periods TEXT []
    ) LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN QUERY
SELECT ARRAY ['All Categories'] || ARRAY(
        SELECT DISTINCT t.category
        FROM transactions t
        WHERE t.user_id = p_user_id
            AND t.category IS NOT NULL
            AND t.category != ''
        ORDER BY t.category
    ) as categories,
    ARRAY ['All Merchants'] || ARRAY(
        SELECT DISTINCT t.merchant
        FROM transactions t
        WHERE t.user_id = p_user_id
            AND t.merchant IS NOT NULL
            AND t.merchant != ''
        ORDER BY t.merchant
    ) as merchants,
    ARRAY ['All Types'] || ARRAY(
        SELECT DISTINCT t.type
        FROM transactions t
        WHERE t.user_id = p_user_id
            AND t.type IS NOT NULL
        ORDER BY t.type
    ) as types,
    ARRAY [
      'This Month',
      'Last Month', 
      'Last 3 Months',
      'This Year',
      'All Time'
    ] as periods;
END;
$$;
-- Function to get transaction summary for a user with filters
CREATE OR REPLACE FUNCTION get_transaction_summary(
        p_user_id UUID,
        p_category TEXT DEFAULT NULL,
        p_period TEXT DEFAULT NULL,
        p_merchant TEXT DEFAULT NULL,
        p_type TEXT DEFAULT NULL
    ) RETURNS TABLE (
        total_income NUMERIC,
        total_expenses NUMERIC,
        net_total NUMERIC,
        transaction_count INTEGER
    ) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE start_date DATE;
end_date DATE;
BEGIN -- Calculate date range based on period (same logic as above)
IF p_period IS NOT NULL
AND p_period != 'All Time' THEN CASE
    p_period
    WHEN 'This Month' THEN start_date := DATE_TRUNC('month', CURRENT_DATE);
end_date := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day';
WHEN 'Last Month' THEN start_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month';
end_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day';
WHEN 'Last 3 Months' THEN start_date := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months';
end_date := CURRENT_DATE;
WHEN 'This Year' THEN start_date := DATE_TRUNC('year', CURRENT_DATE);
end_date := DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' - INTERVAL '1 day';
ELSE start_date := NULL;
end_date := NULL;
END CASE
;
END IF;
-- Calculate summary
RETURN QUERY
SELECT COALESCE(
        SUM(
            CASE
                WHEN t.type = 'income' THEN t.amount
                ELSE 0
            END
        ),
        0
    ) as total_income,
    COALESCE(
        SUM(
            CASE
                WHEN t.type = 'expense' THEN ABS(t.amount)
                ELSE 0
            END
        ),
        0
    ) as total_expenses,
    COALESCE(SUM(t.amount), 0) as net_total,
    COUNT(*)::INTEGER as transaction_count
FROM transactions t
WHERE t.user_id = p_user_id
    AND (
        p_category IS NULL
        OR p_category = 'All Categories'
        OR t.category = p_category
    )
    AND (
        p_merchant IS NULL
        OR p_merchant = 'All Merchants'
        OR t.merchant = p_merchant
    )
    AND (
        p_type IS NULL
        OR p_type = 'All Types'
        OR t.type = p_type
    )
    AND (
        start_date IS NULL
        OR t.date >= start_date
    )
    AND (
        end_date IS NULL
        OR t.date <= end_date
    );
END;
$$;
-- Function to get recent transactions (for dashboard)
CREATE OR REPLACE FUNCTION get_recent_transactions(
        p_user_id UUID,
        p_limit INTEGER DEFAULT 10
    ) RETURNS TABLE (
        id TEXT,
        user_id UUID,
        account_id TEXT,
        date DATE,
        description TEXT,
        amount NUMERIC,
        category TEXT,
        type TEXT,
        merchant TEXT,
        status TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
    ) LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN QUERY
SELECT t.id,
    t.user_id,
    t.account_id,
    t.date,
    t.description,
    t.amount,
    t.category,
    t.type,
    t.merchant,
    t.status,
    t.created_at,
    t.updated_at
FROM transactions t
WHERE t.user_id = p_user_id
ORDER BY t.date DESC,
    t.created_at DESC
LIMIT p_limit;
END;
$$;
-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_filtered_transactions(UUID, TEXT, TEXT, TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_transaction_filter_options(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_transaction_summary(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_transactions(UUID, INTEGER) TO authenticated;
-- Add Row Level Security policies if not already present
-- These ensure users can only access their own data
-- RLS for transactions table (if not already enabled)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- Policy for transactions (if not already exists)
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions FOR
SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions" ON transactions FOR
INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
CREATE POLICY "Users can update own transactions" ON transactions FOR
UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);