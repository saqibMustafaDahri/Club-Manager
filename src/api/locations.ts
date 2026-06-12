// import { apiClient } from "@/lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export interface Location {
//   id: string;
//   name: string;
//   city: string;
//   address: string;
//   phone: string;
//   capacity: number;
//   enrolled?: number;
//   manager?: string;
//   status: "Active" | "InActive" | "Maintenance";
//   createdAt?: string;
// }

// export interface CreateLocationPayload {
//   name: string;
//   city: string;
//   address: string;
//   phone: string;
//   capacity: number;
// }

// export interface UpdateLocationPayload {
//   name?: string;
//   city?: string;
//   address?: string;
//   phone?: string;
//   capacity?: number;
//   status?: "Active" | "InActive" | "Maintenance";
// }

// // ─── Endpoints ────────────────────────────────────────────────────────────────
// export const locationsApi = {
//   /** GET /locations — Bearer token attached automatically by interceptor */
//   getAll: async (): Promise<Location[]> => {
//     const { data } = await apiClient.get<any>("/locations");
//     return data.items ?? data;
//   },

//   /** POST /locations */
//   create: async (payload: CreateLocationPayload): Promise<Location> => {
//     const { data } = await apiClient.post<Location>("/locations", payload);
//     return data;
//   },

//   /** PATCH /locations/:id */
//   update: async (id: string, payload: UpdateLocationPayload): Promise<Location> => {
//     const { data } = await apiClient.patch<Location>(`/locations/${id}`, payload);
//     return data;
//   },
// };