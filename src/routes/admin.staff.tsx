import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { staff, type StaffMember } from "@/data/staff";

export const Route = createFileRoute("/admin/staff")({
  component: StaffPage,
});

const columns: Column<StaffMember>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "role", header: "Role" },
  { key: "location", header: "Location", sortable: true },
  { key: "email", header: "Email", render: (r) => <span className="text-muted-foreground">{r.email}</span> },
  { key: "programmes", header: "Programmes", render: (r) => r.programmes.length ? r.programmes.join(", ") : <span className="text-muted-foreground">—</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

function StaffPage() {
  return (
    <>
      <PageHeader
        title="Staff"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Staff" }]}
        description="Coaches, managers, and support staff across your network."
      />
      <div className="p-6">
        <DataTable
          columns={columns}
          data={staff}
          searchKeys={["name", "email", "location", "role"]}
          searchPlaceholder="Search staff…"
          onAdd={() => {}}
          addLabel="Invite staff"
        />
      </div>
    </>
  );
}
