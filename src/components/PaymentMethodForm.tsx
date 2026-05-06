import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type PaymentMethodKey = "card";

interface Props {
  amount: number;
  processing: boolean;
  onPay: (method: PaymentMethodKey, methodLabel: string) => void;
}

const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

const METHOD_LABEL: Record<PaymentMethodKey, string> = {
  card: "Credit / Debit Card",
};

export function PaymentMethodForm({ amount, processing, onPay }: Props) {
  const [method, setMethod] = useState<PaymentMethodKey>("card");

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        <MethodOption
          active={method === "card"}
          onClick={() => setMethod("card")}
          icon={<CreditCard className="h-5 w-5 text-brand" />}
          title="Credit / Debit Card"
          subtitle="Visa, Mastercard, AmEx"
        />
      </div>

      <div className="border-t pt-5">
        <CardForm amount={amount} processing={processing} onPay={() => onPay("card", METHOD_LABEL.card)} />
      </div>
    </div>
  );
}

function MethodOption({
  active, onClick, icon, title, subtitle,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-white p-4 text-left transition-all",
        active
          ? "border-brand ring-2 ring-brand/30"
          : "border-border hover:border-brand/40"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          active ? "border-brand" : "border-muted-foreground/40"
        )}
      >
        {active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
      <span className="flex h-9 w-12 items-center justify-center">{icon}</span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}

function inputBase() {
  return "mt-1.5 block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";
}

function CardForm({
  amount, processing, onPay,
}: { amount: number; processing: boolean; onPay: () => void }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCard = (raw: string) =>
    raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const valid =
    name.trim().length > 1 &&
    number.replace(/\s/g, "").length >= 12 &&
    /^\d{2}\/\d{2}$/.test(exp) &&
    cvv.length >= 3;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (processing) return;
        if (!valid) {
          toast.error("Please complete all card fields to continue.");
          return;
        }
        onPay();
      }}
    >
      <div>
        <label className="text-sm font-medium text-foreground">Cardholder Name</label>
        <input
          className={inputBase()}
          placeholder="Name as it appears on card"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Card Number</label>
        <input
          className={inputBase() + " font-mono tracking-wider"}
          placeholder="1234 5678 9012 3456"
          value={number}
          onChange={(e) => setNumber(formatCard(e.target.value))}
          inputMode="numeric"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-foreground">Expiry (MM/YY)</label>
          <input
            className={inputBase() + " font-mono"}
            placeholder="MM/YY"
            value={exp}
            onChange={(e) => setExp(formatExp(e.target.value))}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">CVV</label>
          <input
            type="password"
            className={inputBase() + " font-mono tracking-widest"}
            placeholder="•••"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
            inputMode="numeric"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={processing}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {processing ? "Processing…" : `Pay ${SAR(amount)}`}
      </Button>
    </form>
  );
}
