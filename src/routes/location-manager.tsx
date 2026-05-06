import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, Users, ListOrdered, MessageSquare } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/location-manager", icon: LayoutDashboard },
  { label: "My Sessions", to: "/location-manager/sessions", icon: CalendarDays },
  { label: "Participants", to: "/location-manager/participants", icon: Users },
  { label: "Waitlist", to: "/location-manager/waitlist", icon: ListOrdered },
  { label: "Communications", to: "/location-manager/communications", icon: MessageSquare },
];

export const Route = createFileRoute("/location-manager")({
  component: () => (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Location Manager"
      user={{ name: "Sara Manager", role: "sara@neomora.com" }}
    >
      <Outlet />
    </SidebarLayout>
  ),
});
