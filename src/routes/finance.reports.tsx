import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { DollarSign, TrendingUp, Activity, Users } from "lucide-react";
import { invoices } from "@/data/finance";
import { locations } from "@/data/locations";

export const Route = createFileRoute("/finance/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "Pending" || i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const refunded = invoices.filter((i) => i.status === "Refunded").reduce((s, i) => s + i.amount, 0);

  const byLocation = invoices.reduce<Record<string, number>>((acc, i) => {
    if (i.status === "Paid") acc[i.location] = (acc[i.location] ?? 0) + i.amount;
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Financial reports" breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Reports" }]} description="Revenue, collections, and AR aging." />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Collected" value={`€${collected.toLocaleString()}`} subLabel="MTD" trend="up" icon={DollarSign} accent="success" />
          <StatCard label="Outstanding" value={`€${pending.toLocaleString()}`} subLabel="Across all invoices" trend="neutral" icon={TrendingUp} accent="warning" />
          <StatCard label="Refunded" value={`€${refunded.toLocaleString()}`} subLabel="MTD" trend="neutral" icon={Activity} accent="primary" />
          <StatCard label="Active payers" value={new Set(invoices.map((i) => i.guardian)).size} subLabel="Unique guardians" trend="up" icon={Users} accent="brand" />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold">Collected by location</h2>
          <div className="mt-4 space-y-3">
            {locations.filter((l) => byLocation[l.name]).map((l) => {
              const max = Math.max(...Object.values(byLocation));
              const v = byLocation[l.name] ?? 0;
              const pct = max ? (v / max) * 100 : 0;
              return (
                <div key={l.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-muted-foreground">€{v.toLocaleString()}</span>
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
    </>
  );
}
