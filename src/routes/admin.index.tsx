import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { AlertItem } from "@/components/AlertItem";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Users, Building2, DollarSign, TrendingUp } from "lucide-react";
import { participants } from "@/data/participants";
import { locations } from "@/data/locations";
import { invoices } from "@/data/finance";
import { alerts } from "@/data/alerts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const activeParticipants = participants.filter((p) => p.status === "Active").length;
  const monthlyRevenue = locations.reduce((s, l) => s + l.monthlyRevenue, 0);
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Dashboard" }]}
        description="Network-wide overview across all locations."
        actions={<><Button variant="outline">Export</Button><Button>New report</Button></>}
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Active participants" value={activeParticipants.toLocaleString()} subLabel="+12% vs last month" trend="up" icon={Users} accent="brand" />
          <StatCard label="Active locations" value={locations.filter((l) => l.status === "Active").length} subLabel="+1 this quarter" trend="up" icon={Building2} accent="primary" />
          <StatCard label="Monthly revenue" value={`€${monthlyRevenue.toLocaleString()}`} subLabel="+8.4% vs last month" trend="up" icon={DollarSign} accent="success" />
          <StatCard label="Overdue invoices" value={overdueCount} subLabel="Requires attention" trend="down" icon={TrendingUp} accent="danger" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Top locations by revenue</h2>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Manager</th>
                    <th className="pb-3">Participants</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.slice(0, 6).map((l) => (
                    <tr key={l.id} className="border-t">
                      <td className="py-3 font-medium">{l.name}</td>
                      <td className="py-3 text-muted-foreground">{l.manager}</td>
                      <td className="py-3">{l.participants}</td>
                      <td className="py-3"><StatusBadge status={l.status} /></td>
                      <td className="py-3 text-right font-semibold">€{l.monthlyRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">Alerts</h2>
            <div className="mt-4 space-y-3">
              {alerts.map((a) => <AlertItem key={a.id} alert={a} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
