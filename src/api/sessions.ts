// import { apiClient } from "@/lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type SessionStatus = "OPEN" | "CLOSED" | "UPCOMING";

// export interface SessionLocation {
//   locationId: string;
// }

// export interface Session {
//   id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   baseFee: number;
//   currency?: string;
//   capacity?: number;
//   enrolledCount?: number;
//   status: SessionStatus;
//   locations: SessionLocation[];
// }

// export interface CreateSessionPayload {
//   name: string;
//   startDate: string;
//   endDate: string;
//   baseFee: number;
//   locations: SessionLocation[];
// }

// // ─── Endpoints ────────────────────────────────────────────────────────────────
// export const sessionsApi = {
//   /** GET /sessions — Bearer token attached automatically by interceptor */
//   getAll: async (): Promise<Session[]> => {
//     const { data } = await apiClient.get<any>("/sessions");
//     return data.items ?? data;
//   },

//   /** POST /sessions */
//   create: async (payload: CreateSessionPayload): Promise<Session> => {
//     const { data } = await apiClient.post<Session>("/sessions", payload);
//     return data;
//   },

//   /** PATCH /sessions/:id/status */
//   updateStatus: async (id: string, status: SessionStatus): Promise<Session> => {
//     const { data } = await apiClient.patch<Session>(`/sessions/${id}/status`, { status });
//     return data;
//   },
// };