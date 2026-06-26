
import { apiClient } from "@/lib/axios";

export interface Enrolment {
  id: string;
  participantId: string;
  sessionId: string;
  locationId: string;
  paymentPlanType: string;
  status?: string;
  [key: string]: unknown;
}

export interface CreateEnrolmentPayload {
  participantId: string;
  sessionId: string;
  locationId: string;
  paymentPlanType: string;
}

export interface ReEnrolPayload {
  sessionId: string;
  paymentPlanType: string;
}

export interface CreatePaymentPlanPayload {
  planType: "MONTHLY" | "QUARTERLY" | "CUSTOM";
  instalmentCount: number;
}

export interface FeeOverridePayload {
  amount: number;
  reason: string;
}

export const enrolmentsApi = {
  getAll: async (): Promise<Enrolment[]> => {
    const { data } = await apiClient.get<any>("/enrolments");
    return data.items ?? data;
  },

  create: async (payload: CreateEnrolmentPayload): Promise<Enrolment> => {
    const { data } = await apiClient.post<Enrolment>("/enrolments", payload);
    return data;
  },

  reEnrol: async (id: string, payload: ReEnrolPayload): Promise<Enrolment> => {
    const { data } = await apiClient.post<Enrolment>(`/enrolments/${id}/re-enrol`, payload);
    return data;
  },

  createPaymentPlan: async (id: string, payload: CreatePaymentPlanPayload): Promise<any> => {
    const { data } = await apiClient.post(`/enrolments/${id}/payment-plan`, payload);
    return data;
  },

  setFeeOverride: async (id: string, payload: FeeOverridePayload): Promise<any> => {
    const { data } = await apiClient.patch(`/enrolments/${id}/fee-override`, payload);
    return data;
  },
};