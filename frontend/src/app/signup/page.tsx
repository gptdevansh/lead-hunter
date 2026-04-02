import { AuthShell } from "@/components/layout/auth-shell";
import { SignUpForm } from "@/modules/auth/components/signup-form";

export default function SignUpPage() {
  return (
    <AuthShell title="Create your account" subtitle="Get started with a calm, high-trust workspace for your team.">
      <SignUpForm />
    </AuthShell>
  );
}