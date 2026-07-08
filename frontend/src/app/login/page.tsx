import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.08),_transparent_35%)]" />

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
