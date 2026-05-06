import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, Building2, UserCog, MessageSquare, BarChart3, Settings } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Participants", to: "/admin/participants", icon: Users },
  { label: "Locations", to: "/admin/locations", icon: Building2 },
  { label: "Staff", to: "/admin/staff", icon: UserCog },
  { label: "Communications", to: "/admin/communications", icon: MessageSquare },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Super Admin"
      user={{ name: "Alex Murray", role: "Super Admin" }}
    />
  ),
});
