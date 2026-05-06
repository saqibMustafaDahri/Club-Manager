import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users, UserCheck, FileClock, FileWarning, Building2, CalendarDays, Percent, Wallet,
  Info, AlertTriangle, AlertCircle, CheckCircle2, UserPlus, CreditCard, FileText, Activity,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockParticipants } from "@/data/mockParticipants";
import { mockLocations } from "@/data/mockLocations";
import { mockSessions } from "@/data/mockSessions";
import { mockPayments } from "@/data/mockPayments";
import { mockAlerts, type AlertSeverity } from "@/data/mockAlerts";
import { mockActivity, type ActivityType } from "@/data/mockActivity";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const alertConfig: Record<AlertSeverity, { Icon: typeof Info; bg: string; text: string; ring: string }> = {
  info: { Icon: Info, bg: "bg-info/10", text: "text-info", ring: "ring-info/20" },
  warning: { Icon: AlertTriangle, bg: "bg-warning/10", text: "text-warning", ring: "ring-warning/20" },
  error: { Icon: AlertCircle, bg: "bg-destructive/10", text: "text-destructive", ring: "ring-destructive/20" },
};

const activityIcon: Record<ActivityType, typeof UserPlus> = {
  registration: UserPlus,
  payment: CreditCard,
  document: FileText,
  status: Activity,
};

function timeAgo(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

function AdminDashboard() {
  const [locFilter, setLocFilter] = useState<string>("all");

  const filterByLoc = <T extends { location?: string }>(rows: T[]) =>
    locFilter === "all" ? rows : rows.filter((r) => r.location === locFilter);

  const participants = filterByLoc(mockParticipants);
  const payments = filterByLoc(mockPayments);

  const totalParticipants = participants.length;
  const activeEnrolments = participants.filter((p) => p.status === "Active").length;
  const pendingRegistrations = participants.filter((p) =>
    ["Inquiry", "Documents Pending", "Fee Pending"].includes(p.status),
  ).length;
  const pendingDocs = participants.reduce(
    (acc, p) => acc + p.documents.filter((d) => d.status !== "Uploaded").length,
    0,
  );

  const totalLocations = mockLocations.length;
  const openSessions = mockSessions.filter((s) => s.status === "Open").length;

  const totalFee = payments.reduce((a, p) => a + p.totalFee, 0);
  const paidAmount = payments.reduce((a, p) => a + p.paidAmount, 0);
  const collectionRate = totalFee === 0 ? 0 : Math.round((paidAmount / totalFee) * 100);
  const outstanding = payments.reduce((a, p) => a + p.balance, 0);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved).slice(0, 5);
  const recentActivity = mockActivity.slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={today}
        actions={
          <>
            <Select value={locFilter} onValueChange={setLocFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {mockLocations.map((l) => (
                  <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Export Report</Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Participants" value={totalParticipants} icon={Users} accent="brand" />
          <StatCard label="Active Enrolments" value={activeEnrolments} icon={UserCheck} accent="success" />
          <StatCard label="Pending Registrations" value={pendingRegistrations} icon={FileClock} accent="warning" />
          <StatCard label="Pending Documents" value={pendingDocs} icon={FileWarning} accent="danger" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Locations" value={totalLocations} icon={Building2} accent="brand" />
          <StatCard label="Open Sessions" value={openSessions} icon={CalendarDays} accent="primary" />
          <StatCard label="Fee Collection Rate" value={`${collectionRate}%`} icon={Percent} accent="success" />
          <StatCard label="Outstanding Balance" value={SAR(outstanding)} icon={Wallet} accent="danger" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Alerts */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-base font-semibold">Alerts & Notifications</h2>
              <Link to="/admin" className="text-xs font-medium text-primary hover:underline">View All</Link>
            </div>
            <ul className="divide-y">
              {unresolvedAlerts.map((a) => {
                const c = alertConfig[a.severity];
                return (
                  <li key={a.id} className="flex gap-3 px-5 py-3">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset", c.bg, c.ring)}>
                      <c.Icon className={cn("h-4 w-4", c.text)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{a.message}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(a.timestamp)}</p>
                    </div>
                  </li>
                );
              })}
              {unresolvedAlerts.length === 0 && (
                <li className="flex items-center gap-2 px-5 py-6 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" /> All clear — no pending alerts.
                </li>
              )}
            </ul>
          </div>

          {/* Activity */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-base font-semibold">Recent Activity</h2>
              <Link to="/admin" className="text-xs font-medium text-primary hover:underline">View All</Link>
            </div>
            <ul className="divide-y">
              {recentActivity.map((a) => {
                const Icon = activityIcon[a.type];
                return (
                  <li key={a.id} className="flex gap-3 px-5 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{a.action}</span> — {a.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(a.timestamp)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
