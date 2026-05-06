import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { staff, type StaffMember } from "@/data/staff";

export const Route = createFileRoute("/location-manager/staff")({
  component: () => {
    const data = staff.filter((s) => s.location === "Dublin North");
    const columns: Column<StaffMember>[] = [
      { key: "name", header: "Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "role", header: "Role" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      { key: "programmes", header: "Programmes", render: (r) => r.programmes.join(", ") || "—" },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Staff" breadcrumbs={[{ label: "Location Manager", to: "/location-manager" }, { label: "Staff" }]} description="Coaches and support at Dublin North." />
        <div className="p-6"><DataTable columns={columns} data={data} searchKeys={["name", "email", "role"]} onAdd={() => {}} addLabel="Invite staff" /></div>
      </>
    );
  },
});
