import { apiClient } from "@/lib/axios";

export type UserRole =
  | "SUPER_ADMIN"
  | "LOCATION_MANAGER"
  | "FINANCE_OFFICER"
  | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationId?: string;
  locationAccess?: string;
  lastLogin?: string;
  [key: string]: unknown;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  locationId?: string;
}

export const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Location Manager", value: "LOCATION_MANAGER" },
  { label: "Finance Officer", value: "FINANCE_OFFICER" },
  { label: "Staff/Coach", value: "STAFF" },
];

/** Normalizes a raw user object from the API into the shape the UI expects. */
function normalizeUser(u: any): User {
  return {
    ...u,
    locationId: u.locationId ?? u.location?.id ?? null,
    locationAccess: u.location?.name ?? u.locationAccess ?? null,
  };
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get<any>("/users");
    const items: any[] = data.items ?? data;
    return items.map(normalizeUser);
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    // Log the outgoing payload so you can verify locationId is present
    // for both LOCATION_MANAGER and STAFF roles.
    console.log("[usersApi.create] payload:", payload);
    const { data } = await apiClient.post<any>("/users", payload);
    // Normalize the response the same way getAll does so the caller
    // gets a consistent User object regardless of what the backend returns.
    return normalizeUser(data);
  },
};