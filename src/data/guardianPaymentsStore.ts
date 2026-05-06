import { useSyncExternalStore } from "react";
import { mockPayments, type MockPayment } from "@/data/mockPayments";
import { GUARDIAN_CHILD_IDS } from "@/data/guardianContext";

// Synthesize an "outstanding invoice" per guardian payment that still has a balance.
// We treat each unpaid PaymentRecord as a single payable invoice for the demo.
export interface PayableInvoice {
  invoiceId: string;     // synthetic, e.g. NMR-INV-PAY-004
  paymentId: string;     // links back to MockPayment.id
  participantId: string;
  participantName: string;
  session: string;
  location: string;
  baseFee: number;
  discount: number;      // mock 0
  amountDue: number;     // balance
  dueDate: string;
  status: "Pending" | "Overdue" | "Partial";
}

type PaidEntry = {
  invoiceId: string;
  paymentId: string;
  participantName: string;
  session: string;
  amount: number;
  method: string;
  date: string; // ISO
};

const synthInvoiceId = (paymentId: string) =>
  `NMR-INV-${paymentId.replace(/[^0-9]/g, "").padStart(4, "0")}`;

const guardianPayments = (): MockPayment[] =>
  mockPayments.filter((p) => GUARDIAN_CHILD_IDS.includes(p.participantId));

// ----- mutable state -----
const paidPaymentIds = new Set<string>();
const paidEntries: PaidEntry[] = [];
const listeners = new Set<() => void>();

let snapshotVersion = 0;
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => snapshotVersion;
const emit = () => {
  snapshotVersion++;
  listeners.forEach((l) => l());
};

// ----- selectors -----
export function getOutstandingInvoices(): PayableInvoice[] {
  return guardianPayments()
    .filter((p) => p.balance > 0 && !paidPaymentIds.has(p.id))
    .map<PayableInvoice>((p) => ({
      invoiceId: synthInvoiceId(p.id),
      paymentId: p.id,
      participantId: p.participantId,
      participantName: p.participantName,
      session: p.session,
      location: p.location,
      baseFee: p.balance,
      discount: 0,
      amountDue: p.balance,
      dueDate: p.nextDueDate,
      status:
        p.status === "Overdue" ? "Overdue" :
        p.status === "Partial" ? "Partial" : "Pending",
    }));
}

export function getInvoiceById(invoiceId: string): PayableInvoice | undefined {
  return getOutstandingInvoices().find((i) => i.invoiceId === invoiceId)
    // also handle freshly paid (so success page can still render)
    ?? guardianPayments()
      .filter((p) => synthInvoiceId(p.id) === invoiceId)
      .map<PayableInvoice>((p) => ({
        invoiceId: synthInvoiceId(p.id),
        paymentId: p.id,
        participantId: p.participantId,
        participantName: p.participantName,
        session: p.session,
        location: p.location,
        baseFee: p.balance || p.totalFee - p.paidAmount,
        discount: 0,
        amountDue: p.balance || p.totalFee - p.paidAmount,
        dueDate: p.nextDueDate,
        status: "Pending",
      }))[0];
}

export function getOutstandingTotal(): number {
  return getOutstandingInvoices().reduce((a, i) => a + i.amountDue, 0);
}

export function isPaid(paymentId: string) {
  return paidPaymentIds.has(paymentId);
}

export function getPaidEntries(): PaidEntry[] {
  return [...paidEntries];
}

export function getPaidEntryByInvoiceId(invoiceId: string): PaidEntry | undefined {
  return paidEntries.find((e) => e.invoiceId === invoiceId);
}

// ----- mutations -----
export function markInvoicePaid(invoiceId: string, method: string) {
  const inv = getInvoiceById(invoiceId);
  if (!inv) return;
  paidPaymentIds.add(inv.paymentId);
  paidEntries.push({
    invoiceId: inv.invoiceId,
    paymentId: inv.paymentId,
    participantName: inv.participantName,
    session: inv.session,
    amount: inv.amountDue,
    method,
    date: new Date().toISOString(),
  });
  emit();
}

export function markAllOutstandingPaid(method: string): { total: number; count: number } {
  const outstanding = getOutstandingInvoices();
  const total = outstanding.reduce((a, i) => a + i.amountDue, 0);
  outstanding.forEach((inv) => {
    paidPaymentIds.add(inv.paymentId);
    paidEntries.push({
      invoiceId: inv.invoiceId,
      paymentId: inv.paymentId,
      participantName: inv.participantName,
      session: inv.session,
      amount: inv.amountDue,
      method,
      date: new Date().toISOString(),
    });
  });
  emit();
  return { total, count: outstanding.length };
}

// React hook to re-render on store changes
export function useGuardianPaymentsStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
