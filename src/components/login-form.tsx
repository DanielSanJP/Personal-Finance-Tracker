"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginFormProps extends React.ComponentProps<"div"> {
  loginAction?: (formData: FormData) => Promise<void>;
}

export function LoginForm({
  className,
  loginAction,
  ...props
}: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGuestMode = () => {
    localStorage.setItem("guestMode", "true");
    toast.success("Welcome, Guest!", {
      description: "You're now using the app with sample data.",
      duration: 3000,
    });
    router.push("/dashboard");
  };

  const handleSubmit = async (formData: FormData) => {
    if (!loginAction) return;

    setLoading(true);
    try {
      await loginAction(formData);
      toast.success("Welcome back!", {
        description: "You've been successfully logged in.",
      });
    } catch (error) {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleGuestMode}
                >
                  Continue as Guest
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
