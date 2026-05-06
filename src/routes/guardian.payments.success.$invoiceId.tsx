import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getPaidEntryByInvoiceId } from "@/data/guardianPaymentsStore";

interface SuccessSearch { method?: string }

export const Route = createFileRoute("/guardian/payments/success/$invoiceId")({
  validateSearch: (s: Record<string, unknown>): SuccessSearch => ({
    method: typeof s.method === "string" ? s.method : undefined,
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const { invoiceId } = Route.useParams();
  const { method } = Route.useSearch();
  const entry = getPaidEntryByInvoiceId(invoiceId);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!entry) {
    return (
      <div className="mx-auto mt-16 max-w-lg rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold">Receipt not found</p>
        <Link to="/guardian/payments" className="mt-4 inline-flex text-sm font-medium text-brand hover:underline">
          Back to Payments
        </Link>
      </div>
    );
  }

  const dateStr = new Date(entry.date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="mx-auto mt-16 max-w-lg rounded-2xl border bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full bg-success/10 transition-all duration-500 ease-out ${
            show ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <Check className="h-10 w-10 text-success" strokeWidth={3} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-success">Payment Successful!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you, Fatima. Your payment has been received.
        </p>
      </div>

      <div className="my-6 border-t" />

      <div className="space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
        <Row label="Invoice ID" value={`#${entry.invoiceId}`} />
        <Row label="Participant" value={entry.participantName} />
        <Row label="Session" value={entry.session} />
        <Row label="Amount Paid" value={`SAR ${entry.amount.toLocaleString()}`} bold />
        <Row label="Payment Method" value={method ?? entry.method} />
        <Row label="Date" value={dateStr} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => toast.success("Receipt downloaded")}
        >
          <Download className="mr-2 h-4 w-4" /> Download Receipt
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/guardian/payments">Back to Payments</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}
