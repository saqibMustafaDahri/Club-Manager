import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, Calendar, UserCog, MessageSquare } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/location-manager", icon: LayoutDashboard },
  { label: "Participants", to: "/location-manager/participants", icon: Users },
  { label: "Sessions", to: "/location-manager/sessions", icon: Calendar },
  { label: "Staff", to: "/location-manager/staff", icon: UserCog },
  { label: "Messages", to: "/location-manager/messages", icon: MessageSquare },
];

export const Route = createFileRoute("/location-manager")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Location Manager"
      user={{ name: "Sinead Kelly", role: "Manager · Dublin North" }}
    />
  ),
});
