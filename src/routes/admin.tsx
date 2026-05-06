import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Building2, CalendarDays, Users, CreditCard, BarChart3, ShieldCheck, Settings } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Locations", to: "/admin/locations", icon: Building2 },
  { label: "Sessions", to: "/admin/sessions", icon: CalendarDays },
  { label: "Participants", to: "/admin/participants", icon: Users },
  { label: "Fees & Payments", to: "/admin/fees", icon: CreditCard },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Access Control", to: "/admin/access", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Super Admin"
      user={{ name: "John Admin", role: "admin@neomora.com" }}
    >
      <Outlet />
    </SidebarLayout>
  ),
});
