import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockPayments } from "@/data/mockPayments";
import { GUARDIAN_CHILD_IDS } from "@/data/guardianContext";
import {
  isPaid,
  getOutstandingInvoices,
  getPaidEntries,
  useGuardianPaymentsStore,
} from "@/data/guardianPaymentsStore";

export const Route = createFileRoute("/guardian/payments")({
  component: GuardianPayments,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const synthInvoiceId = (paymentId: string) =>
  `NMR-INV-${paymentId.replace(/[^0-9]/g, "").padStart(4, "0")}`;

function GuardianPayments() {
  // subscribe to payment store mutations so the page updates after success
  useGuardianPaymentsStore();

  const payments = mockPayments.filter((p) => GUARDIAN_CHILD_IDS.includes(p.participantId));

  const totalFee = payments.reduce((a, p) => a + p.totalFee, 0);
  const sessionPaid = getPaidEntries().reduce((a, e) => a + e.amount, 0);
  const totalPaid = payments.reduce((a, p) => a + p.paidAmount, 0) + sessionPaid;
  const balance = Math.max(0, totalFee - totalPaid);

  // Historical paid invoices from mock data
  const historicalRows = payments.flatMap((p) =>
    p.invoices.map((inv) => ({
      key: `${p.id}-${inv.id}`,
      invoiceId: inv.id,
      participant: p.participantName,
      session: p.session,
      date: inv.date,
      amount: inv.amount,
      method: inv.method as string,
      status: "Paid" as const,
    }))
  );

  // Newly-paid invoices from this session
  const sessionRows = getPaidEntries().map((e) => ({
    key: `session-${e.invoiceId}`,
    invoiceId: e.invoiceId,
    participant: e.participantName,
    session: e.session,
    date: e.date.slice(0, 10),
    amount: e.amount,
    method: e.method,
    status: "Paid" as const,
  }));

  const rows = [...historicalRows, ...sessionRows].sort((a, b) => b.date.localeCompare(a.date));

  const outstanding = getOutstandingInvoices();
  const outstandingByPaymentId = new Map(outstanding.map((o) => [o.paymentId, o]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-muted-foreground">All fees and payment history across your children.</p>
      </div>

      {balance > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Pay Outstanding Balance</p>
              <p className="text-sm text-amber-800">
                You have an outstanding balance of <span className="font-semibold">{SAR(balance)}</span>.
                Pay now to avoid service interruption.
              </p>
            </div>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/guardian/payments/pay-all">Pay Now</Link>
          </Button>
        </div>
      )}

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
              <tr key={r.key} className="hover:bg-gray-50">
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
            {payments
              .filter((p) => p.balance > 0 && !isPaid(p.id) && outstandingByPaymentId.has(p.id))
              .map((p) => {
                const isOverdue = p.status === "Overdue";
                const inv = outstandingByPaymentId.get(p.id)!;
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
                          <p className="mt-0.5 text-[11px] text-muted-foreground">#{synthInvoiceId(p.id)}</p>
                        </div>
                      </div>
                      <StatusBadge status={isOverdue ? "Overdue" : "Pending"} />
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Due {p.nextDueDate}</p>
                        <p className={`mt-1 text-xl font-bold ${isOverdue ? "text-destructive" : "text-amber-700"}`}>
                          {SAR(p.balance)}
                        </p>
                      </div>
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                        <Link
                          to="/guardian/payments/pay/$invoiceId"
                          params={{ invoiceId: inv.invoiceId }}
                        >
                          Pay Now
                        </Link>
                      </Button>
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
