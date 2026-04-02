import Link from "next/link";
import { Card } from "@/components/ui/card";

type AuthFormShellProps = {
  children: React.ReactNode;
  footerLabel: string;
  footerAction: string;
  footerHref: string;
};

export function AuthFormShell({
  children,
  footerLabel,
  footerAction,
  footerHref,
}: AuthFormShellProps) {
  return (
    <Card className="space-y-6 p-6 sm:p-7">
      {children}
      <div className="h-px bg-slate-200" />
      <p className="text-center text-sm text-text-secondary">
        {footerLabel}{" "}
        <Link className="font-medium text-accent transition-colors hover:text-accent-hover" href={footerHref}>
          {footerAction}
        </Link>
      </p>
    </Card>
  );
}