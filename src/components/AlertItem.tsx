import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import type { AlertItemData } from "@/data/alerts";

const config = {
  info: { icon: Info, ring: "ring-info/20", bg: "bg-info/10", text: "text-info" },
  success: { icon: CheckCircle2, ring: "ring-success/20", bg: "bg-success/10", text: "text-success" },
  warning: { icon: AlertTriangle, ring: "ring-warning/20", bg: "bg-warning/10", text: "text-warning" },
  danger: { icon: AlertCircle, ring: "ring-destructive/20", bg: "bg-destructive/10", text: "text-destructive" },
};

export function AlertItem({ alert }: { alert: AlertItemData }) {
  const c = config[alert.severity];
  const Icon = c.icon;
  return (
    <div className={cn("flex gap-3 rounded-lg p-3 ring-1 ring-inset", c.bg, c.ring)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", c.text)} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{alert.title}</p>
          <span className="text-xs text-muted-foreground">{alert.time}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{alert.message}</p>
      </div>
    </div>
  );
}
