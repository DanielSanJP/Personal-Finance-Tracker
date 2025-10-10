"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { loginAsGuest } from "@/app/login/actions";

interface LoginFormProps extends React.ComponentProps<"div"> {
  loginAction?: (formData: FormData) => Promise<{ error?: string } | void>;
  guestLoginAction?: (formData: FormData) => Promise<{ error?: string } | void>;
  successMessage?: string;
}

export function LoginForm({
  className,
  loginAction,
  guestLoginAction = loginAsGuest,
  successMessage,
  ...props
}: LoginFormProps) {
  // Wrapper function to match useActionState signature
  const actionWrapper = async (
    prevState: { error?: string } | void,
    formData: FormData
  ) => {
    if (!loginAction) return { error: undefined };
    const result = await loginAction(formData);
    return result || { error: undefined };
  };

  // Guest login wrapper
  const guestActionWrapper = async (
    prevState: { error?: string } | void,
    formData: FormData
  ) => {
    if (!guestLoginAction) return { error: undefined };
    const result = await guestLoginAction(formData);
    return result || { error: undefined };
  };

  const [state, formAction, isPending] = useActionState(actionWrapper, {
    error: undefined,
  });

  const [guestState, guestFormAction, isGuestPending] = useActionState(
    guestActionWrapper,
    { error: undefined }
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {successMessage && (
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {(state?.error || guestState?.error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {state?.error || guestState?.error}
                </AlertDescription>
              </Alert>
            )}

            <form action={formAction}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={isPending || isGuestPending}
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
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isPending || isGuestPending}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isPending || isGuestPending}
                >
                  {isPending ? "Signing in..." : "Login"}
                </Button>
              </div>
            </form>

            <form action={guestFormAction}>
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer"
                disabled={isPending || isGuestPending}
              >
                {isGuestPending ? "Signing in..." : "Continue as Guest"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
