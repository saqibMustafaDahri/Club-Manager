import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, Calendar, FileText, MessageSquare } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Overview", to: "/guardian", icon: LayoutDashboard },
  { label: "My children", to: "/guardian/children", icon: Users },
  { label: "Sessions", to: "/guardian/sessions", icon: Calendar },
  { label: "Payments", to: "/guardian/payments", icon: FileText },
  { label: "Messages", to: "/guardian/messages", icon: MessageSquare },
];

export const Route = createFileRoute("/guardian")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Guardian"
      user={{ name: "Niamh Walsh", role: "Parent / Guardian" }}
    />
  ),
});
