import { ChevronRight, Home } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Crumb { label: string; to?: string }

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

const PORTAL_LABEL: Record<string, string> = {
  admin: "Super Admin",
  "location-manager": "Location Manager",
  finance: "Finance",
  guardian: "Guardian",
  staff: "Staff",
};

const SEGMENT_LABEL: Record<string, string> = {
  locations: "Locations",
  sessions: "Sessions",
  participants: "Participants",
  fees: "Fees & Payments",
  reports: "Reports",
  access: "Access Control",
  settings: "Settings",
  collection: "Fee Collection",
  plans: "Payment Plans",
  invoices: "Invoices",
  reminders: "Reminders",
  payments: "Payments",
  documents: "Documents",
  participant: "Participant",
  squad: "My Squad",
  attendance: "Attendance",
  waitlist: "Waitlist",
  communications: "Communications",
  dashboard: "Dashboard",
};

const titleize = (s: string) =>
  SEGMENT_LABEL[s] ?? s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const isDashboardPath = (segments: string[]) =>
  segments.length === 1 || (segments.length === 2 && segments[1] === "dashboard");

function autoCrumbs(pathname: string, title: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];
  if (isDashboardPath(segments)) return [];

  const portalKey = segments[0];
  const portalLabel = PORTAL_LABEL[portalKey];
  if (!portalLabel) return [];

  const crumbs: Crumb[] = [{ label: portalLabel, to: `/${portalKey}` }];

  // Middle segments (everything between portal and last)
  for (let i = 1; i < segments.length - 1; i++) {
    crumbs.push({ label: titleize(segments[i]) });
  }

  // Last segment uses the page title for context
  const last = segments[segments.length - 1];
  crumbs.push({ label: title || titleize(last) });

  return crumbs;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = breadcrumbs ?? autoCrumbs(pathname, title);

  return (
    <div className="flex flex-col gap-4 border-b bg-card px-8 py-6 md:flex-row md:items-end md:justify-between">
      <div>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/" className="flex items-center hover:text-foreground"><Home className="h-3 w-3" /></Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
                ) : (
                  <span className="text-foreground/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
