"use client";

import { Button } from "@/components/ui/button";
import { continueWithGoogle } from "@/modules/auth/services/auth.service";

type GoogleAuthButtonProps = {
  mode: "signin" | "signup";
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.22v3.91h5.43c-.24 1.26-.96 2.33-2.03 3.05l3.28 2.54c1.91-1.76 3.02-4.36 3.02-7.44 0-.72-.07-1.42-.2-2.1H12z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.73 0 5.02-.9 6.69-2.45l-3.28-2.54c-.91.61-2.07.98-3.41.98-2.62 0-4.83-1.77-5.62-4.15l-3.39 2.62A10.1 10.1 0 0012 22z"
      />
      <path
        fill="#4A90E2"
        d="M6.38 13.84A6.08 6.08 0 016.05 12c0-.64.11-1.26.33-1.84L2.99 7.54A10.1 10.1 0 001.9 12c0 1.62.39 3.14 1.09 4.46l3.39-2.62z"
      />
      <path
        fill="#FBBC05"
        d="M12 6.01c1.48 0 2.8.51 3.84 1.51l2.88-2.88C17.02 3.04 14.73 2 12 2A10.1 10.1 0 002.99 7.54l3.39 2.62C7.17 7.78 9.38 6.01 12 6.01z"
      />
    </svg>
  );
}

export function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const ctaLabel = mode === "signin" ? "Sign in with Google" : "Sign up with Google";

  return (
    <Button
      className="w-full gap-2.5"
      type="button"
      variant="secondary"
      onClick={() => continueWithGoogle(mode)}
    >
      <GoogleIcon />
      {ctaLabel}
    </Button>
  );
}
