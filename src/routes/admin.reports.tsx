import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { participants } from "@/data/participants";
import { locations } from "@/data/locations";
import { invoices } from "@/data/finance";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const totalRevenue = locations.reduce((s, l) => s + l.monthlyRevenue, 0);
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status === "Pending" || i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  const byProgramme = participants.reduce<Record<string, number>>((acc, p) => {
    acc[p.programme] = (acc[p.programme] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Reports"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Reports" }]}
        description="Headline metrics, retention, and revenue trends."
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Monthly recurring" value={`€${totalRevenue.toLocaleString()}`} subLabel="+8.4% vs last month" trend="up" icon={DollarSign} accent="brand" />
          <StatCard label="Collected this month" value={`€${collected.toLocaleString()}`} subLabel="92% collection rate" trend="up" icon={TrendingUp} accent="success" />
          <StatCard label="Outstanding" value={`€${outstanding.toLocaleString()}`} subLabel="6 invoices pending" trend="down" icon={Activity} accent="warning" />
          <StatCard label="Net new this month" value="+38" subLabel="Across all locations" trend="up" icon={Users} accent="primary" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">Participants by programme</h2>
            <div className="mt-4 space-y-3">
              {Object.entries(byProgramme).map(([prog, count]) => {
                const pct = (count / participants.length) * 100;
                return (
                  <div key={prog}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{prog}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">Revenue by location</h2>
            <div className="mt-4 space-y-3">
              {locations.map((l) => {
                const max = Math.max(...locations.map((x) => x.monthlyRevenue));
                const pct = max ? (l.monthlyRevenue / max) * 100 : 0;
                return (
                  <div key={l.id}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-muted-foreground">€{l.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
