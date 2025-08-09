import { RegisterForm } from "@/components/register-form";
import { signup } from "@/app/login/actions";
import Nav from "@/components/nav";

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <RegisterForm signupAction={signup} />
        </div>
      </div>
    </div>
  );
}
