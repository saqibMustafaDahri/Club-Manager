
import { apiClient } from "@/lib/axios";

export interface Invoice {
  id: string;
  date: string;
  method: string;
  amount: number;
  receiptUrl: string;
}

export interface Payment {
  id: string;
  participantName: string;
  location: string;
  session: string;
  plan: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
  lastPaymentDate: string;
  nextDueDate: string;
  invoices: Invoice[];
  participantId?: string;
}

export const paymentsApi = {
  getAll: async (page = 1, limit = 20): Promise<Payment[]> => {
    const { data } = await apiClient.get<any>(
      `/payments?page=${page}&limit=${limit}`
    );

    let items: any[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.data)) items = data.data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.payments)) items = data.payments;
    else if (Array.isArray(data?.results)) items = data.results;
    else {
      console.warn("GET /payments: unexpected response shape", data);
      return [];
    }

    // Normalize each payment so numeric fields are never undefined
    return items.map((p: any) => ({
      ...p,
      // Participant name — API may nest it
      participantName:
        p.participantName ??
        (p.participant
          ? `${p.participant.firstNameEn ?? ""} ${p.participant.lastNameEn ?? ""}`.trim()
          : "—"),

      // Location / session — may be nested objects
      location: p.location?.name ?? p.location ?? p.locationSlug ?? "—",
      session: p.session?.name ?? p.session ?? p.sessionId ?? "—",
      plan: p.plan ?? p.paymentPlanType ?? "—",

      // Always numbers, never undefined
      totalFee: Number(p.totalFee ?? p.totalAmount ?? 0),
      paidAmount: Number(p.paidAmount ?? p.amountPaid ?? 0),
      balance: Number(p.balance ?? p.remaining ?? 0),

      status: p.status ?? "Pending",
      nextDueDate: p.nextDueDate ?? p.nextDue ?? "—",
      lastPaymentDate: p.lastPaymentDate ?? "—",
      invoices: Array.isArray(p.invoices) ? p.invoices : [],
    }));
  },
};