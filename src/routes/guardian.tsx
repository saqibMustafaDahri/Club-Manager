import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Users, Wallet, FileText } from "lucide-react";
import logoUrl from "@/assets/neomora-logo.png";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guardian")({
  component: GuardianLayout,
});

const GUARDIAN_NAME = "Fatima Al-Harbi";

const navItems = [
  { label: "My Children", to: "/guardian", icon: Users, exact: true },
  { label: "Payments", to: "/guardian/payments", icon: Wallet },
  { label: "Documents", to: "/guardian/documents", icon: FileText },
];

function GuardianLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact
      ? pathname === to || pathname.startsWith("/guardian/participant")
      : pathname === to || pathname.startsWith(to + "/");

  const initials = GUARDIAN_NAME.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div className="min-h-screen w-full" style={{ background: "#F8F9FA" }}>
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <Link to="/guardian" preload="render" className="flex items-center gap-3">
            <div className="flex h-9 items-center justify-center rounded-md bg-sidebar px-2">
              <img src={logoUrl} alt="Neomora" className="h-5 w-auto brightness-0 invert" />
            </div>
            <span className="hidden text-sm font-semibold text-sidebar md:inline">Guardian Portal</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  preload="render"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar text-white"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium leading-none">{GUARDIAN_NAME}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Guardian</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
