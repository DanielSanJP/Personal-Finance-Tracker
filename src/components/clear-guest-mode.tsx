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
          console.log(
            "🔍 ClearGuestMode: Authenticated user found, clearing guest mode"
          );
          clearGuestMode();
        }
      } catch (error) {
        console.error("🔥 ClearGuestMode: Error checking auth state:", error);
      }
    };

    checkAndClearGuestMode();

    // Listen for auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        "🔍 ClearGuestMode: Auth state change:",
        event,
        session?.user?.id
      );

      if (event === "SIGNED_IN" && session?.user) {
        console.log("🔍 ClearGuestMode: User signed in, clearing guest mode");
        clearGuestMode();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null; // This component doesn't render anything
}
