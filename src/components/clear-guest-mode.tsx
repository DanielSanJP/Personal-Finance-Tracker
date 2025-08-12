"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearGuestMode } from "@/lib/data";

export default function ClearGuestMode() {
  useEffect(() => {
    const checkAndClearGuestMode = async () => {
      const supabase = createClient();

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!error && user) {
          clearGuestMode();
        }
      } catch (error) {
        console.error("ClearGuestMode: Error checking auth state:", error);
      }
    };

    checkAndClearGuestMode();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        clearGuestMode();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null; // This component doesn't render anything
}
