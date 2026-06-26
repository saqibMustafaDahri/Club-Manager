import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users, UserCheck, FileClock, FileWarning, Building2, CalendarDays,
  Percent, Wallet, UserPlus, CreditCard, FileText, Activity,
  TrendingUp, AlertCircle, RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { reportsApi, type ReportingDashboard } from "@/api/reports";
import { locationsApi, type Location } from "@/api/locations";
import { sessionsApi, type Session } from "@/api/sessions";
import { paymentsApi, type Payment } from "@/api/payments";
import { participantsApi, type Participant } from "@/api/participants";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const SAR = (n: number) =>
  `SAR ${n.toLocaleString("en-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

function timeAgo(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 h-3 w-1/2 rounded bg-muted" />
      <div className="h-8 w-3/4 rounded bg-muted" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const cls =
    s === "ACTIVE" || s === "OPEN"
      ? "bg-success/10 text-success"
      : s === "UPCOMING"
        ? "bg-info/10 text-info"
        : "bg-muted text-muted-foreground";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", cls)}>
      {status}
    </span>
  );
}

function AdminDashboard() {
  const [locFilter, setLocFilter] = useState<string>("all");

  // Data state
  const [report, setReport] = useState<ReportingDashboard | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const [errors, setErrors] = useState<string[]>([]);

  const fetchAll = async () => {
    setLoading(true);
    setErrors([]);
    const errs: string[] = [];

    const safe = async<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> => {
      try { return await fn(); }
      catch (e) {
        errs.push(`${label}: ${e instanceof Error ? e.message : "failed"}`);
      return fallback;
      }
    };

      const [rpt, locs, sess, pays, parts] = await Promise.all([
      safe("Report",       () => reportsApi.getDashboard(),      null as any),
      safe("Locations",    () => locationsApi.getAll(),          []),
      safe("Sessions",     () => sessionsApi.getAll(),           []),
      safe("Payments",     () => paymentsApi.getAll(1, 100),     []),
      safe("Participants", () => participantsApi.getAll(),       []),
      ]);

      setReport(rpt);
      setLocations(locs);
      setSessions(sess);
      setPayments(pays);
      setParticipants(parts);
      setErrors(errs);
      setLastRefresh(new Date());
      setLoading(false);
  };

  useEffect(() => {fetchAll(); }, []);

      // ── Derived stats ────────────────────────────────────────────────────────────
      const filteredPayments =
      locFilter === "all"
      ? payments
      : payments.filter((p) => p.location === locFilter);

      const filteredParticipants =
      locFilter === "all"
      ? participants
      : participants.filter(
          (p) => (p as any).locationSlug === locFilter || (p as any).location?.name === locFilter
      );

      // Total = every participant regardless of status (not just active)
      const totalParticipants = filteredParticipants.length;
      const activeEnrolments = report?.activeParticipants ?? 0;
      const pendingRegistrations = report?.pendingRegistrations ?? 0;
      const pendingDocs = report?.pendingDocuments ?? 0;
      const newInquiries = report?.newInquiries ?? 0;

      const totalLocations = locations.length;
  const activeLocations = locations.filter((l) => l.status === "Active").length;
  const openSessions = sessions.filter((s) => s.status === "OPEN").length;
      const totalSessions = sessions.length;

  const totalFee = filteredPayments.reduce((a, p) => a + ((p as any).totalFee ?? 0), 0);
  const paidAmount = filteredPayments.reduce((a, p) => a + (p.paidAmount ?? 0), 0);
  const outstanding = filteredPayments.reduce((a, p) => a + (p.balance ?? 0), 0);
      const collectionRate = totalFee === 0 ? 0 : Math.round((paidAmount / totalFee) * 100);

      const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

      // Recent participants sorted by createdAt
      const recentParticipants = [...participants]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 6);

      // Capacity utilisation from report
      const capacityItems = report?.capacityUtilisation ?? [];

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
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAll}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
            </>
          }
        />

        <div className="space-y-6 p-6">

          {/* ── Error banner ─────────────────────────────────────────────────── */}
          {errors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Some data failed to load — other sections may still show correctly.
                <button onClick={fetchAll} className="ml-auto underline">Retry</button>
              </div>
              <ul className="mt-1 list-inside list-disc pl-1 text-xs opacity-80">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* ── Last refresh note ─────────────────────────────────────────────── */}
          {!loading && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}

          {/* ── Row 1: Participant stats ──────────────────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard label="Total Participants" value={totalParticipants} icon={Users} accent="brand" />
                <StatCard label="Active Enrolments" value={activeEnrolments} icon={UserCheck} accent="success" />
                <StatCard label="Pending Registrations" value={pendingRegistrations} icon={FileClock} accent="warning" />
                <StatCard label="Pending Documents" value={pendingDocs} icon={FileWarning} accent="danger" />
              </>
            )}
          </div>

          {/* ── Row 2: Operations & Finance ──────────────────────────────────── */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard label="Active Locations" value={`${activeLocations} / ${totalLocations}`} icon={Building2} accent="brand" />
                <StatCard label="Open Sessions" value={`${openSessions} / ${totalSessions}`} icon={CalendarDays} accent="primary" />
                <StatCard label="Fee Collection Rate" value={`${collectionRate}%`} icon={Percent} accent="success" />
                <StatCard label="Outstanding Balance" value={SAR(outstanding)} icon={Wallet} accent="danger" />
              </>
            )}
          </div>

          {/* ── Row 3: New inquiries + paid amount quick stats ────────────────── */}
          <div className="grid gap-4 md:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard label="New Inquiries" value={newInquiries} icon={UserPlus} accent="primary" />
                <StatCard label="Total Collected" value={SAR(paidAmount)} icon={TrendingUp} accent="success" />
                <StatCard label="Pending Fees" value={report?.pendingFees ?? 0} icon={CreditCard} accent="warning" />
              </>
            )}
          </div>

          {/* ── Row 4: Capacity Utilisation + Recent Participants ─────────────── */}
          <div className="grid gap-4 lg:grid-cols-2">

            {/* Capacity Utilisation */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-base font-semibold">Location Capacity</h2>
                <Link to="/admin/locations" className="text-xs font-medium text-primary hover:underline">
                  Manage
                </Link>
              </div>
              {loading ? (
                <div className="space-y-3 p-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse space-y-1">
                      <div className="h-3 w-1/3 rounded bg-muted" />
                      <div className="h-2 w-full rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              ) : capacityItems.length > 0 ? (
                <ul className="divide-y">
                  {capacityItems.map((c) => {
                    const pct = Math.min(100, Math.round(c.utilizationPercent));
                    const color =
                      pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-warning" : "bg-success";
                    return (
                      <li key={c.locationId} className="px-5 py-3">
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="font-medium">{c.locationName}</span>
                          <span className="text-muted-foreground">
                            {c.used} / {c.total} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className={cn("h-2 rounded-full transition-all", color)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No capacity data available.
                </div>
              )}
            </div>

            {/* Recent Participants */}
            <div className="rounded-xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-base font-semibold">Recent Participants</h2>
                <Link to="/admin/participants" className="text-xs font-medium text-primary hover:underline">
                  View All
                </Link>
              </div>
              {loading ? (
                <div className="divide-y">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex animate-pulse items-center gap-3 px-5 py-3">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-1/2 rounded bg-muted" />
                        <div className="h-2 w-1/3 rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentParticipants.length > 0 ? (
                <ul className="divide-y">
                  {recentParticipants.map((p) => {
                    const name = `${p.firstNameEn} ${p.lastNameEn}`.trim() || "—";
                    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p.locationSlug} · {p.status ?? "—"}
                          </p>
                        </div>
                        {p.createdAt && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {timeAgo(p.createdAt)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No participants found.
                </div>
              )}
            </div>
          </div>

          {/* ── Row 5: Sessions list ──────────────────────────────────────────── */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-base font-semibold">Active Sessions</h2>
              <Link to="/admin/sessions" className="text-xs font-medium text-primary hover:underline">
                Manage
              </Link>
            </div>
            {loading ? (
              <div className="divide-y">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-3">
                    <div className="h-3 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/4 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : sessions.filter((s) => s.status === "OPEN").length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-5 py-2 text-left font-medium text-muted-foreground">Session</th>
                      <th className="px-5 py-2 text-left font-medium text-muted-foreground">Dates</th>
                      <th className="px-5 py-2 text-left font-medium text-muted-foreground">Enrolments</th>
                      <th className="px-5 py-2 text-left font-medium text-muted-foreground">Fee</th>
                      <th className="px-5 py-2 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sessions
                      .filter((s) => s.status === "OPEN")
                      .slice(0, 6)
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3 font-medium">{s.name}</td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {new Date(s.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            {" – "}
                            {new Date(s.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {s.enrolledCount ?? "—"}
                            {s.capacity ? ` / ${s.capacity}` : ""}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground">
                            SAR {(s.baseFee ?? 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3">
                            <StatusBadge status={s.status} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No open sessions at this time.
              </div>
            )}
          </div>

          {/* ── Row 6: Recent Payments ────────────────────────────────────────── */}
          {/* <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-base font-semibold">Recent Payments</h2>
            <Link to="/admin/fees" className="text-xs font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-5 py-3">
                  <div className="h-3 w-1/4 rounded bg-muted" />
                  <div className="h-3 w-1/4 rounded bg-muted" />
                  <div className="h-3 w-1/6 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    <th className="px-5 py-2 text-left font-medium text-muted-foreground">Participant</th>
                    <th className="px-5 py-2 text-left font-medium text-muted-foreground">Location</th>
                    <th className="px-5 py-2 text-left font-medium text-muted-foreground">Paid</th>
                    <th className="px-5 py-2 text-left font-medium text-muted-foreground">Balance</th>
                    <th className="px-5 py-2 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium">{p.participantName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.location}</td>
                      <td className="px-5 py-3 text-success font-medium">SAR {(p.paidAmount ?? 0).toLocaleString()}</td>
                      <td className="px-5 py-3 text-destructive font-medium">SAR {(p.balance ?? 0).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No payment records found.
            </div>
          )}
        </div> */}

        </div>
      </>
      );
}
