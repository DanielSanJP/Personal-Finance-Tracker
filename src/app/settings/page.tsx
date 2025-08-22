"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/client";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    currentEmail: "",
    newEmail: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error getting user:", error);
          toast.error("Error loading user information");
          return;
        }

        if (user) {
          setEmailForm({
            currentEmail: user.email || "",
            newEmail: "",
          });
        }
      } catch (error) {
        console.error("Error in getUser:", error);
        toast.error("Error loading user information");
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setEmailForm({
          currentEmail: session.user.email || "",
          newEmail: "",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleEmailUpdate = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("update email");
    if (isGuest) return;

    if (!emailForm.newEmail.trim()) {
      toast.error("Please enter a new email address");
      return;
    }

    if (!validateEmail(emailForm.newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emailForm.newEmail === emailForm.currentEmail) {
      toast.error("New email must be different from current email");
      return;
    }

    setEmailLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail,
      });

      if (error) {
        console.error("Error updating email:", error);
        toast.error("Error updating email", {
          description: error.message || "Please try again later.",
        });
      } else {
        toast.success("Email update initiated!", {
          description: "Check your new email address for a confirmation link.",
        });
        setEmailForm({ ...emailForm, newEmail: "" });
      }
    } catch (error) {
      console.error("Error in handleEmailUpdate:", error);
      toast.error("Error updating email", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("update password");
    if (isGuest) return;

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (!validatePassword(passwordForm.newPassword)) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) {
        console.error("Error updating password:", error);
        toast.error("Error updating password", {
          description: error.message || "Please try again later.",
        });
      } else {
        toast.success("Password updated successfully!", {
          description: "Your password has been changed.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error in handlePasswordUpdate:", error);
      toast.error("Error updating password", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Account Settings
            </CardTitle>
            <p className="text-muted-foreground">
              Manage your email address and password security settings.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Email Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <h3 className="text-lg font-medium">Email Address</h3>
              </div>

              <Alert>
                <AlertDescription>
                  Changing your email address will require confirmation from
                  your new email. You&apos;ll remain logged in with your current
                  email until confirmed.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentEmail">Current Email</Label>
                  <Input
                    id="currentEmail"
                    type="email"
                    value={emailForm.currentEmail}
                    disabled
                    className="!h-auto !px-4 !py-3 !border-gray-200 !rounded-lg !bg-gray-50 !text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newEmail">New Email Address</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="Enter your new email address"
                    value={emailForm.newEmail}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, newEmail: e.target.value })
                    }
                    className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                  />
                </div>

                <Button
                  onClick={handleEmailUpdate}
                  disabled={emailLoading || !emailForm.newEmail.trim()}
                  className="min-w-32"
                >
                  {emailLoading ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Password Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <h3 className="text-lg font-medium">Password</h3>
              </div>

              <Alert>
                <AlertDescription>
                  Your password must be at least 8 characters long. Choose a
                  strong password that you haven&apos;t used elsewhere.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="!h-auto !px-4 !py-3 !pr-12 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="!h-auto !px-4 !py-3 !pr-12 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handlePasswordUpdate}
                  disabled={
                    passwordLoading ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                  className="min-w-32"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
