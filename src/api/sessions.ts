import { apiClient } from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SessionStatus = "OPEN" | "CLOSED" | "UPCOMING";

export type PaymentPlanType = "MONTHLY" | "QUARTERLY" | "CUSTOM";

export interface SessionLocation {
  locationId: string;
  feeOverride?: number | null;
  location?: {
    id: string;
    name: string;
    city?: string;
  };
}

export interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  baseFee: number;
  currency?: string;
  capacity?: number;
  enrolledCount?: number;
  status: SessionStatus;
  locations: SessionLocation[];
}

export interface CreateSessionPayload {
  name: string;
  startDate: string;
  endDate: string;
  baseFee: number;
  locations: SessionLocation[];
}

export interface PaymentPlan {
  id: string;
  type: PaymentPlanType;
  instalmentCount: number;
  instalmentAmount: number;
  dueDates: string[];
}

// export interface CreatePaymentPlanPayload {
//   type: PaymentPlanType;
//   instalmentCount: number;
//   instalmentAmount: number;
//   dueDates: string[];
// }

// export interface CreatePaymentPlanPayload {
//   type: PaymentPlanType;
//   instalmentCount: number;
//   instalmentAmount: number;
//   dueDates: { dueDate: string }[];
// }
export interface CreatePaymentPlanPayload {
  type: PaymentPlanType;
  instalmentCount: number;
  instalmentAmount: number;
  dueDates: string[];  // ← plain strings
}

// ─── Endpoints ────────────────────────────────────────────────────────────────
export const sessionsApi = {
  /** GET /sessions — Bearer token attached automatically by interceptor */
  getAll: async (): Promise<Session[]> => {
    const { data } = await apiClient.get<any>("/sessions");
    const raw: any[] = data.items ?? data;
    return raw.map((s: any) => ({
      ...s,
      locations: (s.sessionLocations ?? s.locations ?? []).map((sl: any) => ({
        locationId: sl.locationId,
        feeOverride: sl.feeOverride ?? null,
        location: sl.location ?? null,
      })),
    }));
  },

  /** POST /sessions */
  create: async (payload: CreateSessionPayload): Promise<Session> => {
    const { data } = await apiClient.post<Session>("/sessions", payload);
    return data;
  },

  /** PATCH /sessions/:id/status */
  updateStatus: async (id: string, status: SessionStatus): Promise<Session> => {
    const { data } = await apiClient.patch<Session>(`/sessions/${id}/status`, { status });
    return data;
  },

  /** POST /sessions/:id/payment-plans */
  addPaymentPlan: async (
    id: string,
    payload: CreatePaymentPlanPayload
  ): Promise<PaymentPlan> => {
    const { data } = await apiClient.post<PaymentPlan>(
      `/sessions/${id}/payment-plans`,
      payload
    );
    return data;
  },
};