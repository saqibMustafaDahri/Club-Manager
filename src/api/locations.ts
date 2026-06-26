
import { apiClient } from "@/lib/axios";

export interface Location {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  capacity: number;
  enrolled?: number;
  manager?: string;
  status: "active" | "inactive" | "maintenance";
  amenities?: string[];
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
  email?: string;
  capacity?: number;
  status?: "active" | "inactive" | "maintenance";
  amenities?: string[];
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