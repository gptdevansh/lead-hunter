"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StoredUser = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

const sidebarItems = [
  "Overview",
  "Campaigns",
  "Leads",
  "Automation",
  "Analytics",
  "Settings",
];

export default function DashboardPage() {
  const router = useRouter();
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("contentking_access_token") : null;
  const rawUser = typeof window !== "undefined" ? localStorage.getItem("contentking_user") : null;
  let user: StoredUser | null = null;

  if (rawUser) {
    try {
      user = JSON.parse(rawUser) as StoredUser;
    } catch {
      user = null;
    }
  }

  useEffect(() => {
    if (!accessToken) {
      router.replace("/signin");
    }
  }, [accessToken, router]);

  const firstName = user?.first_name ?? "there";

  function handleSignOut() {
    localStorage.removeItem("contentking_access_token");
    localStorage.removeItem("contentking_token_type");
    localStorage.removeItem("contentking_user");
    router.replace("/signin");
  }

  if (!accessToken) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 text-text-secondary sm:px-8 lg:px-10">
        Redirecting to sign in...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="rounded-2xl border border-slate-200 bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] sm:p-5 lg:min-h-[calc(100vh-3rem)]">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">ContentKing</p>
            <h1 className="mt-1 text-lg font-semibold text-text-primary">Workspace</h1>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = index === 0;
              return (
                <button
                  key={item}
                  className={[
                    "w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-layer hover:text-text-primary",
                  ].join(" ")}
                  type="button"
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6 lg:space-y-8">
          <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="text-sm font-medium text-text-secondary">Welcome back, {firstName}</p>
              <h2 className="mt-1 text-xl font-semibold text-text-primary">Performance overview</h2>
              <p className="mt-1 text-sm text-text-muted">Track campaign progress and lead quality in one place.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button>Start Campaign</Button>
              <Button onClick={handleSignOut} variant="secondary">Sign out</Button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Card className="space-y-1">
              <p className="text-sm text-text-secondary">Active campaigns</p>
              <p className="text-2xl font-semibold text-text-primary">12</p>
              <p className="text-sm text-success">+8% this week</p>
            </Card>
            <Card className="space-y-1">
              <p className="text-sm text-text-secondary">Qualified leads</p>
              <p className="text-2xl font-semibold text-text-primary">384</p>
              <p className="text-sm text-success">+14% this week</p>
            </Card>
            <Card className="space-y-1">
              <p className="text-sm text-text-secondary">Automations running</p>
              <p className="text-2xl font-semibold text-text-primary">27</p>
              <p className="text-sm text-text-secondary">Stable operation</p>
            </Card>
          </section>

          <Card className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-text-primary">Recent activity</h3>
              <span className="text-sm text-text-muted">Last 24 hours</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-layer px-4 py-3">
                <p className="text-sm font-medium text-text-primary">Lead scoring model processed 56 new contacts</p>
                <p className="mt-1 text-sm text-text-secondary">Automation · 14 minutes ago</p>
              </div>
              <div className="rounded-xl bg-layer px-4 py-3">
                <p className="text-sm font-medium text-text-primary">Q2 outreach campaign reached 2,450 prospects</p>
                <p className="mt-1 text-sm text-text-secondary">Campaigns · 1 hour ago</p>
              </div>
              <div className="rounded-xl bg-layer px-4 py-3">
                <p className="text-sm font-medium text-text-primary">Executive weekly report is ready for review</p>
                <p className="mt-1 text-sm text-text-secondary">Analytics · 3 hours ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}