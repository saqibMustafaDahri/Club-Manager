import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Building2, FileClock, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";

import { locationsApi, type Location } from "@/api/locations";
import { participantsApi, type Participant } from "@/api/participants";
import { sessionsApi, type Session } from "@/api/sessions";
import { paymentsApi, type Payment } from "@/api/payments";

export const Route = createFileRoute("/location-manager/")({
  component: ManagerDashboard,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function mapStatus(s: string) {
  if (s === "DOCUMENTS_PENDING" || s === "FEE_PENDING" || s === "INQUIRY") return "Pending";
  if (s === "ACTIVE") return "Active";
  if (s === "ON_HOLD") return "On Hold";
  if (s === "COMPLETED") return "Completed";
  if (s === "WITHDRAWN") return "Withdrawn";
  return s;
}

function ManagerDashboard() {
  const [loc, setLoc] = useState<Location | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const myLocationId = user?.locationId ?? user?.location?.id ?? user?.locationAccess ?? null;

        const [allLocations, allParticipants, allSessions, allPayments] = await Promise.all([
          locationsApi.getAll(),
          participantsApi.getAll(),
          sessionsApi.getAll(),
          paymentsApi.getAll()
        ]);

        let myLoc = null;
        if (myLocationId) {
          myLoc = allLocations.find(l => l.id === myLocationId) || null;
        } else if (allLocations.length > 0) {
          myLoc = allLocations.find((l: any) => {
            if (l.users && Array.isArray(l.users)) {
              return l.users.some((u: any) => u.id === user?.id || u === user?.id);
            }
            return false;
          }) || allLocations[0];
        }

        setLoc(myLoc);

        if (myLoc) {
          const locSlugOrName = myLoc.slug || myLoc.name;
          
          const myParticipants = allParticipants.filter((p) => 
            p.locationSlug === locSlugOrName || p.locationSlug === myLoc?.id || p.locationSlug === myLoc?.name
          );
          setParticipants(myParticipants);

          const mySessions = allSessions.filter((s: any) => 
            s.locationId === myLoc?.id || 
            s.locations?.some((sl: any) => sl.locationId === myLoc?.id)
          );
          setSessions(mySessions);

          const myPayments = allPayments.filter((p: any) => 
            p.location === locSlugOrName || p.location === myLoc?.id || p.location === myLoc?.name
          );
          setPayments(myPayments);
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const active = participants.filter((p) => p.status === "ACTIVE").length;
  const pendingReg = participants.filter((p) =>
    ["INQUIRY", "DOCUMENTS_PENDING", "FEE_PENDING"].includes(p.status ?? ""),
  ).length;
  
  const outstanding = payments.reduce((a, p) => a + (p.balance ?? 0), 0);
  
  const capacity = loc?.capacity ?? 0;
  const enrolled = participants.length;
  const utilisation = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const recent = [...participants]
    .sort((a, b) => {
      const dateA = a.joinedDate || a.createdAt || "";
      const dateB = b.joinedDate || b.createdAt || "";
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>;
  }

  if (apiError) {
    return <div className="p-6 text-sm text-destructive">Error: {apiError}</div>;
  }

  return (
    <>
      <PageHeader title={loc?.name ?? "Location Dashboard"} description={today} />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Participants" value={active} icon={Users} accent="success" />
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Capacity</p>
                <p className="mt-2 text-3xl font-bold">{enrolled} <span className="text-base font-medium text-muted-foreground">/ {capacity}</span></p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-brand" style={{ width: `${utilisation}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{utilisation}% full</p>
            </div>
          </div>
          <StatCard label="Pending Registrations" value={pendingReg} icon={FileClock} accent="warning" />
          <StatCard label="Outstanding Fees" value={SAR(outstanding)} icon={Wallet} accent="danger" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Upcoming Sessions" link="/location-manager/sessions">
            <ul className="divide-y">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.startDate ? new Date(s.startDate).toLocaleDateString() : "—"} → {s.endDate ? new Date(s.endDate).toLocaleDateString() : "—"}</p>
                  </div>
                  <StatusBadge status={s.status === "OPEN" ? "Active" : s.status === "CLOSED" ? "Completed" : "Scheduled"} />
                </li>
              ))}
              {sessions.length === 0 && <li className="px-5 py-6 text-sm text-muted-foreground">No upcoming sessions.</li>}
            </ul>
          </Panel>

          <Panel title="Recent Registrations" link="/location-manager/participants">
            <ul className="divide-y">
              {recent.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{p.firstNameEn} {p.lastNameEn}</p>
                    <p className="text-xs text-muted-foreground">{p.uniqueId ?? "—"} • Joined {p.joinedDate ? new Date(p.joinedDate).toLocaleDateString() : "—"}</p>
                  </div>
                  <StatusBadge status={mapStatus(p.status ?? "Pending")} />
                </li>
              ))}
              {recent.length === 0 && <li className="px-5 py-6 text-sm text-muted-foreground">No registrations yet.</li>}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Panel({ title, link, children }: { title: string; link: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <Link to={link} className="text-xs font-medium text-primary hover:underline">View All</Link>
      </div>
      {children}
    </div>
  );
}

