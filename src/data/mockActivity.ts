export type ActivityType = "registration" | "payment" | "document" | "status";

export interface MockActivity {
  id: string;
  action: string;
  subject: string;
  timestamp: string;
  type: ActivityType;
}

export const mockActivity: MockActivity[] = [
  { id: "a-01", action: "New registration submitted", subject: "Mariam Al-Zahrani", timestamp: "2025-11-02T14:00:00Z", type: "registration" },
  { id: "a-02", action: "Payment received (SAR 500)", subject: "Yousef Al-Otaibi", timestamp: "2025-09-05T09:12:00Z", type: "payment" },
  { id: "a-03", action: "Medical form uploaded", subject: "Lina Al-Qahtani", timestamp: "2025-06-02T10:45:00Z", type: "document" },
  { id: "a-04", action: "Status changed to Active", subject: "Hassan Al-Anazi", timestamp: "2025-12-22T08:30:00Z", type: "status" },
  { id: "a-05", action: "Payment overdue flagged", subject: "Noura Al-Ghamdi", timestamp: "2025-07-23T07:00:00Z", type: "payment" },
  { id: "a-06", action: "Documents pending reminder sent", subject: "Omar Al-Harbi", timestamp: "2025-06-25T11:20:00Z", type: "document" },
  { id: "a-07", action: "New registration submitted", subject: "Saif Al-Rashid", timestamp: "2025-11-25T16:10:00Z", type: "registration" },
  { id: "a-08", action: "Status changed to Withdrawn", subject: "Abdullah Al-Shehri", timestamp: "2025-07-20T13:00:00Z", type: "status" },
  { id: "a-09", action: "Payment received (SAR 1,800)", subject: "Khalid Al-Mutairi", timestamp: "2025-11-20T15:00:00Z", type: "payment" },
  { id: "a-10", action: "Photo uploaded", subject: "Latifa Al-Khalifa", timestamp: "2025-06-12T09:00:00Z", type: "document" },
  { id: "a-11", action: "Status changed to On Hold", subject: "Noura Al-Ghamdi", timestamp: "2025-07-01T08:30:00Z", type: "status" },
  { id: "a-12", action: "New registration submitted", subject: "Hala Al-Fahad", timestamp: "2025-12-28T12:00:00Z", type: "registration" },
  { id: "a-13", action: "Payment received (SAR 2,000)", subject: "Lina Al-Qahtani", timestamp: "2025-09-02T10:00:00Z", type: "payment" },
  { id: "a-14", action: "ID copy under review", subject: "Talal Al-Juhani", timestamp: "2025-10-05T09:15:00Z", type: "document" },
  { id: "a-15", action: "Status changed to Completed", subject: "Fatima Al-Dossari", timestamp: "2025-05-16T10:00:00Z", type: "status" },
];
