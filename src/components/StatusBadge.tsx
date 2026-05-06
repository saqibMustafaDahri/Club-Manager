import { cn } from "@/lib/utils";

export type StatusType =
  | "Active" | "Pending" | "On Hold" | "Withdrawn" | "Completed"
  | "Paid" | "Overdue" | "Refunded" | "Scheduled" | "Cancelled"
  | "Sent" | "Draft" | "Failed"
  | "Approved" | "Rejected"
  | "Present" | "Absent" | "Late";

const styles: Record<string, string> = {
  Active: "bg-success/10 text-success ring-success/20",
  Paid: "bg-success/10 text-success ring-success/20",
  Approved: "bg-success/10 text-success ring-success/20",
  Sent: "bg-success/10 text-success ring-success/20",
  Present: "bg-success/10 text-success ring-success/20",

  Pending: "bg-warning/10 text-warning ring-warning/20",
  Overdue: "bg-destructive/10 text-destructive ring-destructive/20",
  "On Hold": "bg-destructive/10 text-destructive ring-destructive/20",
  Failed: "bg-destructive/10 text-destructive ring-destructive/20",
  Rejected: "bg-destructive/10 text-destructive ring-destructive/20",
  Absent: "bg-destructive/10 text-destructive ring-destructive/20",
  Cancelled: "bg-destructive/10 text-destructive ring-destructive/20",

  Late: "bg-warning/10 text-warning ring-warning/20",
  Draft: "bg-muted text-muted-foreground ring-border",
  Withdrawn: "bg-muted text-muted-foreground ring-border",

  Completed: "bg-info/10 text-info ring-info/20",
  Scheduled: "bg-info/10 text-info ring-info/20",
  Refunded: "bg-info/10 text-info ring-info/20",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = styles[status] ?? "bg-muted text-muted-foreground ring-border";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", cls)}>
      {status}
    </span>
  );
}
