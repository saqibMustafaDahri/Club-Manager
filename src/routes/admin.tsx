// import { createFileRoute, Outlet } from "@tanstack/react-router";
// import { LayoutDashboard, Building2, CalendarDays, Users, CreditCard, BarChart3, ShieldCheck, Settings } from "lucide-react";
// import { SidebarLayout } from "@/components/SidebarLayout";

// const navItems = [
//   { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
//   { label: "Locations", to: "/admin/locations", icon: Building2 },
//   { label: "Sessions", to: "/admin/sessions", icon: CalendarDays },
//   { label: "Participants", to: "/admin/participants", icon: Users },
//   { label: "Fees & Payments", to: "/admin/fees", icon: CreditCard },
//   { label: "Reports", to: "/admin/reports", icon: BarChart3 },
//   { label: "Access Control", to: "/admin/access", icon: ShieldCheck },
//   { label: "Settings", to: "/admin/settings", icon: Settings },
// ];

// export const Route = createFileRoute("/admin")({
//   component: () => (
//     <SidebarLayout
//       navItems={navItems}
//       portalLabel="Super Admin"
//       user={{ name: "John Admin", role: "admin@neomora.com" }}
//     >
//       <Outlet />
//     </SidebarLayout>
//   ),
// });
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

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  LOCATION_MANAGER: "Location Manager",
  FINANCE_OFFICER: "Finance Officer",
  STAFF_COACH: "Staff / Coach",
};

function AdminLayout() {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;

  const user = {
    // API may return name, fullName, or fall back to email
    name: parsed?.name ?? parsed?.fullName ?? parsed?.email ?? "Admin",
    // Show a human-readable role label, fall back to raw role or email
    role: roleLabel[parsed?.role] ?? parsed?.role ?? "",
  };

  return (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Super Admin"
      user={user}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});