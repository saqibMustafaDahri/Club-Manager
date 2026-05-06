import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PORTALS, type PortalKey } from "@/data/portals";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/neomora-logo.png";

const PORTAL_DASHBOARDS: Record<PortalKey, string> = {
  "admin": "/admin/dashboard",
  "location-manager": "/location-manager/dashboard",
  "finance": "/finance/dashboard",
  "guardian": "/guardian/dashboard",
  "staff": "/staff/dashboard",
};

const VALID_ROLES: PortalKey[] = ["admin", "location-manager", "finance", "guardian", "staff"];

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { role?: PortalKey } => {
    const r = search.role;
    return typeof r === "string" && (VALID_ROLES as string[]).includes(r)
      ? { role: r as PortalKey }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Sign In — Neomora Club Manager" },
      { name: "description", content: "Sign in to your Neomora Club Manager portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { role } = Route.useSearch();
  const [selected, setSelected] = useState<PortalKey | null>(role ?? null);

  useEffect(() => { if (role) setSelected(role); }, [role]);

  const goToPortal = (key: PortalKey) => {
    navigate({ to: PORTAL_DASHBOARDS[key] });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="relative hidden w-2/5 flex-col justify-between overflow-hidden bg-brand p-10 text-white md:flex">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px, 60px 60px",
          }}
        />
        <Link to="/" className="relative flex h-10 items-center rounded-md bg-white/95 px-4 self-start">
          <img src={logoUrl} alt="Neomora" className="h-6 w-auto" />
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight">
            Run your academy
            <br /> like a pro club.
          </h2>
          <p className="mt-4 max-w-sm text-white/80">
            One platform for participants, sessions, fees, and family communication —
            across every location.
          </p>
        </div>
        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Neomora Club Manager</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <img src={logoUrl} alt="Neomora" className="mx-auto h-7 w-auto" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Club Manager account.</p>

          <form
            onSubmit={(e) => { e.preventDefault(); goToPortal(selected ?? "admin"); }}
            className="mt-6 space-y-4 rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@academy.com" defaultValue="demo@neomora.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</a>
              </div>
              <Input id="password" type="password" defaultValue="••••••••" />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <div className="mt-8">
            <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>Or jump straight into a demo portal</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="mb-3 text-xs text-muted-foreground">Select your role to preview the demo:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PORTALS.map((p) => {
                const isSelected = selected === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => { setSelected(p.key); goToPortal(p.key); }}
                    className={cn(
                      "flex items-center gap-3 rounded-md border bg-card px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-brand/5",
                      isSelected && "border-brand bg-brand/5 ring-2 ring-brand/30"
                    )}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
