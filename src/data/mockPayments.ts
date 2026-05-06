export type PaymentPlan = "Full" | "Monthly" | "Seasonal";
export type PaymentStatus = "Paid" | "Partial" | "Overdue" | "Pending";
export type PaymentMethod = "Card" | "Cash" | "Bank Transfer";

export interface PaymentInvoice {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  receiptUrl: string;
}

export interface MockPayment {
  id: string;
  participantId: string;
  participantName: string;
  location: string;
  session: string;
  plan: PaymentPlan;
  totalFee: number;
  paidAmount: number;
  balance: number;
  status: PaymentStatus;
  lastPaymentDate: string;
  nextDueDate: string;
  invoices: PaymentInvoice[];
}

const make = (
  id: string,
  participantId: string,
  participantName: string,
  location: string,
  session: string,
  plan: PaymentPlan,
  totalFee: number,
  paidAmount: number,
  status: PaymentStatus,
  lastPaymentDate: string,
  nextDueDate: string,
  invoices: PaymentInvoice[],
): MockPayment => ({
  id, participantId, participantName, location, session, plan,
  totalFee, paidAmount, balance: totalFee - paidAmount,
  status, lastPaymentDate, nextDueDate, invoices,
});

export const mockPayments: MockPayment[] = [
  make("pay-001", "p-001", "Ahmed Al-Saud", "Riyadh Academy", "Spring 2025", "Full", 1800, 1800, "Paid", "2025-02-10", "-",
    [{ id: "INV-1001", amount: 1800, date: "2025-02-10", method: "Card", receiptUrl: "#" }]),
  make("pay-002", "p-002", "Lina Al-Qahtani", "Jeddah Branch", "Summer Camp 2025", "Full", 1200, 1200, "Paid", "2025-06-01", "-",
    [{ id: "INV-1002", amount: 1200, date: "2025-06-01", method: "Bank Transfer", receiptUrl: "#" }]),
  make("pay-003", "p-003", "Yousef Al-Otaibi", "Riyadh Academy", "Fall 2025", "Monthly", 2000, 500, "Partial", "2025-09-05", "2025-10-05",
    [{ id: "INV-1003", amount: 500, date: "2025-09-05", method: "Card", receiptUrl: "#" }]),
  make("pay-004", "p-004", "Mariam Al-Zahrani", "Dammam Centre", "Winter Programme", "Seasonal", 1500, 0, "Pending", "-", "2025-12-15",
    []),
  make("pay-005", "p-005", "Omar Al-Harbi", "Jeddah Branch", "Summer Camp 2025", "Monthly", 1200, 600, "Partial", "2025-06-20", "2025-07-20",
    [{ id: "INV-1004", amount: 600, date: "2025-06-20", method: "Cash", receiptUrl: "#" }]),
  make("pay-006", "p-006", "Fatima Al-Dossari", "Riyadh Academy", "Spring 2025", "Full", 1800, 1800, "Paid", "2025-02-08", "-",
    [{ id: "INV-1005", amount: 1800, date: "2025-02-08", method: "Card", receiptUrl: "#" }]),
  make("pay-007", "p-007", "Khalid Al-Mutairi", "Riyadh Academy", "Fall 2025", "Full", 2000, 2000, "Paid", "2025-09-04", "-",
    [{ id: "INV-1006", amount: 2000, date: "2025-09-04", method: "Bank Transfer", receiptUrl: "#" }]),
  make("pay-008", "p-008", "Noura Al-Ghamdi", "Jeddah Branch", "Summer Camp 2025", "Monthly", 1200, 400, "Overdue", "2025-06-22", "2025-07-22",
    [{ id: "INV-1007", amount: 400, date: "2025-06-22", method: "Card", receiptUrl: "#" }]),
  make("pay-009", "p-009", "Hassan Al-Anazi", "Dammam Centre", "Winter Programme", "Seasonal", 1500, 1500, "Paid", "2025-12-22", "-",
    [{ id: "INV-1008", amount: 1500, date: "2025-12-22", method: "Cash", receiptUrl: "#" }]),
  make("pay-010", "p-010", "Reem Al-Subaie", "Riyadh Academy", "Fall 2025", "Monthly", 2000, 1000, "Partial", "2025-10-10", "2025-11-10",
    [
      { id: "INV-1009", amount: 500, date: "2025-09-10", method: "Card", receiptUrl: "#" },
      { id: "INV-1010", amount: 500, date: "2025-10-10", method: "Card", receiptUrl: "#" },
    ]),
  make("pay-011", "p-011", "Abdullah Al-Shehri", "Jeddah Branch", "Summer Camp 2025", "Full", 1200, 600, "Overdue", "2025-06-05", "2025-07-05",
    [{ id: "INV-1011", amount: 600, date: "2025-06-05", method: "Bank Transfer", receiptUrl: "#" }]),
  make("pay-012", "p-012", "Hala Al-Fahad", "Dammam Centre", "Winter Programme", "Full", 1500, 0, "Pending", "-", "2026-01-05",
    []),
  make("pay-013", "p-013", "Saif Al-Rashid", "Riyadh Academy", "Annual Enrolment 2026", "Seasonal", 5400, 0, "Pending", "-", "2026-01-15",
    []),
  make("pay-014", "p-014", "Latifa Al-Khalifa", "Jeddah Branch", "Summer Camp 2025", "Full", 1200, 1200, "Paid", "2025-06-12", "-",
    [{ id: "INV-1012", amount: 1200, date: "2025-06-12", method: "Card", receiptUrl: "#" }]),
  make("pay-015", "p-015", "Talal Al-Juhani", "Riyadh Academy", "Fall 2025", "Monthly", 2000, 800, "Overdue", "2025-09-15", "2025-10-15",
    [
      { id: "INV-1013", amount: 400, date: "2025-09-15", method: "Card", receiptUrl: "#" },
      { id: "INV-1014", amount: 400, date: "2025-10-01", method: "Card", receiptUrl: "#" },
    ]),
  make("pay-016", "p-001", "Ahmed Al-Saud", "Riyadh Academy", "Fall 2025", "Monthly", 2000, 1500, "Partial", "2025-11-01", "2025-12-01",
    [
      { id: "INV-1015", amount: 500, date: "2025-09-01", method: "Card", receiptUrl: "#" },
      { id: "INV-1016", amount: 500, date: "2025-10-01", method: "Card", receiptUrl: "#" },
      { id: "INV-1017", amount: 500, date: "2025-11-01", method: "Card", receiptUrl: "#" },
    ]),
  make("pay-017", "p-002", "Lina Al-Qahtani", "Jeddah Branch", "Fall 2025", "Full", 2000, 2000, "Paid", "2025-09-02", "-",
    [{ id: "INV-1018", amount: 2000, date: "2025-09-02", method: "Bank Transfer", receiptUrl: "#" }]),
  make("pay-018", "p-007", "Khalid Al-Mutairi", "Riyadh Academy", "Annual Enrolment 2026", "Seasonal", 5400, 1800, "Partial", "2025-11-20", "2026-02-20",
    [{ id: "INV-1019", amount: 1800, date: "2025-11-20", method: "Bank Transfer", receiptUrl: "#" }]),
  make("pay-019", "p-009", "Hassan Al-Anazi", "Dammam Centre", "Spring 2025", "Full", 1800, 1800, "Paid", "2025-02-15", "-",
    [{ id: "INV-1020", amount: 1800, date: "2025-02-15", method: "Cash", receiptUrl: "#" }]),
  make("pay-020", "p-010", "Reem Al-Subaie", "Riyadh Academy", "Annual Enrolment 2026", "Monthly", 5400, 450, "Partial", "2026-01-20", "2026-02-20",
    [{ id: "INV-1021", amount: 450, date: "2026-01-20", method: "Card", receiptUrl: "#" }]),
];
