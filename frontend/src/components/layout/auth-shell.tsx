type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto w-full max-w-md space-y-8">
        <header className="space-y-4 text-center">
          <p className="inline-flex items-center rounded-full border border-slate-200 bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            Secure workspace access
          </p>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[30px]">{title}</h1>
            <p className="text-sm text-text-secondary">{subtitle}</p>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}