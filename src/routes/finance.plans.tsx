import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, CalendarDays, Coins } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockPayments, type MockPayment, type PaymentPlan } from "@/data/mockPayments";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/plans")({
  component: PlansPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function PlansPage() {
  const [planFilter, setPlanFilter] = useState<string>("all");

  const byPlan = (plan: PaymentPlan) => mockPayments.filter((p) => p.plan === plan);

  const fullPlan = byPlan("Full");
  const monthly = byPlan("Monthly");
  const seasonal = byPlan("Seasonal");

  const fullAvg = fullPlan.length ? Math.round(fullPlan.reduce((a, p) => a + p.totalFee, 0) / fullPlan.length) : 0;
  const monthlyExpected = monthly.reduce((a, p) => a + (p.totalFee - p.paidAmount), 0);
  const nextSeasonalDate = seasonal
    .map((p) => p.nextDueDate)
    .filter((d) => d !== "—")
    .sort()[0] ?? "—";

  const filtered = useMemo(
    () => mockPayments.filter((p) => planFilter === "all" || p.plan === planFilter),
    [planFilter],
  );

  const installmentAmount = (p: MockPayment) => {
    if (p.plan === "Full") return p.balance;
    if (p.plan === "Monthly") return Math.round(p.totalFee / 4);
    return Math.round(p.totalFee / 2);
  };

  const columns: Column<MockPayment>[] = [
    { key: "participantName", header: "Participant", sortable: true },
    { key: "plan", header: "Plan" },
    { key: "totalFee", header: "Total Fee", render: (r) => SAR(r.totalFee) },
    { key: "next", header: "Next Instalment", render: (r) => SAR(installmentAmount(r)) },
    { key: "nextDueDate", header: "Next Due" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status === "Partial" ? "Pending" : r.status} /> },
  ];

  const filters = (
    <Select value={planFilter} onValueChange={setPlanFilter}>
      <SelectTrigger className="w-[150px]"><SelectValue placeholder="Plan" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Plans</SelectItem>
        <SelectItem value="Full">Full</SelectItem>
        <SelectItem value="Monthly">Monthly</SelectItem>
        <SelectItem value="Seasonal">Seasonal</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <>
      <PageHeader title="Payment Plans" />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard
            title="Full Payment"
            subtitle="One-time"
            icon={Coins}
            metric={`${fullPlan.length} participants`}
            secondary={`Avg fee ${SAR(fullAvg)}`}
            onClick={() => setPlanFilter("Full")}
            active={planFilter === "Full"}
          />
          <PlanCard
            title="Monthly Instalments"
            subtitle="Recurring"
            icon={CalendarClock}
            metric={`${monthly.length} participants`}
            secondary={`Expected ${SAR(monthlyExpected)}`}
            onClick={() => setPlanFilter("Monthly")}
            active={planFilter === "Monthly"}
          />
          <PlanCard
            title="Seasonal Payments"
            subtitle="Per season"
            icon={CalendarDays}
            metric={`${seasonal.length} participants`}
            secondary={`Next batch ${nextSeasonalDate}`}
            onClick={() => setPlanFilter("Seasonal")}
            active={planFilter === "Seasonal"}
          />
        </div>

        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["participantName"]}
          searchPlaceholder="Search participants…"
          filters={filters}
        />
      </div>
    </>
  );
}

function PlanCard({
  title, subtitle, icon: Icon, metric, secondary, onClick, active,
}: {
  title: string; subtitle: string; icon: typeof Coins;
  metric: string; secondary: string; onClick: () => void; active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md",
        active && "ring-2 ring-brand"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{subtitle}</p>
          <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">{metric}</p>
      <p className="mt-1 text-xs text-muted-foreground">{secondary}</p>
    </button>
  );
}
