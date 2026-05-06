import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, ClipboardCheck, FileText, Users } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Today", to: "/staff", icon: LayoutDashboard },
  { label: "Schedule", to: "/staff/schedule", icon: Calendar },
  { label: "Attendance", to: "/staff/attendance", icon: ClipboardCheck },
  { label: "Session notes", to: "/staff/notes", icon: FileText },
  { label: "Squad", to: "/staff/squad", icon: Users },
];

export const Route = createFileRoute("/staff")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Coach"
      user={{ name: "Mark Doyle", role: "Head Coach · Dublin North" }}
    />
  ),
});
