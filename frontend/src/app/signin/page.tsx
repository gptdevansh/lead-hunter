import { AuthShell } from "@/components/layout/auth-shell";
import { SignInForm } from "@/modules/auth/components/signin-form";

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue managing your campaigns and leads.">
      <SignInForm />
    </AuthShell>
  );
}