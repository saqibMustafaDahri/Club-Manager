import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, Calendar, ClipboardCheck } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/staff", icon: LayoutDashboard },
  { label: "My Squad", to: "/staff/squad", icon: Users },
  { label: "Sessions", to: "/staff/sessions", icon: Calendar },
  { label: "Attendance", to: "/staff/attendance", icon: ClipboardCheck },
];

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  LOCATION_MANAGER: "Location Manager",
  FINANCE_OFFICER: "Finance Officer",
  STAFF_COACH: "Staff / Coach",
};

function StaffLayout() {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;

  const user = {
    name: parsed?.name ?? parsed?.fullName ?? parsed?.email ?? "Staff",
    role: roleLabel[parsed?.role] ?? parsed?.role ?? "",
  };

  return (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Staff"
      user={user}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export const Route = createFileRoute("/staff")({
  component: StaffLayout,
});
