import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { getInvoiceById, markInvoicePaid, useGuardianPaymentsStore } from "@/data/guardianPaymentsStore";
import { PaymentMethodForm, type PaymentMethodKey } from "@/components/PaymentMethodForm";
import logoUrl from "@/assets/neomora-logo.png";

export const Route = createFileRoute("/guardian/payments/pay/$invoiceId")({
  component: PayInvoicePage,
});

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

function PayInvoicePage() {
  const { invoiceId } = Route.useParams();
  const navigate = useNavigate();
  useGuardianPaymentsStore();
  const invoice = getInvoiceById(invoiceId);
  const [processing, setProcessing] = useState(false);

  if (!invoice) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold">Invoice not found</p>
        <p className="mt-2 text-sm text-muted-foreground">This invoice may already have been paid.</p>
        <Link to="/guardian/payments" className="mt-6 inline-flex text-sm font-medium text-brand hover:underline">
          ← Back to Payments
        </Link>
      </div>
    );
  }

  const handlePay = (method: PaymentMethodKey, methodLabel: string) => {
    setProcessing(true);
    setTimeout(() => {
      markInvoicePaid(invoice.invoiceId, methodLabel);
      navigate({
        to: "/guardian/payments/success/$invoiceId",
        params: { invoiceId: invoice.invoiceId },
        search: { method: methodLabel },
      });
    }, 2000);
    void method;
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
        {/* LEFT: Summary */}
        <div className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow label="Child" value={invoice.participantName} />
            <SummaryRow label="Session" value={invoice.session} />
            <SummaryRow label="Location" value={invoice.location} />
            <SummaryRow label="Invoice" value={`#${invoice.invoiceId}`} />
          </div>

          <div className="mt-5 space-y-2 border-t pt-4 text-sm">
            <SummaryRow label="Base Fee" value={SAR(invoice.baseFee)} />
            <SummaryRow label="Discount" value={`- ${SAR(invoice.discount)}`} muted />
            <SummaryRow label="Total Due" value={SAR(invoice.amountDue)} bold />
          </div>

          <div className="mt-5 border-t pt-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Amount to pay</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{SAR(invoice.amountDue)}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t pt-5">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Secure payment powered by Moyasar
            </p>
            <div className="flex h-7 items-center rounded-md bg-sidebar px-2">
              <img src={logoUrl} alt="Neomora" className="h-4 w-auto brightness-0 invert" />
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Method */}
        <div className="relative rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Choose Payment Method</h2>
          <div className="mt-4">
            <PaymentMethodForm amount={invoice.amountDue} processing={processing} onPay={handlePay} />
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

function SummaryRow({
  label, value, muted, bold,
}: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${bold ? "text-base font-semibold" : ""} ${muted ? "text-muted-foreground" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
