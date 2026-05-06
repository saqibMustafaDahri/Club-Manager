export type UserRole = "Super Admin" | "Location Manager" | "Finance Officer" | "Staff/Coach";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationAccess: string;
  lastLogin: string;
  status: "Active" | "On Hold";
}

export const mockUsers: MockUser[] = [
  { id: "u-01", name: "John Admin", email: "admin@neomora.com", role: "Super Admin", locationAccess: "All Locations", lastLogin: "2025-12-01 09:14", status: "Active" },
  { id: "u-02", name: "Khalid Al-Saud", email: "khalid@neomora.com", role: "Location Manager", locationAccess: "Riyadh Academy", lastLogin: "2025-12-01 08:02", status: "Active" },
  { id: "u-03", name: "Sara Al-Harbi", email: "sara@neomora.com", role: "Location Manager", locationAccess: "Jeddah Branch", lastLogin: "2025-11-30 17:42", status: "Active" },
  { id: "u-04", name: "Yasmin Al-Ghamdi", email: "finance@neomora.com", role: "Finance Officer", locationAccess: "All Locations", lastLogin: "2025-12-01 07:30", status: "Active" },
  { id: "u-05", name: "Faris Al-Mutairi", email: "faris@neomora.com", role: "Staff/Coach", locationAccess: "Riyadh Academy", lastLogin: "2025-11-29 14:10", status: "Active" },
  { id: "u-06", name: "Bandar Al-Otaibi", email: "bandar@neomora.com", role: "Staff/Coach", locationAccess: "Jeddah Branch", lastLogin: "2025-11-28 10:55", status: "On Hold" },
];
