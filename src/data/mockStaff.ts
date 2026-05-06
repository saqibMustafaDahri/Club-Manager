export type StaffRole = "Coach" | "Assistant Coach" | "Admin";

export interface MockStaff {
  id: string;
  name: string;
  role: StaffRole;
  location: string;
  assignedSessions: string[];
  squad: string[];
  phone: string;
  email: string;
}

export const mockStaff: MockStaff[] = [
  {
    id: "st-001", name: "Faris Al-Mutairi", role: "Coach", location: "Riyadh Academy",
    assignedSessions: ["Spring 2025", "Fall 2025"],
    squad: ["Ahmed Al-Saud", "Yousef Al-Otaibi", "Khalid Al-Mutairi", "Reem Al-Subaie", "Talal Al-Juhani"],
    phone: "+966 50 111 2233", email: "faris.m@neomora.sa",
  },
  {
    id: "st-002", name: "Layla Al-Harbi", role: "Assistant Coach", location: "Riyadh Academy",
    assignedSessions: ["Fall 2025", "Annual Enrolment 2026"],
    squad: ["Ahmed Al-Saud", "Khalid Al-Mutairi", "Reem Al-Subaie", "Saif Al-Rashid", "Talal Al-Juhani"],
    phone: "+966 55 222 3344", email: "layla.h@neomora.sa",
  },
  {
    id: "st-003", name: "Bandar Al-Otaibi", role: "Coach", location: "Jeddah Branch",
    assignedSessions: ["Summer Camp 2025"],
    squad: ["Lina Al-Qahtani", "Omar Al-Harbi", "Noura Al-Ghamdi", "Abdullah Al-Shehri", "Latifa Al-Khalifa"],
    phone: "+966 56 333 4455", email: "bandar.o@neomora.sa",
  },
  {
    id: "st-004", name: "Maha Al-Zahrani", role: "Assistant Coach", location: "Jeddah Branch",
    assignedSessions: ["Summer Camp 2025"],
    squad: ["Lina Al-Qahtani", "Omar Al-Harbi", "Noura Al-Ghamdi", "Abdullah Al-Shehri", "Latifa Al-Khalifa"],
    phone: "+966 53 444 5566", email: "maha.z@neomora.sa",
  },
  {
    id: "st-005", name: "Tariq Al-Qahtani", role: "Coach", location: "Dammam Centre",
    assignedSessions: ["Winter Programme"],
    squad: ["Mariam Al-Zahrani", "Hassan Al-Anazi", "Hala Al-Fahad", "Lina Al-Qahtani", "Saif Al-Rashid"],
    phone: "+966 54 555 6677", email: "tariq.q@neomora.sa",
  },
  {
    id: "st-006", name: "Sara Al-Dossari", role: "Admin", location: "Riyadh Academy",
    assignedSessions: [],
    squad: [],
    phone: "+966 50 666 7788", email: "sara.d@neomora.sa",
  },
  {
    id: "st-007", name: "Yasmin Al-Ghamdi", role: "Admin", location: "Jeddah Branch",
    assignedSessions: [],
    squad: [],
    phone: "+966 55 777 8899", email: "yasmin.g@neomora.sa",
  },
  {
    id: "st-008", name: "Nasser Al-Subaie", role: "Assistant Coach", location: "Dammam Centre",
    assignedSessions: ["Winter Programme"],
    squad: ["Mariam Al-Zahrani", "Hassan Al-Anazi", "Hala Al-Fahad", "Reem Al-Subaie", "Khalid Al-Mutairi"],
    phone: "+966 56 888 9900", email: "nasser.s@neomora.sa",
  },
];
