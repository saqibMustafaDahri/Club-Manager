import { createFileRoute } from "@tanstack/react-router";
import { Receipt, Wallet, AlertCircle, Percent, Clock, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { mockPayments } from "@/data/mockPayments";

export const Route = createFileRoute("/finance/")({
  component: FinanceDashboard,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;
const today = new Date();
const todayStr = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function FinanceDashboard() {
  const totalInvoiced = mockPayments.reduce((a, p) => a + p.totalFee, 0);
  const totalCollected = mockPayments.reduce((a, p) => a + p.paidAmount, 0);
  const totalOutstanding = mockPayments.reduce((a, p) => a + p.balance, 0);
  const collectionRate = totalInvoiced ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const overdue = mockPayments.filter((p) => p.status === "Overdue");
  const dueThisWeek = mockPayments.filter((p) => {
    if (p.nextDueDate === "—") return false;
    const d = new Date(p.nextDueDate);
    const diff = daysBetween(d, today);
    return diff >= 0 && diff <= 7;
  });

  const recent = [...mockPayments]
    .filter((p) => p.lastPaymentDate !== "—")
    .sort((a, b) => b.lastPaymentDate.localeCompare(a.lastPaymentDate))
    .slice(0, 6);

  const rateAccent: "success" | "warning" | "danger" =
    collectionRate >= 80 ? "success" : collectionRate >= 60 ? "warning" : "danger";

  return (
    <>
      <PageHeader title="Finance Dashboard" subtitle={todayStr} />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Invoiced" value={SAR(totalInvoiced)} icon={Receipt} accent="primary" />
          <StatCard label="Total Collected" value={SAR(totalCollected)} icon={Wallet} accent="success" />
          <StatCard label="Outstanding Balance" value={SAR(totalOutstanding)} icon={AlertCircle} accent="danger" />
          <StatCard label="Collection Rate" value={`${collectionRate}%`} icon={Percent} accent={rateAccent} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard label="Overdue Payments" value={overdue.length} icon={Clock} accent="danger" />
          <StatCard label="Payments Due This Week" value={dueThisWeek.length} icon={CalendarDays} accent="warning" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Overdue Accounts</h3>
            {overdue.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue accounts.</p>
            ) : (
              <ul className="divide-y">
                {overdue.map((p) => {
                  const d = p.nextDueDate !== "—" ? Math.max(0, daysBetween(today, new Date(p.nextDueDate))) : 0;
                  return (
                    <li key={p.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{p.participantName}</p>
                        <p className="text-xs text-muted-foreground">{p.session} • {d} days overdue</p>
                      </div>
                      <span className="text-sm font-semibold text-destructive">{SAR(p.balance)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold">Recent Payments</h3>
            <ul className="divide-y">
              {recent.map((p) => {
                const last = p.invoices[p.invoices.length - 1];
                return (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{p.participantName}</p>
                      <p className="text-xs text-muted-foreground">{last?.method ?? "—"} • {p.lastPaymentDate}</p>
                    </div>
                    <span className="text-sm font-semibold">{SAR(last?.amount ?? p.paidAmount)}</span>
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
