export interface StaffMember {
  id: string;
  name: string;
  role: "Head Coach" | "Coach" | "Assistant" | "Manager";
  email: string;
  phone: string;
  location: string;
  programmes: string[];
  status: "Active" | "Pending" | "On Hold";
  startedAt: string;
}

export const staff: StaffMember[] = [
  { id: "ST-101", name: "Mark Doyle", role: "Head Coach", email: "mark.doyle@neomora.com", phone: "+353 87 111 0001", location: "Dublin North", programmes: ["Football U10", "Football U12"], status: "Active", startedAt: "2022-08-01" },
  { id: "ST-102", name: "Priya Shah", role: "Head Coach", email: "priya.shah@neomora.com", phone: "+44 7700 900201", location: "London West", programmes: ["Football U12", "Athletics U14"], status: "Active", startedAt: "2023-01-15" },
  { id: "ST-103", name: "Tomás Weber", role: "Coach", email: "tomas.weber@neomora.com", phone: "+49 151 22233344", location: "Berlin Mitte", programmes: ["Multi-Sport U8"], status: "Active", startedAt: "2024-03-04" },
  { id: "ST-104", name: "Lucie Bernard", role: "Coach", email: "lucie.bernard@neomora.com", phone: "+33 6 11 22 33 44", location: "Paris Sud", programmes: ["Football U12"], status: "Active", startedAt: "2023-09-12" },
  { id: "ST-105", name: "Rui Mendes", role: "Coach", email: "rui.mendes@neomora.com", phone: "+351 91 555 1212", location: "Lisbon Centre", programmes: ["Athletics U14"], status: "Active", startedAt: "2024-06-20" },
  { id: "ST-106", name: "Sinead Kelly", role: "Manager", email: "sinead.kelly@neomora.com", phone: "+353 86 999 4455", location: "Dublin North", programmes: [], status: "Active", startedAt: "2021-05-10" },
  { id: "ST-107", name: "Aaron Lynch", role: "Assistant", email: "aaron.lynch@neomora.com", phone: "+353 87 222 9988", location: "Dublin North", programmes: ["Football U10"], status: "Pending", startedAt: "2026-05-01" },
];
