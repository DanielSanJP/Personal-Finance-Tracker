"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Nav from "@/components/nav";
import {
  getUserProfile,
  updateUserProfile,
  validateProfileData,
  type UserProfile,
  type UpdateProfileData,
} from "@/lib/data";
import { FormSkeleton } from "@/components/loading-states";
import { checkGuestAndWarn } from "@/lib/guest-protection";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            firstName: userProfile.first_name || "",
            lastName: userProfile.last_name || "",
            displayName: userProfile.display_name || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Error loading profile", {
          description: "Please refresh the page to try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("update profile");
    if (isGuest) return;

    const updateData: UpdateProfileData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      display_name: formData.displayName || undefined,
    };

    // Validate the data
    const validation = validateProfileData(updateData);
    if (!validation.isValid) {
      toast.error("Please fix the following errors:", {
        description: validation.errors.join(", "),
      });
      return;
    }

    setSaving(true);

    try {
      const result = await updateUserProfile(updateData);

      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your profile information has been saved.",
        });

        // Reload the profile to get the updated data
        const updatedProfile = await getUserProfile();
        if (updatedProfile) {
          setProfile(updatedProfile);
          setFormData({
            firstName: updatedProfile.first_name || "",
            lastName: updatedProfile.last_name || "",
            displayName: updatedProfile.display_name || "",
          });
        }
      } else {
        toast.error("Error updating profile", {
          description: result.error || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        displayName: profile.display_name || "",
      });
    }
    toast.info("Changes discarded", {
      description: "Your profile information has been reset.",
    });
  };

  const hasChanges =
    profile &&
    (formData.firstName !== (profile.first_name || "") ||
      formData.lastName !== (profile.last_name || "") ||
      formData.displayName !== (profile.display_name || ""));

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Profile Settings
            </CardTitle>
            <p className="text-muted-foreground">
              Manage your personal information and display preferences.
            </p>
          </CardHeader>

          <CardContent>
            {loading ? (
              <FormSkeleton />
            ) : (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      Personal Information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Update your personal details below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your display name (optional)"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayName: e.target.value,
                        })
                      }
                      className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                    />
                    <p className="text-xs text-muted-foreground">
                      If left empty, your display name will be your first and
                      last name.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving || !hasChanges}
                    className="min-w-32"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="min-w-32"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
