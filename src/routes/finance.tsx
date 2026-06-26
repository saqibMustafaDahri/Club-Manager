import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, CalendarClock, FileText, BellRing, BarChart3 } from "lucide-react";
import { SidebarLayout } from "@/components/SidebarLayout";

const navItems = [
  { label: "Dashboard", to: "/finance", icon: LayoutDashboard },
  { label: "Fee Collection", to: "/finance/collection", icon: Wallet },
  { label: "Payment Plans", to: "/finance/plans", icon: CalendarClock },
  { label: "Invoices", to: "/finance/invoices", icon: FileText },
  { label: "Reminders", to: "/finance/reminders", icon: BellRing },
  { label: "Reports", to: "/finance/reports", icon: BarChart3 },
];

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  LOCATION_MANAGER: "Location Manager",
  FINANCE_OFFICER: "Finance Officer",
  STAFF_COACH: "Staff / Coach",
};

function FinanceLayout() {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;

  // Log to browser console so we can see what the API returns
  console.log("[FinanceLayout] stored user:", parsed);

  const user = {
    name: parsed?.name || parsed?.fullName || parsed?.email || "Finance Officer",
    role: roleLabel[parsed?.role] || parsed?.role || "Finance Officer",
  };

  return (
    <SidebarLayout
      navItems={navItems}
      portalLabel="Finance"
      user={user}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export const Route = createFileRoute("/finance")({
  component: FinanceLayout,
});
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

// const roleLabel: Record<string, string> = {
//   SUPER_ADMIN: "Super Admin",
//   LOCATION_MANAGER: "Location Manager",
//   FINANCE_OFFICER: "Finance Officer",
//   STAFF_COACH: "Staff / Coach",
// };

// function FinanceLayout() {
//   const stored = localStorage.getItem("user");
//   const parsed = stored ? JSON.parse(stored) : null;

//   const user = {
//     name: parsed?.name ?? parsed?.fullName ?? parsed?.email ?? "Manager",
//     role: roleLabel[parsed?.role] ?? parsed?.role ?? "",
//   };

//   return (
//     <SidebarLayout
//       navItems={navItems}
//       portalLabel="Location Manager"
//       user={user}
//     >
//       <Outlet />
//     </SidebarLayout>
//   );
// }

// export const Route = createFileRoute("/finance")({
//   component: FinanceLayout,
// });