import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Access your protected project workspace.</p>
        <div className="mt-7">
          <AuthForm mode="login" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Need an account?{" "}
          <Link className="font-medium text-primary" href="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
