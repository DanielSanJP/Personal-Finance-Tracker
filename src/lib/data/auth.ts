import { createClient } from '../supabase/client';
import { dataCache } from './cache';
import type { User } from './types';

// Normalize user data to ensure consistent format
const normalizeUserData = (userData: {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  displayName?: string;
  display_name?: string;
  initials?: string;
  avatar?: string | null;
  [key: string]: unknown;
}): User => {
  const firstName = userData.firstName || userData.first_name || '';
  const lastName = userData.lastName || userData.last_name || '';
  const displayName = userData.displayName || userData.display_name || 
                     `${firstName} ${lastName}`.trim() || userData.email || 'User';
  const initials = userData.initials || 
                   `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 
                   userData.email?.[0]?.toUpperCase() || 'U';

  return {
    id: userData.id,
    first_name: firstName,
    last_name: lastName,
    email: userData.email || '',
    display_name: displayName,
    initials: initials,
    avatar: userData.avatar || null,
    // Legacy support
    firstName,
    lastName,
    displayName,
  };
};

// Get current authenticated user with caching
export const getCurrentUser = async (): Promise<User | null> => {
  // Check cache first
  const cachedUser = dataCache.getUser();
  if (cachedUser !== undefined) {
    return cachedUser;
  }

  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!error && user) {
      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      let userData: User;
      if (profileError || !profile) {
        // If no profile exists, return the auth user data
        userData = {
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || '',
          initials: `${user.user_metadata?.first_name?.[0] || ''}${user.user_metadata?.last_name?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
        };
      } else {
        userData = normalizeUserData(profile);
      }
      
      // Cache the result
      dataCache.setUser(userData);
      return userData;
    }

    // Cache null result
    dataCache.setUser(null);
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    // Don't cache errors, allow retry
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return data ? normalizeUserData(data) : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Guest account constant
export const GUEST_USER_ID = '55e3b0e6-b683-4cab-aa5b-6a5b192bde7d';

// Check if current user is guest
export const isGuestUser = (user: User | null): boolean => {
  return user?.id === GUEST_USER_ID;
};

// Clear user cache (useful for logout)
export const clearUserCache = (): void => {
  dataCache.clearUser();
};
