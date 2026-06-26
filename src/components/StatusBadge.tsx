import { cn } from "@/lib/utils";

export type StatusType =
  | "Active" | "Pending" | "On Hold" | "Withdrawn" | "Completed"
  | "Paid" | "Overdue" | "Refunded" | "Scheduled" | "Cancelled"
  | "Sent" | "Draft" | "Failed"
  | "Approved" | "Rejected"
  | "Present" | "Absent" | "Late";

const styles: Record<string, string> = {
  active: "bg-success/10 text-success ring-success/20",
  paid: "bg-success/10 text-success ring-success/20",
  approved: "bg-success/10 text-success ring-success/20",
  sent: "bg-success/10 text-success ring-success/20",
  present: "bg-success/10 text-success ring-success/20",
  open: "bg-success/10 text-success ring-success/20",

  pending: "bg-warning/10 text-warning ring-warning/20",
  overdue: "bg-destructive/10 text-destructive ring-destructive/20",
  "on hold": "bg-destructive/10 text-destructive ring-destructive/20",
  failed: "bg-destructive/10 text-destructive ring-destructive/20",
  rejected: "bg-destructive/10 text-destructive ring-destructive/20",
  absent: "bg-destructive/10 text-destructive ring-destructive/20",
  cancelled: "bg-destructive/10 text-destructive ring-destructive/20",

  late: "bg-warning/10 text-warning ring-warning/20",
  maintenance: "bg-warning/10 text-warning ring-warning/20",
  draft: "bg-muted text-muted-foreground ring-border",
  withdrawn: "bg-muted text-muted-foreground ring-border",
  inactive: "bg-muted text-muted-foreground ring-border",

  completed: "bg-info/10 text-info ring-info/20",
  scheduled: "bg-info/10 text-info ring-info/20",
  refunded: "bg-info/10 text-info ring-info/20",
  closed: "bg-info/10 text-info ring-info/20",
};

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return null;
  const key = status.toLowerCase();
  const cls = styles[key] ?? "bg-muted text-muted-foreground ring-border";
  const display = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", cls)}>
      {display}
    </span>
  );
}
