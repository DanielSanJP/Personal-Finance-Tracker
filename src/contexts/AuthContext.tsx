"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/lib/data/types";
import usersData from "@/data/users.json";

interface AuthState {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  setGuestMode: () => void;
  clearGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Normalize user data to ensure consistent format regardless of source
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
  // Handle guest user data (camelCase from JSON) or auth user data (snake_case from Supabase)
  const firstName = userData.firstName || userData.first_name || "";
  const lastName = userData.lastName || userData.last_name || "";
  const displayName =
    userData.displayName ||
    userData.display_name ||
    `${firstName} ${lastName}`.trim() ||
    userData.email ||
    "User";
  const initials =
    userData.initials ||
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() ||
    userData.email?.[0]?.toUpperCase() ||
    "U";

  return {
    id: userData.id,
    first_name: firstName,
    last_name: lastName,
    email: userData.email || "",
    display_name: displayName,
    initials: initials,
    avatar: userData.avatar || null,
    // Legacy support
    firstName,
    lastName,
    displayName,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isGuest: false,
  });

  useEffect(() => {
    const supabase = createClient();

    // Initial auth check
    const checkAuth = async () => {
      // Check if Supabase env vars are available
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const guestMode = localStorage.getItem("guestMode") === "true";
        if (guestMode) {
          setAuthState({
            user: normalizeUserData(usersData.users[0]),
            loading: false,
            isGuest: true,
          });
        } else {
          setAuthState({ user: null, loading: false, isGuest: false });
        }
        return;
      }

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!error && user) {
          // Authenticated user - get profile
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profile) {
            setAuthState({
              user: normalizeUserData(profile),
              loading: false,
              isGuest: false,
            });
            localStorage.removeItem("guestMode");
          } else {
            // No profile, use auth metadata
            const userFromAuth = {
              id: user.id,
              email: user.email || "",
              first_name: user.user_metadata?.first_name || "",
              last_name: user.user_metadata?.last_name || "",
              display_name:
                user.user_metadata?.display_name || user.email || "",
            };
            setAuthState({
              user: normalizeUserData(userFromAuth),
              loading: false,
              isGuest: false,
            });
            localStorage.removeItem("guestMode");
          }
        } else {
          // No authenticated user - check guest mode
          const guestMode = localStorage.getItem("guestMode") === "true";
          if (guestMode) {
            setAuthState({
              user: normalizeUserData(usersData.users[0]),
              loading: false,
              isGuest: true,
            });
          } else {
            setAuthState({ user: null, loading: false, isGuest: false });
          }
        }
      } catch (error) {
        console.error("AuthContext: Auth check error:", error);
        // Fallback to no user state on error
        const guestMode = localStorage.getItem("guestMode") === "true";
        if (guestMode) {
          setAuthState({
            user: normalizeUserData(usersData.users[0]),
            loading: false,
            isGuest: true,
          });
        } else {
          setAuthState({ user: null, loading: false, isGuest: false });
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // User signed in - clear guest mode and get profile
        localStorage.removeItem("guestMode");

        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setAuthState({
            user: normalizeUserData(profile),
            loading: false,
            isGuest: false,
          });
        } else {
          const userFromAuth = {
            id: session.user.id,
            email: session.user.email || "",
            first_name: session.user.user_metadata?.first_name || "",
            last_name: session.user.user_metadata?.last_name || "",
            display_name:
              session.user.user_metadata?.display_name ||
              session.user.email ||
              "",
          };
          setAuthState({
            user: normalizeUserData(userFromAuth),
            loading: false,
            isGuest: false,
          });
        }
      } else if (event === "SIGNED_OUT") {
        // User signed out - check if guest mode should be active
        const guestMode = localStorage.getItem("guestMode") === "true";
        if (guestMode) {
          setAuthState({
            user: normalizeUserData(usersData.users[0]),
            loading: false,
            isGuest: true,
          });
        } else {
          setAuthState({ user: null, loading: false, isGuest: false });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("guestMode");
    setAuthState({ user: null, loading: false, isGuest: false });
  };

  const setGuestMode = () => {
    localStorage.setItem("guestMode", "true");
    setAuthState({
      user: normalizeUserData(usersData.users[0]),
      loading: false,
      isGuest: true,
    });
    window.dispatchEvent(new CustomEvent("guestModeChanged", { detail: true }));
  };

  const clearGuestMode = () => {
    localStorage.removeItem("guestMode");
    if (authState.isGuest) {
      setAuthState({ user: null, loading: false, isGuest: false });
    }
    window.dispatchEvent(
      new CustomEvent("guestModeChanged", { detail: false })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signOut,
        setGuestMode,
        clearGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
