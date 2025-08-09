import { LoginForm } from "@/components/login-form";
import { login } from "./actions";
import Nav from "@/components/nav";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm loginAction={login} />
        </div>
      </div>
    </div>
  );
}
