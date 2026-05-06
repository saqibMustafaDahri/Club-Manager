export interface AlertItemData {
  id: string;
  severity: "info" | "success" | "warning" | "danger";
  title: string;
  message: string;
  time: string;
}

export const alerts: AlertItemData[] = [
  { id: "A-1", severity: "danger", title: "5 invoices overdue", message: "Total €960 outstanding across Dublin North & Berlin Mitte.", time: "2h ago" },
  { id: "A-2", severity: "warning", title: "Capacity nearing limit", message: "Football U12 (London West) is at 22/22 enrolled.", time: "4h ago" },
  { id: "A-3", severity: "success", title: "12 new enrolments this week", message: "+18% vs last week. Top programme: Multi-Sport U8.", time: "Yesterday" },
  { id: "A-4", severity: "info", title: "Scheduled message ready", message: "Summer camp campaign queued for London West guardians.", time: "Yesterday" },
];
