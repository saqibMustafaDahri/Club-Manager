import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, Calendar, ClipboardCheck } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/staff", icon: LayoutDashboard },
  { label: "My Squad", to: "/staff/squad", icon: Users },
  { label: "Sessions", to: "/staff/sessions", icon: Calendar },
  { label: "Attendance", to: "/staff/attendance", icon: ClipboardCheck },
];

export const Route = createFileRoute("/staff")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Staff"
      user={{ name: "Ahmed Coach", role: "ahmed@neomora.com" }}
    />
  ),
});
