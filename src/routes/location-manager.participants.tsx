import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { participants, type Participant } from "@/data/participants";

export const Route = createFileRoute("/location-manager/participants")({
  component: () => {
    const data = participants.filter((p) => p.location === "Dublin North");
    const columns: Column<Participant>[] = [
      { key: "id", header: "ID", sortable: true },
      { key: "name", header: "Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
      { key: "age", header: "Age" },
      { key: "guardianName", header: "Guardian" },
      { key: "guardianPhone", header: "Phone" },
      { key: "programme", header: "Programme" },
      { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    ];
    return (
      <>
        <PageHeader title="Participants" breadcrumbs={[{ label: "Location Manager", to: "/location-manager" }, { label: "Participants" }]} description="Participants enrolled at Dublin North." />
        <div className="p-6">
          <DataTable columns={columns} data={data} searchKeys={["name", "guardianName", "programme"]} searchPlaceholder="Search participants…" onAdd={() => {}} addLabel="Enrol participant" />
        </div>
      </>
    );
  },
});
