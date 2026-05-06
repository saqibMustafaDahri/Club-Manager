import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { children, type Child } from "@/data/guardian";

export const Route = createFileRoute("/guardian/children")({
  component: () => {
    const columns: Column<Child>[] = [
      { key: "name", header: "Name", render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "age", header: "Age" },
      { key: "programme", header: "Programme" },
      { key: "coach", header: "Coach" },
      { key: "location", header: "Location" },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="My children" breadcrumbs={[{ label: "Guardian", to: "/guardian" }, { label: "Children" }]} description="Manage enrolment and details." />
        <div className="p-6"><DataTable columns={columns} data={children} searchKeys={["name", "programme"]} onAdd={() => {}} addLabel="Add child" /></div>
      </>
    );
  },
});
