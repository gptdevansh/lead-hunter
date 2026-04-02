"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type OAuthStatus = "success" | "error";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackFallback() {
  return (
    <AuthShell title="Completing sign-in" subtitle="Finalizing your secure session.">
      <Card className="space-y-4 p-6 sm:p-7">
        <p className="text-sm text-text-secondary">Please wait…</p>
      </Card>
    </AuthShell>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = (searchParams.get("status") as OAuthStatus | null) ?? "error";
  const mode = searchParams.get("mode") ?? "signin";
  const message = searchParams.get("message") ?? "Authentication failed. Please try again.";

  const accessToken = searchParams.get("access_token");
  const tokenType = searchParams.get("token_type") ?? "bearer";
  const firstName = searchParams.get("first_name") ?? "";
  const lastName = searchParams.get("last_name") ?? "";
  const email = searchParams.get("email") ?? "";

  const title = useMemo(() => {
    if (status === "success") {
      return mode === "signup" ? "Account ready" : "Signed in successfully";
    }
    return "Google sign-in failed";
  }, [mode, status]);

  const subtitle =
    status === "success"
      ? "You are being redirected to your workspace."
      : "We could not complete Google authentication.";

  useEffect(() => {
    if (status !== "success" || !accessToken) {
      return;
    }

    localStorage.setItem("contentking_access_token", accessToken);
    localStorage.setItem("contentking_token_type", tokenType);
    localStorage.setItem(
      "contentking_user",
      JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
      }),
    );

    const timeoutId = window.setTimeout(() => {
      router.replace("/dashboard");
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [accessToken, email, firstName, lastName, router, status, tokenType]);

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <Card className="space-y-4 p-6 sm:p-7">
        <p className="text-sm text-text-secondary">
          {status === "success"
            ? `Welcome${firstName ? `, ${firstName}` : ""}.`
            : message}
        </p>

        {status === "error" ? (
          <div className="flex items-center gap-3">
            <Button className="w-full" onClick={() => router.push("/signin")}>Back to Sign In</Button>
            <Button className="w-full" variant="secondary" onClick={() => router.push("/signup")}>Create Account</Button>
          </div>
        ) : null}
      </Card>
    </AuthShell>
  );
}
