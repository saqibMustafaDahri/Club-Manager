export interface Child {
  id: string;
  name: string;
  age: number;
  programme: string;
  location: string;
  coach: string;
  status: "Active" | "Pending" | "On Hold" | "Completed";
  nextSession: string;
}

export const children: Child[] = [
  { id: "P-2001", name: "Aria Walsh", age: 9, programme: "Football U10", location: "Dublin North", coach: "Mark Doyle", status: "Active", nextSession: "2026-05-07 16:30" },
  { id: "P-2002", name: "Cian Walsh", age: 12, programme: "Football U12", location: "Dublin North", coach: "Mark Doyle", status: "Active", nextSession: "2026-05-08 17:30" },
];

export interface GuardianInvoice {
  id: string;
  child: string;
  description: string;
  amount: number;
  dueAt: string;
  status: "Paid" | "Pending" | "Overdue";
}

export const guardianInvoices: GuardianInvoice[] = [
  { id: "INV-2026-0500", child: "Aria Walsh", description: "May 2026 — Football U10", amount: 180, dueAt: "2026-05-15", status: "Paid" },
  { id: "INV-2026-0501", child: "Cian Walsh", description: "May 2026 — Football U12", amount: 220, dueAt: "2026-05-15", status: "Pending" },
  { id: "INV-2026-0480", child: "Aria Walsh", description: "Apr 2026 — Football U10", amount: 180, dueAt: "2026-04-15", status: "Paid" },
  { id: "INV-2026-0481", child: "Cian Walsh", description: "Apr 2026 — Football U12", amount: 220, dueAt: "2026-04-15", status: "Paid" },
];
