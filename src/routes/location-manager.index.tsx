import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { AlertItem } from "@/components/AlertItem";
import { StatusBadge } from "@/components/StatusBadge";
import { Users, Calendar, DollarSign, UserCheck } from "lucide-react";
import { participants } from "@/data/participants";
import { sessions } from "@/data/sessions";
import { alerts } from "@/data/alerts";

export const Route = createFileRoute("/location-manager/")({
  component: ManagerDashboard,
});

const LOCATION = "Dublin North";

function ManagerDashboard() {
  const local = participants.filter((p) => p.location === LOCATION);
  const todaySessions = sessions.filter((s) => s.location === LOCATION);
  return (
    <>
      <PageHeader
        title="Dublin North"
        breadcrumbs={[{ label: "Location Manager", to: "/location-manager" }, { label: "Dashboard" }]}
        description="Your location at a glance."
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active participants" value={local.filter((p) => p.status === "Active").length} subLabel="+5 this month" trend="up" icon={Users} accent="brand" />
          <StatCard label="Sessions this week" value={todaySessions.length} subLabel="3 today" trend="neutral" icon={Calendar} accent="primary" />
          <StatCard label="Monthly revenue" value="€38,400" subLabel="+6% vs last month" trend="up" icon={DollarSign} accent="success" />
          <StatCard label="Coach attendance" value="98%" subLabel="Past 30 days" trend="up" icon={UserCheck} accent="success" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
            <h2 className="text-base font-semibold">Upcoming sessions</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3">When</th>
                    <th className="pb-3">Programme</th>
                    <th className="pb-3">Coach</th>
                    <th className="pb-3">Capacity</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySessions.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="py-3">{s.date} · {s.startTime}</td>
                      <td className="py-3 font-medium">{s.programme}</td>
                      <td className="py-3 text-muted-foreground">{s.coach}</td>
                      <td className="py-3">{s.enrolled}/{s.capacity}</td>
                      <td className="py-3"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">Alerts</h2>
            <div className="mt-4 space-y-3">{alerts.map((a) => <AlertItem key={a.id} alert={a} />)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
