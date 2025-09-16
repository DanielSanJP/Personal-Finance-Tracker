import { LoginForm } from "@/components/login-form";
import { login, loginAsGuest } from "./actions";

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm loginAction={login} guestLoginAction={loginAsGuest} />
        </div>
      </div>
    </div>
  );
}
