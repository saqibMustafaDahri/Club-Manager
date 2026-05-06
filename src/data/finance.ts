export interface Invoice {
  id: string;
  participant: string;
  guardian: string;
  location: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: "Paid" | "Pending" | "Overdue" | "Refunded";
}

export const invoices: Invoice[] = [
  { id: "INV-2026-0412", participant: "Liam O'Connor", guardian: "Aoife O'Connor", location: "Dublin North", amount: 180, issuedAt: "2026-04-01", dueAt: "2026-04-15", status: "Paid" },
  { id: "INV-2026-0413", participant: "Sofia Martins", guardian: "Bruno Martins", location: "London West", amount: 220, issuedAt: "2026-04-01", dueAt: "2026-04-15", status: "Paid" },
  { id: "INV-2026-0414", participant: "Noah Schmidt", guardian: "Hannah Schmidt", location: "Berlin Mitte", amount: 180, issuedAt: "2026-04-01", dueAt: "2026-04-15", status: "Pending" },
  { id: "INV-2026-0415", participant: "Maya Patel", guardian: "Ravi Patel", location: "London West", amount: 240, issuedAt: "2026-04-01", dueAt: "2026-04-15", status: "Paid" },
  { id: "INV-2026-0416", participant: "Jakub Nowak", guardian: "Eva Nowak", location: "Dublin North", amount: 240, issuedAt: "2026-03-15", dueAt: "2026-03-30", status: "Overdue" },
  { id: "INV-2026-0417", participant: "Chloe Dubois", guardian: "Marc Dubois", location: "Paris Sud", amount: 200, issuedAt: "2026-04-01", dueAt: "2026-04-15", status: "Paid" },
  { id: "INV-2026-0418", participant: "Aria Costa", guardian: "Diego Costa", location: "Lisbon Centre", amount: 60, issuedAt: "2026-04-10", dueAt: "2026-04-25", status: "Pending" },
  { id: "INV-2026-0419", participant: "Owen Byrne", guardian: "Sarah Byrne", location: "Dublin North", amount: 180, issuedAt: "2026-04-01", dueAt: "2026-04-15", status: "Paid" },
  { id: "INV-2026-0420", participant: "Yusuf Demir", guardian: "Selin Demir", location: "London West", amount: 220, issuedAt: "2026-04-12", dueAt: "2026-04-26", status: "Paid" },
  { id: "INV-2026-0421", participant: "Mila Andersen", guardian: "Lars Andersen", location: "Copenhagen", amount: 120, issuedAt: "2026-04-30", dueAt: "2026-05-14", status: "Pending" },
  { id: "INV-2026-0399", participant: "Liam O'Connor", guardian: "Aoife O'Connor", location: "Dublin North", amount: 60, issuedAt: "2026-03-01", dueAt: "2026-03-15", status: "Refunded" },
];

export interface Payment {
  id: string;
  invoiceId: string;
  paidAt: string;
  method: "Card" | "Bank Transfer" | "Cash" | "Direct Debit";
  amount: number;
  guardian: string;
}

export const payments: Payment[] = [
  { id: "PAY-9001", invoiceId: "INV-2026-0412", paidAt: "2026-04-03", method: "Card", amount: 180, guardian: "Aoife O'Connor" },
  { id: "PAY-9002", invoiceId: "INV-2026-0413", paidAt: "2026-04-04", method: "Direct Debit", amount: 220, guardian: "Bruno Martins" },
  { id: "PAY-9003", invoiceId: "INV-2026-0415", paidAt: "2026-04-05", method: "Card", amount: 240, guardian: "Ravi Patel" },
  { id: "PAY-9004", invoiceId: "INV-2026-0417", paidAt: "2026-04-06", method: "Bank Transfer", amount: 200, guardian: "Marc Dubois" },
  { id: "PAY-9005", invoiceId: "INV-2026-0419", paidAt: "2026-04-07", method: "Card", amount: 180, guardian: "Sarah Byrne" },
  { id: "PAY-9006", invoiceId: "INV-2026-0420", paidAt: "2026-04-13", method: "Card", amount: 220, guardian: "Selin Demir" },
];

export interface Refund {
  id: string;
  invoiceId: string;
  guardian: string;
  amount: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: string;
}

export const refunds: Refund[] = [
  { id: "REF-301", invoiceId: "INV-2026-0399", guardian: "Aoife O'Connor", amount: 60, reason: "Cancelled session — coach unavailable", status: "Approved", requestedAt: "2026-03-20" },
  { id: "REF-302", invoiceId: "INV-2026-0414", guardian: "Hannah Schmidt", amount: 60, reason: "Withdrew within trial week", status: "Pending", requestedAt: "2026-04-25" },
  { id: "REF-303", invoiceId: "INV-2026-0421", guardian: "Lars Andersen", amount: 30, reason: "Sibling discount adjustment", status: "Pending", requestedAt: "2026-05-02" },
];
