"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthForm } from "@/modules/auth/hooks/use-auth-form";
import { AuthFormShell } from "@/modules/auth/components/auth-form-shell";
import { GoogleAuthButton } from "@/modules/auth/components/google-auth-button";
import { signIn } from "@/modules/auth/services/auth.service";

export function SignInForm() {
  const router = useRouter();
  const { values, setField } = useAuthForm({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signIn(values);
      localStorage.setItem("contentking_access_token", response.access_token);
      localStorage.setItem("contentking_token_type", response.token_type);
      localStorage.setItem("contentking_user", JSON.stringify(response.user));
      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell footerLabel="New to ContentKing?" footerAction="Create account" footerHref="/signup">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <GoogleAuthButton mode="signin" />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">or continue with email</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">Email</span>
          <Input
            autoComplete="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">Password</span>
          <Input
            autoComplete="current-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(event) => setField("password", event.target.value)}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-xl bg-layer px-3 py-2 text-sm text-text-secondary">{errorMessage}</p>
        ) : null}

        <Button className="mt-2 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthFormShell>
  );
}