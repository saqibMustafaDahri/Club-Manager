import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { LogOut, Menu, X } from "lucide-react";
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
  /** Where the logo + sign-in flow should land (defaults to first nav item). */
  homePath?: string;
  children?: ReactNode;
}

export function SidebarLayout({ navItems, user, portalLabel, homePath, children }: SidebarLayoutProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const portalRoot = homePath ?? navItems[0]?.to ?? "/";

  // Close overlay when route changes
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (to: string) => {
    // Exact match for portal root, otherwise prefix match
    if (to === portalRoot) return pathname === to;
    return pathname === to || pathname.startsWith(to + "/");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar (≥lg, full width) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <SidebarInner
          portalLabel={portalLabel}
          navItems={navItems}
          user={user}
          isActive={isActive}
          portalRoot={portalRoot}
          onNavClick={() => { }}
        />
      </aside>

      {/* Mobile overlay sidebar (<lg) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarInner
          portalLabel={portalLabel}
          navItems={navItems}
          user={user}
          isActive={isActive}
          portalRoot={portalRoot}
          onNavClick={() => setMobileOpen(false)}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      <div className="flex w-full flex-1 flex-col lg:pl-[260px]">
        {/* Mobile top bar with hamburger */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-8 items-center justify-center rounded-md bg-sidebar px-3">
            <img src={logoUrl} alt="Neomora" className="h-5 w-auto" />
          </div>
          <div className="w-9" />
        </header>
        <main className="flex-1">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}

interface InnerProps {
  portalLabel: string;
  navItems: NavItem[];
  user: { name: string; role: string };
  isActive: (to: string) => boolean;
  portalRoot: string;
  onNavClick: () => void;
  onClose?: () => void;
}

function SidebarInner({ portalLabel, navItems, user, isActive, portalRoot, onNavClick, onClose }: InnerProps) {
  return (
    <>
      <div className="relative flex flex-col gap-1 border-b border-sidebar-border px-5 py-5">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Link to={portalRoot} preload="render" className="flex h-10 items-center justify-center rounded-md bg-white/95 px-3" onClick={onNavClick}>
          <img src={logoUrl} alt="Neomora" className="h-6 w-auto" />
        </Link>
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
              preload="render"
              onClick={onNavClick}
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
          <Link
            to="/login"
            preload="render"
            title="Sign out"
            aria-label="Sign out"
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
