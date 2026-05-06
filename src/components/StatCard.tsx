import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "danger" | "brand";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  brand: "bg-brand/10 text-brand",
};

export function StatCard({ label, value, subLabel, trend = "neutral", icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {subLabel && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-success" />}
          {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
          <span
            className={cn(
              "font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {subLabel}
          </span>
        </div>
      )}
    </div>
  );
}
