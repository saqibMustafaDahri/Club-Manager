export type AlertSeverity = "error" | "warning" | "info";

export interface MockAlert {
  id: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  resolved: boolean;
}

export const mockAlerts: MockAlert[] = [
  { id: "al-01", message: "3 payments are overdue at Jeddah Branch.", severity: "error", timestamp: "2025-11-15T08:00:00Z", resolved: false },
  { id: "al-02", message: "Riyadh Academy is at 78% capacity.", severity: "warning", timestamp: "2025-11-14T09:30:00Z", resolved: false },
  { id: "al-03", message: "5 participants have missing documents.", severity: "warning", timestamp: "2025-11-12T11:15:00Z", resolved: false },
  { id: "al-04", message: "Winter Programme enrolment opens in 7 days.", severity: "info", timestamp: "2025-11-10T07:00:00Z", resolved: false },
  { id: "al-05", message: "Coach Bandar requested schedule change.", severity: "info", timestamp: "2025-11-08T14:20:00Z", resolved: true },
  { id: "al-06", message: "Bank reconciliation failed for INV-1011.", severity: "error", timestamp: "2025-11-06T10:00:00Z", resolved: false },
  { id: "al-07", message: "Annual Enrolment 2026 launching soon.", severity: "info", timestamp: "2025-11-05T09:00:00Z", resolved: false },
  { id: "al-08", message: "2 staff certifications expire next month.", severity: "warning", timestamp: "2025-11-03T13:45:00Z", resolved: false },
];
