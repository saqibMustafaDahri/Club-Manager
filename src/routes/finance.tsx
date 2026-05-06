import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, FileText, CreditCard, Undo2, BarChart3 } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/finance", icon: LayoutDashboard },
  { label: "Invoices", to: "/finance/invoices", icon: FileText },
  { label: "Payments", to: "/finance/payments", icon: CreditCard },
  { label: "Refunds", to: "/finance/refunds", icon: Undo2 },
  { label: "Reports", to: "/finance/reports", icon: BarChart3 },
];

export const Route = createFileRoute("/finance")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Finance"
      user={{ name: "Helena Brady", role: "Finance Officer" }}
    />
  ),
});
