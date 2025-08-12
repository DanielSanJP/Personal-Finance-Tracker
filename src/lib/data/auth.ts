import usersData from '@/data/users.json';
import { createClient } from '../supabase/client';
import type { User } from './types';

// Normalize user data to ensure consistent format (same as in AuthContext)
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

// Legacy functions for backward compatibility
// These should be replaced with useAuth() hook in components

// Check if user is in guest mode (legacy - prefer useAuth)
export const isGuestMode = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('guestMode') === 'true';
  }
  return false;
};

// Clear guest mode (legacy - prefer useAuth)
export const clearGuestMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guestMode');
    window.dispatchEvent(new CustomEvent('guestModeChanged', { detail: false }));
  }
};

// Set guest mode (legacy - prefer useAuth)
export const setGuestMode = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guestMode', 'true');
    window.dispatchEvent(new CustomEvent('guestModeChanged', { detail: true }));
  }
};

// User functions
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!error && user) {
      // If we have a real authenticated user, clear guest mode
      clearGuestMode();

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile) {
        // If no profile exists, return the auth user data
        return {
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || '',
          initials: `${user.user_metadata?.first_name?.[0] || ''}${user.user_metadata?.last_name?.[0] || ''}`.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
        };
      }
      
      return normalizeUserData(profile);
    }

    // No authenticated user found, check guest mode
    const guestModeActive = isGuestMode();
    console.log('🔍 Guest mode active:', guestModeActive);
    
    if (guestModeActive) {
      console.log('🔍 Returning guest user:', usersData.users[0]);
      return normalizeUserData(usersData.users[0]);
    }

    return null;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    
    // Fallback to guest mode if there's an error and guest mode is active
    const guestModeActive = isGuestMode();
    
    if (guestModeActive) {
      return normalizeUserData(usersData.users[0]);
    }
    
    return null;
  }
};

export const getUserById = async (userId: string) => {
  if (isGuestMode()) {
    const user = usersData.users.find(user => user.id === userId);
    return user ? normalizeUserData(user) : null;
  }
  
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
