import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

// Guest account constant
export const GUEST_USER_ID = '55e3b0e6-b683-4cab-aa5b-6a5b192bde7d';

// Simple function to get current user from Supabase
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = createClient();
    
    // First check if there's an active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }
    
    // If no session, return null (not an error)
    if (!session) {
      return null;
    }
    
    // If we have a session, get the user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Simple React Query hook for authentication state
 * Uses Supabase auth directly without extra complexity
 */
export function useAuth() {
  const queryClient = useQueryClient();
  
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  // Listen for auth changes and update the cache
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Update the query cache when auth state changes
      queryClient.setQueryData(['auth', 'currentUser'], session?.user ?? null);
      
      // Clear all other queries on sign out
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  // Derived state
  const isAuthenticated = !!user;
  const isGuest = user?.id === GUEST_USER_ID;

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated,
    isGuest,
    refetch,
  };
}