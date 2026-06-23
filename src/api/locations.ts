// import { apiClient } from "@/lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────
// export interface Location {
//   id: string;
//   slug: string;
//   name: string;
//   city: string;
//   address: string;
//   phone: string;
//   capacity: number;
//   enrolled?: number;
//   manager?: string | { id: string; name: string; email?: string }; // add object form
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
//   // getAll: async (): Promise<Location[]> => {
//   //   const { data } = await apiClient.get<any>("/locations");
//   //   const items = data.items ?? data;
//   //   console.log("[DEBUG] Locations API response:", JSON.stringify(items[0], null, 2));
//   //   return items;
//   // },



//   getAll: async (): Promise<Location[]> => {
//     const { data } = await apiClient.get<any>("/locations");
//     const items: any[] = data.items ?? data;
//     return items.map((loc) => ({
//       ...loc,
//       // Normalize status casing (API returns "active" but type expects "Active")
//       status: loc.status
//         ? (loc.status.charAt(0).toUpperCase() + loc.status.slice(1).toLowerCase())
//         : "Active",
//     }));
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



import { apiClient } from "@/lib/axios";

export interface Location {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  capacity: number;
  enrolled?: number;
  manager?: string;
  status: "Active" | "InActive" | "Maintenance";
  createdAt?: string;
}

export interface CreateLocationPayload {
  name: string;
  city: string;
  address: string;
  phone: string;
  capacity: number;
}

export interface UpdateLocationPayload {
  name?: string;
  city?: string;
  address?: string;
  phone?: string;
  capacity?: number;
  status?: "Active" | "InActive" | "Maintenance";
}

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await apiClient.get<any>("/locations");
    const items: any[] = data.items ?? data;
    return items.map((loc) => ({
      ...loc,
      status: loc.status
        ? (loc.status.charAt(0).toUpperCase() + loc.status.slice(1).toLowerCase())
        : "Active",
    }));
  },

  create: async (payload: CreateLocationPayload): Promise<Location> => {
    const { data } = await apiClient.post<Location>("/locations", payload);
    return data;
  },

  update: async (id: string, payload: UpdateLocationPayload): Promise<Location> => {
    const { data } = await apiClient.patch<Location>(`/locations/${id}`, payload);
    return data;
  },
};