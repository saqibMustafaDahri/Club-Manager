import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockPayments } from "@/data/mockPayments";
import { GUARDIAN_CHILD_IDS } from "@/data/guardianContext";

export const Route = createFileRoute("/guardian/payments")({
  component: GuardianPayments,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function GuardianPayments() {
  const payments = mockPayments.filter((p) => GUARDIAN_CHILD_IDS.includes(p.participantId));

  const totalFee = payments.reduce((a, p) => a + p.totalFee, 0);
  const totalPaid = payments.reduce((a, p) => a + p.paidAmount, 0);
  const balance = totalFee - totalPaid;

  const rows = payments.flatMap((p) =>
    p.invoices.map((inv) => ({
      key: `${p.id}-${inv.id}`,
      invoiceId: inv.id,
      participant: p.participantName,
      session: p.session,
      date: inv.date,
      amount: inv.amount,
      method: inv.method,
      status: "Paid" as const,
    }))
  ).sort((a, b) => b.date.localeCompare(a.date));

  const outstanding = payments.filter((p) => p.balance > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-muted-foreground">All fees and payment history across your children.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Summary label="Total Fee" value={SAR(totalFee)} />
        <Summary label="Amount Paid" value={SAR(totalPaid)} accent="success" />
        <Summary label="Balance Remaining" value={SAR(balance)} accent={balance > 0 ? "warning" : "success"} />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-4">
          <h3 className="text-base font-semibold">Payment History</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/20 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Participant</th>
              <th className="px-4 py-3 text-left">Session</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No payments yet.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.key}>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3 font-medium">{r.participant}</td>
                <td className="px-4 py-3">{r.session}</td>
                <td className="px-4 py-3 text-right font-medium">{SAR(r.amount)}</td>
                <td className="px-4 py-3">{r.method}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" title="Download receipt"
                    onClick={() => toast.success(`Receipt #${r.invoiceId} downloaded`)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {outstanding.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold">Outstanding</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {outstanding.map((p) => {
              const isOverdue = p.status === "Overdue";
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isOverdue ? "border-destructive/30 bg-destructive/5" : "border-amber-300 bg-amber-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${isOverdue ? "text-destructive" : "text-amber-600"}`} />
                      <div>
                        <p className="font-semibold">{p.participantName}</p>
                        <p className="text-sm text-muted-foreground">{p.session}</p>
                      </div>
                    </div>
                    <StatusBadge status={isOverdue ? "Overdue" : "Pending"} />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <p className="text-xs text-muted-foreground">Due {p.nextDueDate}</p>
                    <p className={`text-xl font-bold ${isOverdue ? "text-destructive" : "text-amber-700"}`}>
                      {SAR(p.balance)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Summary({ label, value, accent }: { label: string; value: string; accent?: "success" | "warning" }) {
  const tone =
    accent === "success" ? "text-success" :
    accent === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
