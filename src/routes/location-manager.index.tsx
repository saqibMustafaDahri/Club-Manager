import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Building2, FileClock, Wallet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockLocations } from "@/data/mockLocations";
import { mockParticipants } from "@/data/mockParticipants";
import { mockSessions } from "@/data/mockSessions";
import { mockPayments } from "@/data/mockPayments";

export const Route = createFileRoute("/location-manager/")({
  component: ManagerDashboard,
});

const RIYADH_ID = "loc-riy";
const RIYADH_NAME = "Riyadh Academy";
const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function mapStatus(s: string) {
  if (s === "Documents Pending" || s === "Fee Pending" || s === "Inquiry") return "Pending";
  return s;
}

function ManagerDashboard() {
  const loc = mockLocations.find((l) => l.id === RIYADH_ID)!;
  const participants = mockParticipants.filter((p) => p.location === RIYADH_NAME);
  const sessions = mockSessions.filter((s) => s.locationId === RIYADH_ID);
  const payments = mockPayments.filter((p) => p.location === RIYADH_NAME);

  const active = participants.filter((p) => p.status === "Active").length;
  const pendingReg = participants.filter((p) =>
    ["Inquiry", "Documents Pending", "Fee Pending"].includes(p.status),
  ).length;
  const outstanding = payments.reduce((a, p) => a + p.balance, 0);
  const utilisation = Math.round((loc.enrolled / loc.capacity) * 100);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const recent = [...participants]
    .sort((a, b) => b.joinedDate.localeCompare(a.joinedDate))
    .slice(0, 5);

  return (
    <>
      <PageHeader title={loc.name} description={today} />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Participants" value={active} icon={Users} accent="success" />
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Capacity</p>
                <p className="mt-2 text-3xl font-bold">{loc.enrolled} <span className="text-base font-medium text-muted-foreground">/ {loc.capacity}</span></p>
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
                    <p className="text-xs text-muted-foreground">{s.startDate} → {s.endDate}</p>
                  </div>
                  <StatusBadge status={s.status === "Open" ? "Active" : s.status === "Closed" ? "Completed" : "Scheduled"} />
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
                    <p className="text-sm font-medium">{p.fullName}</p>
                    <p className="text-xs text-muted-foreground">{p.uniqueId} • Joined {p.joinedDate}</p>
                  </div>
                  <StatusBadge status={mapStatus(p.status)} />
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
