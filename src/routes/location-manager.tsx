// import { createFileRoute, Outlet } from "@tanstack/react-router";
// import { LayoutDashboard, CalendarDays, Users, ListOrdered, MessageSquare } from "lucide-react";
// import { SidebarLayout } from "@/components/SidebarLayout";

// const navItems = [
//   { label: "Dashboard", to: "/location-manager", icon: LayoutDashboard },
//   { label: "My Sessions", to: "/location-manager/sessions", icon: CalendarDays },
//   { label: "Participants", to: "/location-manager/participants", icon: Users },
//   { label: "Waitlist", to: "/location-manager/waitlist", icon: ListOrdered },
//   { label: "Communications", to: "/location-manager/communications", icon: MessageSquare },
// ];

// export const Route = createFileRoute("/location-manager")({
//   component: () => (
//     <SidebarLayout
//       navItems={navItems}
//       portalLabel="Location Manager"
//       user={{ name: "Sara Manager", role: "sara@neomora.com" }}
//     >
//       <Outlet />
//     </SidebarLayout>
//   ),
// });
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, Users, ListOrdered, MessageSquare } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/location-manager", icon: LayoutDashboard },
  { label: "My Sessions", to: "/location-manager/sessions", icon: CalendarDays },
  { label: "Participants", to: "/location-manager/participants", icon: Users },
  { label: "Enrolments", to: "/location-manager/enrolments", icon: Users },
  { label: "Waitlist", to: "/location-manager/waitlist", icon: ListOrdered },
  { label: "Communications", to: "/location-manager/communications", icon: MessageSquare },
];

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  LOCATION_MANAGER: "Location Manager",
  FINANCE_OFFICER: "Finance Officer",
  STAFF_COACH: "Staff / Coach",
};

function LocationManagerLayout() {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;

  const user = {
    name: parsed?.name ?? parsed?.fullName ?? parsed?.email ?? "Manager",
    role: roleLabel[parsed?.role] ?? parsed?.role ?? "",
  };

  return (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Location Manager"
      user={user}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export const Route = createFileRoute("/location-manager")({
  component: LocationManagerLayout,
});