// import { apiClient } from "@/lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export type UserRole =
//   | "SUPER_ADMIN"
//   | "LOCATION_MANAGER"
//   | "FINANCE_OFFICER"
//   | "STAFF_COACH";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   locationAccess?: string;
//   lastLogin?: string;
// }

// export interface CreateUserPayload {
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
// }

// // ─── Role label → API value map ───────────────────────────────────────────────
// export const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
//   { label: "Super Admin", value: "SUPER_ADMIN" },
//   { label: "Location Manager", value: "LOCATION_MANAGER" },
//   { label: "Finance Officer", value: "FINANCE_OFFICER" },
//   { label: "Staff/Coach", value: "STAFF_COACH" },
// ];

// // ─── Endpoints ────────────────────────────────────────────────────────────────
// export const usersApi = {
//   /** GET /users */
//   getAll: async (): Promise<User[]> => {
//     // const { data } = await apiClient.get<User[]>("/users");
//     // return data;
//     const { data } = await apiClient.get<any>("/users");
//     return data.items ?? data;
//   },

//   /** POST /users */
//   create: async (payload: CreateUserPayload): Promise<User> => {
//     const { data } = await apiClient.post<User>("/users", payload);
//     return data;
//   },
// };