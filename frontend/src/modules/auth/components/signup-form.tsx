"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthForm } from "@/modules/auth/hooks/use-auth-form";
import { AuthFormShell } from "@/modules/auth/components/auth-form-shell";
import { GoogleAuthButton } from "@/modules/auth/components/google-auth-button";
import { signUp } from "@/modules/auth/services/auth.service";

export function SignUpForm() {
  const router = useRouter();
  const { values, setField } = useAuthForm({
    firstName: "",
    lastName: "",
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
      const response = await signUp(values);
      localStorage.setItem("contentking_access_token", response.access_token);
      localStorage.setItem("contentking_token_type", response.token_type);
      localStorage.setItem("contentking_user", JSON.stringify(response.user));
      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create account right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormShell footerLabel="Already have an account?" footerAction="Sign in" footerHref="/signin">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <GoogleAuthButton mode="signup" />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">or continue with email</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-text-secondary">First Name</span>
            <Input
              autoComplete="given-name"
              name="firstName"
              placeholder="John"
              value={values.firstName}
              onChange={(event) => setField("firstName", event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-text-secondary">Last Name</span>
            <Input
              autoComplete="family-name"
              name="lastName"
              placeholder="Appleseed"
              value={values.lastName}
              onChange={(event) => setField("lastName", event.target.value)}
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-secondary">Business Email</span>
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
            autoComplete="new-password"
            name="password"
            type="password"
            placeholder="Create a secure password"
            value={values.password}
            onChange={(event) => setField("password", event.target.value)}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-xl bg-layer px-3 py-2 text-sm text-text-secondary">{errorMessage}</p>
        ) : null}

        <Button className="mt-2 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthFormShell>
  );
}