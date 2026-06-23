
// import { apiClient } from "@/lib/axios";

// export type Gender = "MALE" | "FEMALE";

// export type ParticipantStatus =
//   | "INQUIRY"
//   | "DOCUMENTS_PENDING"
//   | "FEE_PENDING"
//   | "ACTIVE"
//   | "ON_HOLD"
//   | "COMPLETED"
//   | "WITHDRAWN";

// export interface Guardian {
//   fullName: string;
//   relationship: string;
//   phone: string;
//   email: string;
// }

// export interface Participant {
//   id: string;
//   firstNameEn: string;
//   lastNameEn: string;
//   dateOfBirth: string;
//   gender: Gender;
//   phone: string;
//   locationSlug: string;
//   guardian: Guardian;
//   status?: string;
//   uniqueId?: string;
//   joinedDate?: string;
//   [key: string]: unknown;
// }

// export interface CreateParticipantPayload {
//   firstNameEn: string;
//   lastNameEn: string;
//   dateOfBirth: string;
//   gender: Gender;
//   phone: string;
//   locationSlug: string;
//   guardian: Guardian;
// }

// export interface UpdateStatusPayload {
//   status: ParticipantStatus;
//   reason?: string;
// }

// export const STATUS_OPTIONS: { label: string; value: ParticipantStatus }[] = [
//   { label: "Inquiry", value: "INQUIRY" },
//   { label: "Documents Pending", value: "DOCUMENTS_PENDING" },
//   { label: "Fee Pending", value: "FEE_PENDING" },
//   { label: "Active", value: "ACTIVE" },
//   { label: "On Hold", value: "ON_HOLD" },
//   { label: "Completed", value: "COMPLETED" },
//   { label: "Withdrawn", value: "WITHDRAWN" },
// ];

// export const participantsApi = {
//   getAll: async (): Promise<Participant[]> => {
//     const { data } = await apiClient.get<any>("/participants?sortBy=createdAt&order=desc&page=1&limit=20");
//     const items: any[] = data.items ?? data;
//     return items.map((p) => ({
//       ...p,
//       locationSlug: p.location?.name ?? p.location?.slug ?? p.locationSlug ?? "—",
//       joinedDate: p.createdAt ?? p.joinedDate ?? null,
//       guardian: p.guardian ?? {
//         fullName: p.guardianFullName ?? "—",
//         relationship: p.guardianRelationship ?? "",
//         phone: p.guardianPhone ?? "",
//         email: p.guardianEmail ?? "",
//       },
//     }));
//   },

//   register: async (payload: CreateParticipantPayload): Promise<Participant> => {
//     const { data } = await apiClient.post<Participant>("/participants/register", payload);
//     return data;
//   },

//   updateStatus: async (id: string, payload: UpdateStatusPayload): Promise<Participant> => {
//     const { data } = await apiClient.patch<Participant>(`/participants/${id}/status`, payload);
//     return data;
//   },
// };




import { apiClient } from "@/lib/axios";
import { guardianTokenStorage } from "@/api/guardianAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Gender = "MALE" | "FEMALE";

export type ParticipantStatus =
  | "INQUIRY"
  | "DOCUMENTS_PENDING"
  | "FEE_PENDING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "WITHDRAWN";

export interface Guardian {
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Participant {
  id: string;
  firstNameEn: string;
  lastNameEn: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  locationSlug: string;
  guardian: Guardian;
  status?: string;
  uniqueId?: string;
  joinedDate?: string;
  createdAt?: string;
  sessionId?: string;
  [key: string]: unknown;
}

export interface CreateParticipantPayload {
  firstNameEn: string;
  lastNameEn: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  locationSlug: string;
  sessionId?: string;
  guardian: Guardian;
}

export interface UpdateStatusPayload {
  status: ParticipantStatus;
  reason?: string;
}

export const STATUS_OPTIONS: { label: string; value: ParticipantStatus }[] = [
  { label: "Inquiry", value: "INQUIRY" },
  { label: "Documents Pending", value: "DOCUMENTS_PENDING" },
  { label: "Fee Pending", value: "FEE_PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

// ─── Normalizer ───────────────────────────────────────────────────────────────

function normalizeParticipant(p: any): Participant {
  return {
    ...p,
    locationSlug: p.location?.name ?? p.location?.slug ?? p.locationSlug ?? "—",
    joinedDate: p.createdAt ?? p.joinedDate ?? null,
    guardian: p.guardian ?? {
      fullName: p.guardianFullName ?? "—",
      relationship: p.guardianRelationship ?? "",
      phone: p.guardianPhone ?? "",
      email: p.guardianEmail ?? "",
    },
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const participantsApi = {
  /**
   * GET /participants
   * Admin: fetch all participants (uses admin token via axios interceptor).
   */
  getAll: async (): Promise<Participant[]> => {
    const { data } = await apiClient.get<any>(
      "/participants?sortBy=createdAt&order=desc&page=1&limit=20"
    );
    const items: any[] = data.items ?? data;
    return items.map(normalizeParticipant);
  },

  /**
   * POST /participants/register
   * Admin: register a new participant.
   * Normalizes the response so locationAccess/guardian display correctly
   * in the table immediately after creation without a page refresh.
   */
  register: async (payload: CreateParticipantPayload): Promise<Participant> => {
    console.log("[participantsApi.register] payload:", payload);
    const { data } = await apiClient.post<any>("/participants/register", payload);
    return normalizeParticipant(data);
  },

  /**
   * PATCH /participants/:id/status
   * Admin: update a participant's status.
   */
  updateStatus: async (
    id: string,
    payload: UpdateStatusPayload
  ): Promise<Participant> => {
    const { data } = await apiClient.patch<any>(
      `/participants/${id}/status`,
      payload
    );
    return normalizeParticipant(data);
  },

  /**
   * GET /guardian-auth/me — participants belonging to the authenticated guardian.
   * Uses the guardian's Bearer token (stored separately from the admin token).
   * Called from the guardian-facing portal, not the admin panel.
   */
  getForGuardian: async (): Promise<Participant[]> => {
    const token = guardianTokenStorage.get();
    if (!token) throw new Error("Guardian is not authenticated.");
    const { data } = await apiClient.get<any>("/guardian-auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // /guardian-auth/me returns the guardian profile; participants may be nested
    const items: any[] = data.participants ?? data.children ?? [];
    return items.map(normalizeParticipant);
  },
};