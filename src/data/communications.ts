export interface Communication {
  id: string;
  channel: "Email" | "WhatsApp" | "SMS";
  audience: string;
  subject: string;
  sentAt: string;
  recipients: number;
  delivered: number;
  opened: number;
  status: "Sent" | "Scheduled" | "Draft" | "Failed";
}

export const communications: Communication[] = [
  { id: "C-501", channel: "Email", audience: "All Guardians, Dublin North", subject: "May fixtures schedule", sentAt: "2026-05-01", recipients: 312, delivered: 309, opened: 247, status: "Sent" },
  { id: "C-502", channel: "WhatsApp", audience: "Football U10, Dublin North", subject: "Saturday session moved to 11:00", sentAt: "2026-05-04", recipients: 18, delivered: 18, opened: 18, status: "Sent" },
  { id: "C-503", channel: "Email", audience: "Overdue invoices", subject: "Friendly reminder: payment due", sentAt: "2026-05-03", recipients: 14, delivered: 14, opened: 9, status: "Sent" },
  { id: "C-504", channel: "SMS", audience: "All staff", subject: "Coach huddle Friday 09:00", sentAt: "2026-05-06", recipients: 91, delivered: 89, opened: 0, status: "Sent" },
  { id: "C-505", channel: "Email", audience: "All Guardians, London West", subject: "Summer camp early bird now open", sentAt: "2026-05-10", recipients: 421, delivered: 0, opened: 0, status: "Scheduled" },
  { id: "C-506", channel: "WhatsApp", audience: "Athletics U14", subject: "Kit collection reminder", sentAt: "-", recipients: 0, delivered: 0, opened: 0, status: "Draft" },
];
