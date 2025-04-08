import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          CPMD PORTAL
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your account or register for a new one
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
