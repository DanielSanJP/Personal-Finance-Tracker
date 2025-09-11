import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
} from "@/lib/data";
import { toast } from "sonner";

export const PROFILE_QUERY_KEYS = {
  userProfile: ["profile", "user"] as const,
} as const;

export function useUserProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.userProfile,
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your profile information has been saved.",
        });

        // Invalidate and refetch user profile
        queryClient.invalidateQueries({
          queryKey: PROFILE_QUERY_KEYS.userProfile,
        });
      } else {
        toast.error("Error updating profile", {
          description: result.error || "Please try again later.",
        });
      }
    },
    onError: (error: Error) => {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile", {
        description: "An unexpected error occurred. Please try again.",
      });
    },
  });
}
