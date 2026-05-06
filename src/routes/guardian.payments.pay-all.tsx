import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import {
  getOutstandingInvoices,
  markAllOutstandingPaid,
  useGuardianPaymentsStore,
} from "@/data/guardianPaymentsStore";
import { PaymentMethodForm, type PaymentMethodKey } from "@/components/PaymentMethodForm";
import logoUrl from "@/assets/neomora-logo.png";

export const Route = createFileRoute("/guardian/payments/pay-all")({
  component: PayAllPage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function PayAllPage() {
  const navigate = useNavigate();
  useGuardianPaymentsStore();
  const invoices = getOutstandingInvoices();
  const total = invoices.reduce((a, i) => a + i.amountDue, 0);
  const [processing, setProcessing] = useState(false);

  if (invoices.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold">No outstanding balance</p>
        <Link to="/guardian/payments" className="mt-6 inline-flex text-sm font-medium text-brand hover:underline">
          ← Back to Payments
        </Link>
      </div>
    );
  }

  const handlePay = (_m: PaymentMethodKey, methodLabel: string) => {
    setProcessing(true);
    setTimeout(() => {
      markAllOutstandingPaid(methodLabel);
      navigate({ to: "/guardian/payments/success/all", search: { method: methodLabel, total } });
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <Link
        to="/guardian/payments"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Payments
      </Link>

      <div className="grid gap-6 lg:grid-cols-[55fr_45fr]">
        <div className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">{invoices.length} outstanding invoice{invoices.length === 1 ? "" : "s"}</p>

          <div className="mt-4 divide-y rounded-md border">
            {invoices.map((inv) => (
              <div key={inv.invoiceId} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{inv.participantName}</p>
                  <p className="truncate text-xs text-muted-foreground">{inv.session} · {inv.location}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">#{inv.invoiceId}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold">{SAR(inv.amountDue)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t pt-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Combined total</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{SAR(total)}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t pt-5">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Secure payments
            </p>
            <div className="flex h-7 items-center rounded-md bg-sidebar px-2">
              <img src={logoUrl} alt="Neomora" className="h-4 w-auto brightness-0 invert" />
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Choose Payment Method</h2>
          <div className="mt-4">
            <PaymentMethodForm amount={total} processing={processing} onPay={handlePay} />
          </div>
          {processing && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/95 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="text-base font-medium text-foreground">Processing your payment…</p>
              <p className="text-xs text-muted-foreground">Please do not refresh this page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
