import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DollarSign, TrendingUp, AlertCircle, Undo2 } from "lucide-react";
import { invoices, refunds } from "@/data/finance";

export const Route = createFileRoute("/finance/")({
  component: FinanceDashboard,
});

function FinanceDashboard() {
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const refundsPending = refunds.filter((r) => r.status === "Pending").length;

  return (
    <>
      <PageHeader
        title="Finance"
        breadcrumbs={[{ label: "Finance", to: "/finance" }, { label: "Dashboard" }]}
        description="Cashflow, collections, and refund queue."
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Collected" value={`€${collected.toLocaleString()}`} subLabel="Past 30 days" trend="up" icon={DollarSign} accent="success" />
          <StatCard label="Pending" value={`€${pending.toLocaleString()}`} subLabel="Awaiting payment" trend="neutral" icon={TrendingUp} accent="warning" />
          <StatCard label="Overdue" value={`€${overdue.toLocaleString()}`} subLabel="Action required" trend="down" icon={AlertCircle} accent="danger" />
          <StatCard label="Refunds pending" value={refundsPending} subLabel="Awaiting approval" trend="neutral" icon={Undo2} accent="primary" />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold">Recent invoices</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Guardian</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Due</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 8).map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="py-3 font-medium">{i.id}</td>
                    <td className="py-3">{i.guardian}</td>
                    <td className="py-3 text-muted-foreground">{i.location}</td>
                    <td className="py-3">{i.dueAt}</td>
                    <td className="py-3 font-semibold">€{i.amount}</td>
                    <td className="py-3"><StatusBadge status={i.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
