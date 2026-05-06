import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { participants, type Participant } from "@/data/participants";

export const Route = createFileRoute("/admin/participants")({
  component: ParticipantsPage,
});

const columns: Column<Participant>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "name", header: "Name", sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "age", header: "Age", sortable: true },
  { key: "guardianName", header: "Guardian" },
  { key: "location", header: "Location", sortable: true },
  { key: "programme", header: "Programme" },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "outstandingFees", header: "Outstanding", render: (r) => r.outstandingFees > 0 ? <span className="font-medium text-destructive">€{r.outstandingFees}</span> : <span className="text-muted-foreground">—</span> },
];

function ParticipantsPage() {
  return (
    <>
      <PageHeader
        title="Participants"
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "Participants" }]}
        description="Every participant across all locations."
      />
      <div className="p-6">
        <DataTable
          columns={columns}
          data={participants}
          searchKeys={["name", "guardianName", "id", "location"]}
          searchPlaceholder="Search participants…"
          onAdd={() => {}}
          addLabel="Add participant"
        />
      </div>
    </>
  );
}
