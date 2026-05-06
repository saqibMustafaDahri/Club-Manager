import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, CalendarClock, FileText, BellRing, BarChart3 } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/finance", icon: LayoutDashboard },
  { label: "Fee Collection", to: "/finance/collection", icon: Wallet },
  { label: "Payment Plans", to: "/finance/plans", icon: CalendarClock },
  { label: "Invoices", to: "/finance/invoices", icon: FileText },
  { label: "Reminders", to: "/finance/reminders", icon: BellRing },
  { label: "Reports", to: "/finance/reports", icon: BarChart3 },
];

export const Route = createFileRoute("/finance")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Finance"
      user={{ name: "Khalid Finance", role: "khalid@neomora.com" }}
    />
  ),
});
