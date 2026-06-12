// import { apiClient } from "@/lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type Gender = "MALE" | "FEMALE";

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
//   // extra fields the API may return
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

// // ─── Endpoints ────────────────────────────────────────────────────────────────
// export const participantsApi = {
//   /** GET /participants — Bearer token attached automatically by interceptor */
//   getAll: async (): Promise<Participant[]> => {
//     const { data } = await apiClient.get<any>("/users");
//     return data.items ?? data;
//   },

//   /** POST /participants/register */
//   register: async (payload: CreateParticipantPayload): Promise<Participant> => {
//     const { data } = await apiClient.post<Participant>("/participants/register", payload);
//     return data;
//   },
// };