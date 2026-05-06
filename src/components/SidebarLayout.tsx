import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import logoUrl from "@/assets/neomora-logo.png";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface SidebarLayoutProps {
  navItems: NavItem[];
  user: { name: string; role: string };
  portalLabel: string;
  children?: ReactNode;
}

export function SidebarLayout({ navItems, user, portalLabel, children }: SidebarLayoutProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex flex-col gap-1 border-b border-sidebar-border px-5 py-5">
          <div className="flex h-10 items-center justify-center rounded-md bg-white/95 px-3">
            <img src={logoUrl} alt="Neomora" className="h-6 w-auto" />
          </div>
          <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-widest text-white/60">
            {portalLabel}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-white/60">{user.role}</p>
            </div>
            <button
              onClick={() => navigate({ to: "/" })}
              title="Sign out"
              className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col lg:pl-[260px]">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b bg-sidebar px-4 py-3 lg:hidden">
          <div className="flex h-8 items-center rounded-md bg-white/95 px-2">
            <img src={logoUrl} alt="Neomora" className="h-5 w-auto" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
            {portalLabel}
          </span>
          <button
            onClick={() => navigate({ to: "/" })}
            className="ml-auto text-xs text-white/80 hover:text-white"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
