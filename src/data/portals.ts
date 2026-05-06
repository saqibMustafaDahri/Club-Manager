import { Shield, Building2, DollarSign, Users, Whistle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PortalKey = "admin" | "location-manager" | "finance" | "guardian" | "staff";

export interface Portal {
  key: PortalKey;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export const PORTALS: Portal[] = [
  { key: "admin", name: "Super Admin", shortName: "Admin", description: "Oversee every academy, location, and user from one console.", icon: Shield, path: "/admin" },
  { key: "location-manager", name: "Location Manager", shortName: "Manager", description: "Run day-to-day operations for your academy location.", icon: Building2, path: "/location-manager" },
  { key: "finance", name: "Finance Officer", shortName: "Finance", description: "Track invoices, payments, refunds, and revenue.", icon: DollarSign, path: "/finance" },
  { key: "guardian", name: "Parent / Guardian", shortName: "Guardian", description: "Manage your children's enrolment, fees, and sessions.", icon: Users, path: "/guardian" },
  { key: "staff", name: "Staff / Coach", shortName: "Coach", description: "View schedule, take attendance, and log session notes.", icon: Whistle, path: "/staff" },
];
